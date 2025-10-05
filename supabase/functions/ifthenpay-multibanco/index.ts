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
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { company_id, payment_id, amount } = await req.json();

    if (!company_id || !amount) {
      throw new Error("company_id and amount are required");
    }

    console.log("Generating Multibanco reference for company:", company_id);

    // Buscar configurações do gateway da empresa
    const { data: settings, error: settingsError } = await supabaseClient
      .from("payment_gateway_settings")
      .select("*")
      .eq("company_id", company_id)
      .eq("gateway_type", "ifthenpay")
      .eq("is_enabled", true)
      .single();

    if (settingsError || !settings) {
      throw new Error("Payment gateway not configured for this company");
    }

    const mbKey = settings.settings.mb_key;
    const backofficeKey = settings.settings.backoffice_key;

    if (!mbKey) {
      throw new Error("Multibanco key not configured");
    }

    // Buscar dados do pagamento se fornecido
    let athlete_id = null;
    if (payment_id) {
      const { data: payment } = await supabaseClient
        .from("athlete_payments")
        .select("athlete_id")
        .eq("id", payment_id)
        .single();
      
      if (payment) {
        athlete_id = payment.athlete_id;
      }
    }

    // Gerar referência Multibanco via API IfthenPay
    const apiUrl = settings.is_sandbox
      ? "https://ifthenpay.com/api/multibanco/reference/init"
      : "https://ifthenpay.com/api/multibanco/reference/init";

    const requestBody = {
      mbKey: mbKey,
      orderId: payment_id || crypto.randomUUID(),
      amount: amount.toString(),
    };

    console.log("Calling IfthenPay API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("IfthenPay API error:", errorText);
      throw new Error(`IfthenPay API error: ${errorText}`);
    }

    const result = await response.json();
    console.log("IfthenPay response:", result);

    // Salvar transação no banco
    const { data: transaction, error: transactionError } = await supabaseClient
      .from("payment_transactions")
      .insert({
        company_id,
        athlete_id,
        payment_id,
        gateway_type: "ifthenpay",
        payment_method: "multibanco",
        amount,
        currency: "EUR",
        reference: result.Reference,
        entity: result.Entity,
        transaction_id: result.RequestId,
        status: "pending",
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
        metadata: result,
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Error saving transaction:", transactionError);
      throw transactionError;
    }

    console.log("Transaction created:", transaction.id);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        entity: result.Entity,
        reference: result.Reference,
        amount: amount,
        expires_at: transaction.expires_at,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ifthenpay-multibanco:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
