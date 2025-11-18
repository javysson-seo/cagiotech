import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { staffCreationSchema } from "../_shared/validation.ts";
import { generateSecurePassword, sanitizeInput } from "../_shared/utils.ts";
import { generatePasswordEmail } from "../_shared/email-templates.ts";

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

    const requestData = await req.json();
    
    // Validate input with Zod
    const validationResult = staffCreationSchema.safeParse(requestData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { staffData } = validationResult.data;
    
    console.log('Creating staff with auth:', { email: staffData.email });

    // Sanitize inputs
    const sanitizedName = sanitizeInput(staffData.name);

    // Generate secure random password
    const tempPassword = generateSecurePassword(16);

    console.log('Generated secure password');

    // Determine role based on position
    let appRole: 'staff_member' | 'personal_trainer' = 'staff_member';
    if (staffData.position === 'personal_trainer' || staffData.position === 'trainer') {
      appRole = 'personal_trainer';
    }

    // Get company info for email
    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('name')
      .eq('id', staffData.company_id)
      .single();

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: staffData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: sanitizedName,
        role: appRole,
        first_login: true,
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
          // Reset password to new secure password
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
              password: tempPassword,
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

    // Send welcome email with temporary password
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey && company) {
      try {
        const emailContent = generatePasswordEmail({
          recipientName: sanitizedName,
          recipientEmail: staffData.email,
          tempPassword: tempPassword,
          companyName: company.name,
          loginUrl: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/auth/login`
        });

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Cagio <noreply@cagio.pt>',
            to: [staffData.email],
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          }),
        });
        console.log('Welcome email sent');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Staff criado com sucesso! Um email foi enviado com as credenciais.',
        user_id: authData.user.id,
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
