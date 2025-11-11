import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  companyName: string;
}

// Store codes temporarily (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expires: number; companyName: string }>();

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, companyName }: VerificationRequest = await req.json();

    if (!email || !companyName) {
      return new Response(
        JSON.stringify({ error: "Email e nome da empresa são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with 10 minutes expiration
    const expires = Date.now() + 10 * 60 * 1000;
    verificationCodes.set(email, { code, expires, companyName });

    console.log(`Generated verification code for ${email}: ${code}`);

    const emailResponse = await resend.emails.send({
      from: "CagioTech <onboarding@resend.dev>",
      to: [email],
      subject: "Código de Verificação - CagioTech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Bem-vindo ao CagioTech!</h1>
          <p style="color: #666; font-size: 16px;">Olá,</p>
          <p style="color: #666; font-size: 16px;">
            Obrigado por se registrar no CagioTech com a empresa <strong>${companyName}</strong>.
          </p>
          <p style="color: #666; font-size: 16px;">
            Para completar o seu registro, utilize o seguinte código de verificação:
          </p>
          <div style="background-color: #f4f4f4; border: 2px solid #aeca12; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <h2 style="color: #333; font-size: 36px; letter-spacing: 5px; margin: 0;">${code}</h2>
          </div>
          <p style="color: #666; font-size: 14px;">
            Este código expira em 10 minutos.
          </p>
          <p style="color: #666; font-size: 14px;">
            Se você não solicitou este código, pode ignorar este email com segurança.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            CagioTech - Sistema de Gestão de Fitness e Bem-Estar
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Código enviado com sucesso" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending verification code:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao enviar código" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

// Export verification codes for use by verify function
export { verificationCodes };
