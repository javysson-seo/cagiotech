import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const ALLOWED_ORIGINS = [
  "https://vwonynqoybfvaleyfmog.supabase.co",
  "http://localhost:5173",
  "http://localhost:3000",
];

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Credentials": "true",
});

// Validation schema
const createStaffSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().trim().min(2).max(100),
  position: z.string().min(1).max(100),
  company_id: z.string().uuid(),
});

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for user creation
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: requestBody } = await req.json();
    
    // Validate input with Zod
    const validation = createStaffSchema.safeParse(requestBody);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          issues: validation.error.issues 
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, password, name, position, company_id } = validation.data;

    console.log("Creating user for staff:", email);

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
        role: position === 'personal_trainer' ? 'personal_trainer' : 'staff_member'
      }
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      throw authError;
    }

    console.log("Auth user created:", authData.user.id);

    // Determine role based on position
    let appRole = 'staff_member';
    if (position === 'personal_trainer') {
      appRole = 'personal_trainer';
    }

    // Create user role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: appRole,
        company_id: company_id
      });

    if (roleError) {
      console.error("Error creating user role:", roleError);
      // If role creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw roleError;
    }

    console.log("User role created successfully");

    return new Response(
      JSON.stringify({
        success: true,
        user_id: authData.user.id,
        message: "User created successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in create-staff-user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
