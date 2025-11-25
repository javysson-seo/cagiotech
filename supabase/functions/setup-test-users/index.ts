import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const testUsers = [
      {
        email: 'cagiotech@admin.com',
        password: 'Cagiotech123/',
        name: 'Cagio Admin',
        role: 'cagio_admin',
        appRole: 'cagio_admin' as const
      },
      {
        email: 'cagiotech@company.com',
        password: 'Cagiotech123/',
        name: 'Cagio Company Owner',
        role: 'box_owner',
        appRole: 'box_owner' as const
      },
      {
        email: 'cagiotech@student.com',
        password: 'Cagiotech123/',
        name: 'Cagio Student Test',
        role: 'student',
        appRole: 'student' as const
      },
      {
        email: 'cagiotech@personal.com',
        password: 'Cagiotech123/',
        name: 'Cagio Personal Trainer',
        role: 'trainer',
        appRole: 'personal_trainer' as const
      }
    ];

    const companyId = '00000000-0000-0000-0000-000000000001';
    let companyOwnerId = '';

    // Create users
    for (const user of testUsers) {
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role
        }
      });

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError);
        continue;
      }

      const userId = authData.user.id;
      if (user.email === 'cagiotech@company.com') {
        companyOwnerId = userId;
      }

      // Update or create profile
      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          name: user.name,
          email: user.email,
          role: user.role
        });
    }

    // Create test company
    await supabaseAdmin
      .from('companies')
      .upsert({
        id: companyId,
        name: 'Cagio Tech Test Company',
        slug: 'cagio-tech-test',
        owner_id: companyOwnerId,
        email: 'cagiotech@company.com',
        phone: '+351912345678',
        is_approved: true,
        approved_at: new Date().toISOString(),
        onboarding_completed: true,
        subscription_status: 'active'
      });

    // Create user roles
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    
    for (const user of testUsers) {
      const authUser = users.users.find(u => u.email === user.email);
      if (!authUser) continue;

      // Create role
      await supabaseAdmin
        .from('user_roles')
        .upsert({
          user_id: authUser.id,
          role: user.appRole,
          company_id: user.appRole === 'cagio_admin' ? null : companyId
        });

      // Create athlete for student
      if (user.email === 'cagiotech@student.com') {
        await supabaseAdmin
          .from('athletes')
          .upsert({
            id: '00000000-0000-0000-0000-000000000003',
            company_id: companyId,
            user_id: authUser.id,
            name: user.name,
            email: user.email,
            phone: '+351912345679',
            status: 'active',
            is_approved: true,
            approved_at: new Date().toISOString(),
            approved_by: companyOwnerId
          });
      }

      // Create trainer for personal
      if (user.email === 'cagiotech@personal.com') {
        await supabaseAdmin
          .from('trainers')
          .upsert({
            id: '00000000-0000-0000-0000-000000000004',
            company_id: companyId,
            user_id: authUser.id,
            name: user.name,
            email: user.email,
            phone: '+351912345680',
            specialization: 'CrossFit, Nutrição',
            status: 'active'
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test users created successfully',
        companyId,
        users: testUsers.map(u => ({ email: u.email, role: u.role }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
