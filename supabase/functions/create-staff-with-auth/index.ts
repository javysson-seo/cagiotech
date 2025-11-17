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

    const { staffData } = await req.json();
    
    console.log('Creating staff with auth:', { email: staffData.email, birth_date: staffData.birth_date });

    // Validate required fields
    if (!staffData.email || !staffData.birth_date) {
      throw new Error('Email e data de nascimento são obrigatórios');
    }

    // Format birth date as password (DDMMYYYY)
    const birthDate = new Date(staffData.birth_date);
    const day = String(birthDate.getDate()).padStart(2, '0');
    const month = String(birthDate.getMonth() + 1).padStart(2, '0');
    const year = birthDate.getFullYear();
    const password = `${day}${month}${year}`;

    console.log('Generated password format:', password.substring(0, 4) + '****');

    // Determine role based on position
    let appRole: 'staff_member' | 'personal_trainer' = 'staff_member';
    if (staffData.position === 'personal_trainer' || staffData.position === 'trainer') {
      appRole = 'personal_trainer';
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: staffData.email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: staffData.name,
        role: appRole,
        first_login: true, // Flag to force password change
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      
      // If user already exists, continue with staff creation
      if (authError.message?.includes('already been registered')) {
        console.log('User already exists, resetting password and continuing with staff creation');
        
        // Get existing user
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const user = existingUser.users.find(u => u.email === staffData.email);
        
        if (user) {
          // Reset password to birth date
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
              password: password,
              user_metadata: {
                ...user.user_metadata,
                role: appRole,
                first_login: true,
              },
            }
          );

          if (updateError) {
            console.error('Error resetting password:', updateError);
          } else {
            console.log('Password reset successfully to birth date format');
          }

          // Create user_roles if not exists
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({
              user_id: user.id,
              role: appRole,
              company_id: staffData.company_id,
            })
            .select()
            .single();

          if (roleError && !roleError.message?.includes('duplicate key')) {
            console.error('Error creating role:', roleError);
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Staff criado e senha resetada para data de nascimento',
              user_id: user.id,
              credentials: {
                email: staffData.email,
                password_hint: 'Data de nascimento (DDMMAAAA)'
              }
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
        role: appRole,
        company_id: staffData.company_id,
      });

    if (roleError) {
      console.error('Error creating role:', roleError);
      throw roleError;
    }

    console.log('User role created');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Login criado com sucesso',
        user_id: authData.user.id,
        credentials: {
          email: staffData.email,
          password_hint: 'Data de nascimento (DDMMAAAA)'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in create-staff-with-auth:', error);
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
