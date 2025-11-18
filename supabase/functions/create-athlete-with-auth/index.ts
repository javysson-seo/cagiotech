import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { athleteCreationSchema } from "../_shared/validation.ts";
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
    const validationResult = athleteCreationSchema.safeParse(requestData);
    
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

    const { athleteData, athleteId } = validationResult.data;
    
    console.log('Creating athlete with auth:', { email: athleteData.email, athleteId });

    // Sanitize inputs
    const sanitizedName = sanitizeInput(athleteData.name);

    // Generate secure random password
    const tempPassword = generateSecurePassword(16);

    console.log('Generated secure password');

    // Get company info for email
    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('name')
      .eq('id', athleteData.company_id)
      .single();

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: athleteData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: sanitizedName,
        role: 'student',
        first_login: true,
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
        throw updateError;
      }

      console.log('Athlete updated with user_id');
    }

    // Send welcome email with temporary password
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey && company) {
      try {
        const emailContent = generatePasswordEmail({
          recipientName: sanitizedName,
          recipientEmail: athleteData.email,
          tempPassword: tempPassword,
          companyName: company.name,
          loginUrl: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/auth/login`
        });

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Cagio <noreply@cagio.pt>',
            to: [athleteData.email],
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Error sending email:', await emailResponse.text());
        } else {
          console.log('Welcome email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Atleta criado com sucesso! Um email foi enviado com as credenciais de acesso.',
        user_id: authData.user.id,
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
