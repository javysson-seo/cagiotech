import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PasswordResetRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers.users?.some(u => u.email === email);

    if (!userExists) {
      console.log(`User not found: ${email}`);
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Se o email existir, você receberá um código de recuperação" 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Delete any existing codes for this email (used or not)
    const { error: deleteError } = await supabaseAdmin
      .from('password_reset_codes')
      .delete()
      .eq('email', email);
    
    if (deleteError) {
      console.error("Error deleting old codes:", deleteError);
    }
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code in database with 15 minutes expiration
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const { error: insertError } = await supabaseAdmin
      .from('password_reset_codes')
      .insert({
        email,
        code,
        expires_at: expiresAt,
        used: false
      });

    if (insertError) {
      console.error("Error storing password reset code:", insertError);
      throw new Error("Erro ao armazenar código de recuperação");
    }

    console.log(`Generated password reset code for ${email}: ${code}`);

    const emailResponse = await resend.emails.send({
      from: "CagioTech <onboarding@resend.dev>",
      to: [email],
      subject: "Recuperação de Senha - CagioTech",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Recuperação de Senha</h1>
          <p style="color: #666; font-size: 16px;">Olá,</p>
          <p style="color: #666; font-size: 16px;">
            Você solicitou a recuperação de senha para sua conta no CagioTech.
          </p>
          <p style="color: #666; font-size: 16px;">
            Para redefinir sua senha, utilize o seguinte código:
          </p>
          <div style="background-color: #f4f4f4; border: 2px solid #aeca12; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <h2 style="color: #333; font-size: 36px; letter-spacing: 5px; margin: 0;">${code}</h2>
          </div>
          <p style="color: #666; font-size: 14px;">
            Este código expira em 15 minutos.
          </p>
          <p style="color: #666; font-size: 14px;">
            Se você não solicitou esta recuperação, pode ignorar este email com segurança.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            CagioTech - Sistema de Gestão de Fitness e Bem-Estar
          </p>
        </div>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

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
    console.error("Error sending password reset code:", error);
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
