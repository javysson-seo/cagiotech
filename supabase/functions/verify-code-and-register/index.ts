import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  email: string;
  code: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, password }: VerifyRequest = await req.json();

    if (!email || !code || !password) {
      return new Response(
        JSON.stringify({ error: "Email, código e senha são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify code from database
    const { data: stored, error: fetchError } = await supabaseAdmin
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .single();
    
    if (fetchError || !stored) {
      console.error("Code not found:", fetchError);
      return new Response(
        JSON.stringify({ error: "Código não encontrado ou inválido" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if code is expired
    if (new Date(stored.expires_at) < new Date()) {
      console.error("Code expired");
      return new Response(
        JSON.stringify({ error: "Código expirado" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Creating user for email: ${email}`);

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers.users?.some(u => u.email === email);

    if (userExists) {
      console.error("User already exists:", email);
      // Mark code as used to prevent reuse
      await supabaseAdmin
        .from('email_verification_codes')
        .update({ used: true })
        .eq('email', email)
        .eq('code', code);
      
      return new Response(
        JSON.stringify({ 
          error: "Este email já está registrado. Por favor, faça login ou use outro email." 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'box_owner'
      }
    });

    if (userError || !userData.user) {
      console.error("Error creating user:", userError);
      
      // Mark code as used even on error
      await supabaseAdmin
        .from('email_verification_codes')
        .update({ used: true })
        .eq('email', email)
        .eq('code', code);
      
      return new Response(
        JSON.stringify({ 
          error: userError?.code === 'email_exists' 
            ? "Este email já está registrado. Por favor, faça login." 
            : userError?.message || "Erro ao criar usuário" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`User created: ${userData.user.id}`);

    // Create company
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert({
        name: stored.company_name,
        owner_id: userData.user.id,
        subscription_status: 'trialing',
        trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (companyError || !companyData) {
      console.error("Error creating company:", companyError);
      // Rollback: delete user
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      return new Response(
        JSON.stringify({ error: companyError?.message || "Erro ao criar empresa" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Company created: ${companyData.id}`);

    // Update user role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'box_owner'
      });

    if (roleError) {
      console.error("Error creating user role:", roleError);
    }

    // Mark code as used
    await supabaseAdmin
      .from('email_verification_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('code', code);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Conta criada com sucesso",
        companyId: companyData.id,
        userId: userData.user.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error verifying code:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao verificar código" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
