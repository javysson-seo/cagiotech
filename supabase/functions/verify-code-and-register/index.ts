import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { verifyCodeSchema } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Validate input with Zod
    const validationResult = verifyCodeSchema.safeParse(requestData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, code, password } = validationResult.data;

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
    const existingUser = existingUsers.users?.find(u => u.email === email);

    if (existingUser) {
      console.log("User already exists:", email);
      
      // Check if user has a company
      const { data: existingCompany } = await supabaseAdmin
        .from('companies')
        .select('id')
        .eq('owner_id', existingUser.id)
        .maybeSingle();

      // Check if user has role
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', existingUser.id)
        .maybeSingle();
      
      // If email is not confirmed, confirm it now
      if (!existingUser.email_confirmed_at) {
        console.log("Confirming email for existing user");
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          { email_confirm: true }
        );
        
        if (updateError) {
          console.error("Error confirming email:", updateError);
          return new Response(
            JSON.stringify({ error: "Erro ao confirmar email" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        let companyId = existingCompany?.id;

        // If no company exists, create one with trial
        if (!existingCompany) {
          console.log("Creating company for existing user");
          
          // Get Business plan
          const { data: businessPlan } = await supabaseAdmin
            .from('cagio_subscription_plans')
            .select('id')
            .eq('slug', 'business')
            .eq('is_active', true)
            .single();

          if (!businessPlan) {
            console.error("Business plan not found");
            return new Response(
              JSON.stringify({ error: "Erro ao configurar plano de assinatura" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

          const { data: companyData, error: companyError } = await supabaseAdmin
            .from('companies')
            .insert({
              name: stored.company_name,
              owner_id: existingUser.id,
              subscription_status: 'trialing',
              subscription_plan: 'business',
              trial_plan_id: businessPlan.id,
              trial_start_date: new Date().toISOString(),
              trial_end_date: trialEndDate.toISOString(),
              onboarding_completed: false,
              onboarding_step: 0
            })
            .select()
            .single();

          if (companyError || !companyData) {
            console.error("Error creating company:", companyError);
            return new Response(
              JSON.stringify({ error: "Erro ao criar empresa" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          companyId = companyData.id;
          console.log("Company created for existing user:", companyId);
        }

        // If no role exists, create one
        if (!existingRole) {
          console.log("Creating role for existing user with company_id:", companyId);
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({
              user_id: existingUser.id,
              role: 'box_owner',
              company_id: companyId
            });

          if (roleError) {
            console.error("Error creating user role:", roleError);
            return new Response(
              JSON.stringify({ error: "Erro ao criar permissões do usuário" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          console.log("User role created successfully");
        }
        
        // Mark code as used
        await supabaseAdmin
          .from('email_verification_codes')
          .update({ used: true })
          .eq('email', email)
          .eq('code', code);
        
        console.log("Email confirmed successfully");
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Email confirmado com sucesso! Você já pode fazer login.",
            userExists: true
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      // Email already confirmed
      await supabaseAdmin
        .from('email_verification_codes')
        .update({ used: true })
        .eq('email', email)
        .eq('code', code);
      
      return new Response(
        JSON.stringify({ 
          error: "Este email já está registrado e confirmado. Por favor, faça login." 
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

    // Get Business plan (highest plan for trial)
    const { data: businessPlan } = await supabaseAdmin
      .from('cagio_subscription_plans')
      .select('id')
      .eq('slug', 'business')
      .eq('is_active', true)
      .single();

    if (!businessPlan) {
      console.error("Business plan not found");
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      return new Response(
        JSON.stringify({ error: "Erro ao configurar plano de assinatura" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // Create company with trial period
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert({
        name: stored.company_name,
        owner_id: userData.user.id,
        subscription_status: 'trialing',
        subscription_plan: 'business',
        trial_plan_id: businessPlan.id,
        trial_start_date: new Date().toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        onboarding_completed: false,
        onboarding_step: 0
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

    // Update user role with company_id
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'box_owner',
        company_id: companyData.id
      });

    if (roleError) {
      console.error("Error creating user role:", roleError);
      return new Response(
        JSON.stringify({ error: "Erro ao criar permissões do usuário" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
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
