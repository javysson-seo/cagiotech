import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    console.log("Received IfthenPay webhook");

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
