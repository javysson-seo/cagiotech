import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { athleteData, athleteId } = await req.json();
    
    console.log('Creating athlete with auth:', { email: athleteData.email, birth_date: athleteData.birth_date, athleteId });

    // Validate required fields
    if (!athleteData.email || !athleteData.birth_date) {
      throw new Error('Email e data de nascimento são obrigatórios');
    }

    // Format birth date as password (DDMMYYYY)
    const birthDate = new Date(athleteData.birth_date);
    const day = String(birthDate.getDate()).padStart(2, '0');
    const month = String(birthDate.getMonth() + 1).padStart(2, '0');
    const year = birthDate.getFullYear();
    const password = `${day}${month}${year}`;

    console.log('Generated password format:', password.substring(0, 4) + '****');

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: athleteData.email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: athleteData.name,
        role: 'student',
        first_login: true, // Flag to force password change
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      
      // If user already exists, continue with athlete creation
      if (authError.message?.includes('already been registered')) {
        console.log('User already exists, continuing with athlete creation');
        
        // Get existing user
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const user = existingUser.users.find(u => u.email === athleteData.email);
        
        if (user) {
          // Create user_roles if not exists
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({
              user_id: user.id,
              role: 'student',
              company_id: athleteData.company_id,
            })
            .select()
            .single();

          if (roleError && !roleError.message?.includes('duplicate key')) {
            console.error('Error creating role:', roleError);
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Atleta criado (usuário já existia)',
              user_id: user.id,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      throw authError;
    }

    console.log('Auth user created:', authData.user.id);

    // Create user_roles entry
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'student',
        company_id: athleteData.company_id,
      });

    if (roleError) {
      console.error('Error creating role:', roleError);
      throw roleError;
    }

    console.log('User role created');

    // Update athlete record with user_id
    if (athleteId) {
      const { error: updateError } = await supabaseAdmin
        .from('athletes')
        .update({ user_id: authData.user.id })
        .eq('id', athleteId);

      if (updateError) {
        console.error('Error updating athlete with user_id:', updateError);
        // Don't throw - auth was created successfully
      } else {
        console.log('Athlete updated with user_id');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Login criado com sucesso',
        user_id: authData.user.id,
        credentials: {
          email: athleteData.email,
          password_hint: 'Data de nascimento (DDMMAAAA)'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in create-athlete-with-auth:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
