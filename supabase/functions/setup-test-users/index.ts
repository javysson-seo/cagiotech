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
    console.log('🚀 Starting test users setup...');
    
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
        id: '00000000-0000-0000-0000-000000000001',
        email: 'cagiotech@admin.com',
        password: 'Cagiotech123/',
        name: 'Cagio Admin',
        role: 'cagio_admin',
        appRole: 'cagio_admin' as const
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'cagiotech@company.com',
        password: 'Cagiotech123/',
        name: 'Cagio Company Owner',
        role: 'box_owner',
        appRole: 'box_owner' as const
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'cagiotech@student.com',
        password: 'Cagiotech123/',
        name: 'Cagio Student Test',
        role: 'student',
        appRole: 'student' as const
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        email: 'cagiotech@personal.com',
        password: 'Cagiotech123/',
        name: 'Cagio Personal Trainer',
        role: 'trainer',
        appRole: 'personal_trainer' as const
      }
    ];

    const companyId = '00000000-0000-0000-0000-000000000001';
    const createdUsers = [];

    // STEP 1: Clean up existing test data in correct order
    console.log('🧹 Cleaning up existing test data...');
    
    // Delete in correct order to avoid foreign key violations
    
    // 1. Delete athlete_levels (references athletes)
    const { error: levelsDeleteError } = await supabaseAdmin
      .from('athlete_levels')
      .delete()
      .eq('athlete_id', '00000000-0000-0000-0000-000000000003');
    if (levelsDeleteError) console.log('Note: No athlete_levels to delete');
    
    // 2. Delete class_bookings (references athletes and classes)
    const { error: bookingsDeleteError } = await supabaseAdmin
      .from('class_bookings')
      .delete()
      .eq('company_id', companyId);
    if (bookingsDeleteError) console.log('Note: No bookings to delete');
    
    // 3. Delete athlete_subscriptions (references athletes)
    const { error: subsDeleteError } = await supabaseAdmin
      .from('athlete_subscriptions')
      .delete()
      .eq('company_id', companyId);
    if (subsDeleteError) console.log('Note: No subscriptions to delete');
    
    // 4. Delete athletes
    const { error: athletesDeleteError } = await supabaseAdmin
      .from('athletes')
      .delete()
      .eq('id', '00000000-0000-0000-0000-000000000003');
    if (athletesDeleteError) console.log('Note: No athletes to delete');
    
    // 5. Delete trainers
    const { error: trainersDeleteError } = await supabaseAdmin
      .from('trainers')
      .delete()
      .eq('id', '00000000-0000-0000-0000-000000000004');
    if (trainersDeleteError) console.log('Note: No trainers to delete');
    
    // 6. Delete staff members
    const { error: staffDeleteError } = await supabaseAdmin
      .from('staff')
      .delete()
      .eq('company_id', companyId);
    if (staffDeleteError) console.log('Note: No staff to delete');
    
    // 7. Delete user_roles
    for (const user of testUsers) {
      await supabaseAdmin.from('user_roles').delete().eq('user_id', user.id);
    }
    
    // 8. Delete ALL companies owned by test users (must be last)
    for (const user of testUsers) {
      if (user.role === 'box_owner') {
        const { error: companiesDeleteError } = await supabaseAdmin
          .from('companies')
          .delete()
          .eq('owner_id', user.id);
        if (companiesDeleteError) {
          console.log(`Error deleting companies for ${user.email}:`, companiesDeleteError);
        }
      }
    }
    
    // Also delete the specific test company by ID
    await supabaseAdmin.from('companies').delete().eq('id', companyId);
    
    console.log('✅ Cleanup completed');

    // STEP 2: Delete and recreate auth users
    console.log('📝 Creating auth users...');
    for (const user of testUsers) {
      try {
        // Try to delete existing user
        try {
          await supabaseAdmin.auth.admin.deleteUser(user.id);
          console.log(`🗑️  Deleted existing user: ${user.email}`);
        } catch (e) {
          console.log(`ℹ️  No existing user to delete: ${user.email}`);
        }

        // Create new user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          id: user.id,
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            name: user.name,
            role: user.role
          }
        });

        if (authError) {
          console.error(`❌ Error creating user ${user.email}:`, authError);
          throw authError;
        }

        console.log(`✅ Created auth user: ${user.email}`);
        createdUsers.push({ email: user.email, id: authData.user.id });

        // Create profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: authData.user.id,
            name: user.name,
            email: user.email,
            is_approved: true
          });

        if (profileError) {
          console.error(`❌ Error creating profile for ${user.email}:`, profileError);
        } else {
          console.log(`✅ Created profile for: ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Failed to create user ${user.email}:`, error);
        throw error;
      }
    }

    // STEP 3: Create company
    console.log('🏢 Creating test company...');
    const { error: companyError } = await supabaseAdmin
      .from('companies')
      .insert({
        id: companyId,
        name: 'Cagio Tech Test Company',
        slug: 'cagio-tech-test',
        owner_id: '00000000-0000-0000-0000-000000000002',
        email: 'cagiotech@company.com',
        phone: '+351912345678',
        is_approved: true,
        approved_at: new Date().toISOString(),
        onboarding_completed: true,
        subscription_status: 'active'
      });

    if (companyError) {
      console.error('❌ Error creating company:', companyError);
      throw companyError;
    }
    console.log('✅ Company created');

    // STEP 4: Create user roles
    console.log('👤 Creating user roles...');
    for (const user of testUsers) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: user.appRole,
          company_id: user.appRole === 'cagio_admin' ? null : companyId
        });

      if (roleError) {
        console.error(`❌ Error creating role for ${user.email}:`, roleError);
      } else {
        console.log(`✅ Role created for: ${user.email}`);
      }
    }

    // STEP 5: Create athlete for student
    console.log('🏃 Creating athlete record...');
    const { error: athleteError } = await supabaseAdmin
      .from('athletes')
      .insert({
        id: '00000000-0000-0000-0000-000000000003',
        company_id: companyId,
        user_id: '00000000-0000-0000-0000-000000000003',
        name: 'Cagio Student Test',
        email: 'cagiotech@student.com',
        phone: '+351912345679',
        status: 'active',
        is_approved: true,
        approved_at: new Date().toISOString(),
        approved_by: '00000000-0000-0000-0000-000000000002'
      });

    if (athleteError) {
      console.error('❌ Error creating athlete:', athleteError);
    } else {
      console.log('✅ Athlete created');
    }

    // STEP 6: Create trainer for personal
    console.log('💪 Creating trainer record...');
    const { error: trainerError } = await supabaseAdmin
      .from('trainers')
      .insert({
        id: '00000000-0000-0000-0000-000000000004',
        company_id: companyId,
        user_id: '00000000-0000-0000-0000-000000000004',
        name: 'Cagio Personal Trainer',
        email: 'cagiotech@personal.com',
        phone: '+351912345680',
        specialization: 'CrossFit, Nutrição',
        status: 'active'
      });

    if (trainerError) {
      console.error('❌ Error creating trainer:', trainerError);
    } else {
      console.log('✅ Trainer created');
    }

    // STEP 7: Create athlete levels
    console.log('📊 Creating athlete levels...');
    const { error: levelsError } = await supabaseAdmin
      .from('athlete_levels')
      .insert({
        athlete_id: '00000000-0000-0000-0000-000000000003',
        company_id: companyId,
        current_level: 'Bronze',
        total_points: 100,
        current_streak: 5,
        best_streak: 10,
        total_classes: 15,
        total_referrals: 2
      });

    if (levelsError) {
      console.error('❌ Error creating athlete levels:', levelsError);
    } else {
      console.log('✅ Athlete levels created');
    }

    console.log('🎉 Setup completed successfully!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test users created successfully',
        companyId,
        users: createdUsers
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Fatal error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
