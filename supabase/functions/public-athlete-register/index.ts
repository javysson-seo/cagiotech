import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { publicAthleteRegistrationSchema } from "../_shared/validation.ts";
import { generateSecurePassword, sanitizeInput, checkRateLimit } from "../_shared/utils.ts";
import { generatePasswordEmail } from "../_shared/email-templates.ts";
import { createErrorResponse } from "../_shared/error-sanitizer.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting per IP
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`public-register:${clientIp}`, 5, 3600000); // 5 per hour
    
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Muitas tentativas. Tente novamente mais tarde.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString()
          } 
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestData = await req.json();
    
    // Validate input with Zod
    const validationResult = publicAthleteRegistrationSchema.safeParse(requestData);
    
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

    const { name, email, birth_date, phone, company_id } = validationResult.data;
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    
    console.log('Public athlete registration:', { email, company_id });

    // Check if company exists and is active
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('id, name, subscription_status, trial_end_date, subscription_end_date')
      .eq('id', company_id)
      .single();

    if (companyError || !company) {
      throw new Error('Empresa não encontrada');
    }

    // Validate company subscription status
    const now = new Date();
    const isTrialActive = company.subscription_status === 'trial' && 
      company.trial_end_date && new Date(company.trial_end_date) > now;
    const isSubscriptionActive = company.subscription_status === 'active' &&
      (!company.subscription_end_date || new Date(company.subscription_end_date) > now);
    
    if (!isTrialActive && !isSubscriptionActive) {
      return new Response(
        JSON.stringify({ 
          error: 'Esta empresa não está aceitando novos registros no momento. Entre em contato com a administração.' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser.users.find(u => u.email === email);

    if (userExists) {
      // Check if athlete already exists in this company
      const { data: existingAthlete } = await supabaseAdmin
        .from('athletes')
        .select('id')
        .eq('email', email)
        .eq('company_id', company_id)
        .maybeSingle();

      if (existingAthlete) {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Este email já está registrado nesta empresa'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate secure random password
    const tempPassword = generateSecurePassword(16);

    let userId = userExists?.id;

    // Create auth user if doesn't exist
    if (!userExists) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
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
        throw authError;
      }

      userId = authData.user.id;
      console.log('Auth user created:', userId);
    }

    // Create athlete record
    const { data: athlete, error: athleteError } = await supabaseAdmin
      .from('athletes')
      .insert({
        name: sanitizedName,
        email,
        birth_date,
        phone: phone || null,
        company_id,
        user_id: userId,
        status: 'pending',
        is_approved: false,
      })
      .select()
      .single();

    if (athleteError) {
      console.error('Error creating athlete:', athleteError);
      throw athleteError;
    }

    console.log('Athlete created:', athlete.id);

    // Create user_roles entry
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'student',
        company_id: company_id,
      })
      .select()
      .maybeSingle();

    if (roleError && !roleError.message?.includes('duplicate key')) {
      console.error('Error creating role:', roleError);
      // Don't throw - continue if role creation fails
    }

    // Create activity log
    await supabaseAdmin
      .from('athlete_activities')
      .insert({
        athlete_id: athlete.id,
        company_id: company_id,
        type: 'registration',
        description: 'Atleta registrado via formulário público',
      });

    // Send welcome email with temporary password
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        const emailContent = generatePasswordEmail({
          recipientName: sanitizedName,
          recipientEmail: email,
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
            to: [email],
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
        // Don't fail the registration if email fails
      }
    }

    // Create notification for company admins
    const { error: notificationError } = await supabaseAdmin
      .from('company_notifications')
      .insert({
        company_id: company_id,
        created_by: userId,
        type: 'new_registration',
        title: 'Novo Atleta Registrado',
        message: `${sanitizedName} se registrou e aguarda aprovação`,
        data: {
          athlete_id: athlete.id,
          athlete_name: sanitizedName,
          athlete_email: email,
        },
        is_active: true,
        is_urgent: true,
      });

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't throw - notification is not critical
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Registro realizado com sucesso! Aguarde a aprovação da academia.',
        credentials: {
          email: email,
          password_hint: 'Você receberá um email com suas credenciais de acesso após a aprovação.'
        },
        athlete_id: athlete.id,
        requires_approval: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    return createErrorResponse(error, corsHeaders, "Error in public-athlete-register");
  }
});
