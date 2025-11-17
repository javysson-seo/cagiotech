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

    const { name, email, birth_date, phone, company_id } = await req.json();
    
    console.log('Public athlete registration:', { email, company_id });

    // Validate required fields
    if (!name || !email || !birth_date || !company_id) {
      throw new Error('Nome, email, data de nascimento e empresa são obrigatórios');
    }

    // Check if company exists
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('id, name')
      .eq('id', company_id)
      .single();

    if (companyError || !company) {
      throw new Error('Empresa não encontrada');
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
        throw new Error('Este email já está registrado nesta empresa');
      }
    }

    // Format birth date as password (DDMMYYYY)
    const birthDate = new Date(birth_date);
    const day = String(birthDate.getDate()).padStart(2, '0');
    const month = String(birthDate.getMonth() + 1).padStart(2, '0');
    const year = birthDate.getFullYear();
    const password = `${day}${month}${year}`;

    let userId = userExists?.id;

    // Create auth user if doesn't exist
    if (!userExists) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: name,
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
        name,
        email,
        birth_date,
        phone,
        company_id,
        user_id: userId,
        status: 'active',
        is_approved: false, // Needs approval from company
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
        description: 'Novo atleta registrado via link público',
      });

    // Create notification for company admins
    const { error: notificationError } = await supabaseAdmin
      .from('company_notifications')
      .insert({
        company_id: company_id,
        created_by: userId,
        type: 'new_registration',
        title: 'Novo Atleta Registrado',
        message: `${name} se registrou e aguarda aprovação`,
        data: {
          athlete_id: athlete.id,
          athlete_name: name,
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
        athlete_id: athlete.id,
        credentials: {
          email: email,
          password_hint: 'Sua senha é sua data de nascimento no formato DDMMAAAA'
        },
        requires_approval: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in public-athlete-register:', error);
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
