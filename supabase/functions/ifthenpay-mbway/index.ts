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

    const { company_id, payment_id, amount, phone_number } = await req.json();

    if (!company_id || !amount || !phone_number) {
      throw new Error("company_id, amount, and phone_number are required");
    }

    console.log("Processing MBWay payment for company:", company_id);

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

    const mbwayKey = settings.settings.mbway_key;

    if (!mbwayKey) {
      throw new Error("MBWay key not configured");
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

    // Processar pagamento MBWay via API IfthenPay
    const apiUrl = "https://mbway.ifthenpay.com/IfthenPayMBW.asmx/SetPedidoJSON";

    const requestBody = {
      MbWayKey: mbwayKey,
      telefone: phone_number.replace(/\s/g, ""), // Remove espaços
      email: "", // Opcional
      orderId: payment_id || crypto.randomUUID(),
      valor: amount.toString(),
    };

    console.log("Calling MBWay API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("IfthenPay MBWay API error:", errorText);
      throw new Error(`IfthenPay MBWay API error: ${errorText}`);
    }

    const result = await response.json();
    console.log("MBWay response:", result);

    // Verificar status da resposta
    const status = result.Estado === "000" ? "pending" : "failed";

    // Salvar transação no banco
    const { data: transaction, error: transactionError } = await supabaseClient
      .from("payment_transactions")
      .insert({
        company_id,
        athlete_id,
        payment_id,
        gateway_type: "ifthenpay",
        payment_method: "mbway",
        amount,
        currency: "EUR",
        phone_number,
        transaction_id: result.IdPedido,
        status,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos
        metadata: result,
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Error saving transaction:", transactionError);
      throw transactionError;
    }

    console.log("MBWay transaction created:", transaction.id);

    return new Response(
      JSON.stringify({
        success: status === "pending",
        transaction_id: transaction.id,
        request_id: result.IdPedido,
        status: status,
        message: result.Message || "Pagamento enviado. Aprove no seu MBWay.",
        expires_at: transaction.expires_at,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ifthenpay-mbway:", error);
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
