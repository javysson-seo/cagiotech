import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Webhook is server-to-server, CORS not needed
// Reject browser preflight requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "null",
  "Access-Control-Allow-Headers": "content-type",
};

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 10) { // Max 10 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
};

// Helper function to create HMAC signature using Web Crypto API
const createHmacSignature = async (key: string, data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

const validateIfthenPaySignature = async (
  payload: any,
  antiPhishingKey: string
): Promise<boolean> => {
  if (!payload.key || !antiPhishingKey) {
    return false;
  }
  
  // Multibanco signature: entity + reference + value + key
  if (payload.reference && payload.value) {
    const dataToSign = `${payload.reference}${payload.value}`;
    const expectedKey = await createHmacSignature(antiPhishingKey, dataToSign);
    
    return payload.key === expectedKey;
  }
  
  // MBWay signature validation (if applicable)
  if (payload.orderId && payload.amount) {
    const dataToSign = `${payload.orderId}${payload.amount}`;
    const expectedKey = await createHmacSignature(antiPhishingKey, dataToSign);
    
    return payload.key === expectedKey;
  }
  
  return false;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests" }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    console.log("Received IfthenPay webhook", { ip: clientIp });

    // Parsear o payload (pode vir como query params ou JSON)
    let payload: any = {};
    
    if (req.method === "POST") {
      const contentType = req.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        payload = await req.json();
      } else {
        // Form data
        const formData = await req.formData();
        payload = Object.fromEntries(formData.entries());
      }
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      payload = Object.fromEntries(url.searchParams.entries());
    }

    console.log("Webhook payload:", payload);

    // Get anti-phishing key for validation
    const antiPhishingKey = Deno.env.get("IFTHENPAY_ANTI_PHISHING_KEY");
    
    if (!antiPhishingKey) {
      console.error("IFTHENPAY_ANTI_PHISHING_KEY not configured");
      // Log to database even without validation for monitoring
      await supabaseClient
        .from("payment_webhooks_log")
        .insert({
          company_id: null,
          gateway_type: "ifthenpay",
          payload: payload,
          status: "failed",
          error_message: "Anti-phishing key not configured",
        });
      
      return new Response(
        JSON.stringify({ error: "Configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate webhook signature
    if (!(await validateIfthenPaySignature(payload, antiPhishingKey))) {
      console.error("Invalid webhook signature", { payload });
      
      // Log suspicious activity
      await supabaseClient
        .from("payment_webhooks_log")
        .insert({
          company_id: null,
          gateway_type: "ifthenpay",
          payload: payload,
          status: "failed",
          error_message: "Invalid signature - possible forgery attempt",
        });
      
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("Webhook signature validated successfully");

    // Identificar tipo de callback (Multibanco ou MBWay)
    let transaction_id: string | null = null;
    let reference: string | null = null;
    let gateway_type = "ifthenpay";
    let company_id: string | null = null;

    // Multibanco callback format: ?key=&reference=&value=
    if (payload.reference && payload.key) {
      reference = payload.reference;
      console.log("Multibanco callback - Reference:", reference);
      
      // Buscar transação pela referência
      const { data: transaction } = await supabaseClient
        .from("payment_transactions")
        .select("id, company_id, payment_method")
        .eq("reference", reference)
        .single();
      
      if (transaction) {
        transaction_id = transaction.id;
        company_id = transaction.company_id;
      }
    }
    // MBWay callback format: ?orderId=&amount=&requestId=&status=
    else if (payload.orderId || payload.requestId) {
      const requestId = payload.requestId || payload.IdPedido;
      console.log("MBWay callback - RequestId:", requestId);
      
      // Buscar transação pelo transaction_id
      const { data: transaction } = await supabaseClient
        .from("payment_transactions")
        .select("id, company_id, payment_method")
        .eq("transaction_id", requestId)
        .single();
      
      if (transaction) {
        transaction_id = transaction.id;
        company_id = transaction.company_id;
      }
    }

    // Salvar log do webhook
    await supabaseClient
      .from("payment_webhooks_log")
      .insert({
        company_id,
        gateway_type,
        payload: payload,
        status: transaction_id ? "received" : "failed",
        error_message: transaction_id ? null : "Transaction not found",
      });

    if (!transaction_id) {
      console.error("Transaction not found for webhook");
      return new Response(
        JSON.stringify({ error: "Transaction not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Atualizar transação como paga
    const { error: updateError } = await supabaseClient
      .from("payment_transactions")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        metadata: payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", transaction_id);

    if (updateError) {
      console.error("Error updating transaction:", updateError);
      
      // Atualizar log do webhook como falho
      await supabaseClient
        .from("payment_webhooks_log")
        .update({
          status: "failed",
          error_message: updateError.message,
          processed_at: new Date().toISOString(),
        })
        .eq("payload", payload);

      throw updateError;
    }

    // Check if this is a Cagio subscription payment
    const { data: cagioPayment } = await supabaseClient
      .from('cagio_subscription_payments')
      .select('*, cagio_subscription_plans(*)')
      .eq('transaction_id', transaction_id)
      .single();

    if (cagioPayment) {
      console.log('Processing Cagio subscription payment');
      
      // Update cagio_subscription_payments
      await supabaseClient
        .from('cagio_subscription_payments')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
        })
        .eq('id', cagioPayment.id);

      // Calculate subscription dates
      const now = new Date();
      const endDate = new Date(now);
      if (cagioPayment.billing_period === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Update company subscription
      await supabaseClient
        .from('companies')
        .update({
          subscription_plan: cagioPayment.cagio_subscription_plans.slug,
          subscription_status: 'active',
          subscription_start_date: now.toISOString(),
          subscription_end_date: endDate.toISOString(),
        })
        .eq('id', cagioPayment.company_id);

      console.log('Company subscription activated');
    }

    // Atualizar log do webhook como processado
    await supabaseClient
      .from("payment_webhooks_log")
      .update({
        status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("payload", payload);

    console.log("Webhook processed successfully for transaction:", transaction_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ifthenpay-webhook:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
