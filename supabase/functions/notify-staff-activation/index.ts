import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { StaffActivationEmail } from './_templates/staff-activation.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StaffActivationRequest {
  staff_id: string;
  company_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { staff_id, company_id }: StaffActivationRequest = await req.json();

    console.log("Processing staff activation notification:", { staff_id, company_id });

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get staff information
    const { data: staffData, error: staffError } = await supabaseAdmin
      .from('staff')
      .select(`
        id,
        name,
        email,
        position,
        password_changed_at,
        company_id
      `)
      .eq('id', staff_id)
      .single();

    if (staffError || !staffData) {
      console.error("Error fetching staff data:", staffError);
      throw new Error("Staff not found");
    }

    // Get company information and owner email
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .select(`
        id,
        name,
        owner_id,
        email
      `)
      .eq('id', company_id)
      .single();

    if (companyError || !companyData) {
      console.error("Error fetching company data:", companyError);
      throw new Error("Company not found");
    }

    // Get owner's profile to get their email
    const { data: ownerProfile, error: ownerError } = await supabaseAdmin
      .from('profiles')
      .select('email, name')
      .eq('id', companyData.owner_id)
      .single();

    if (ownerError || !ownerProfile) {
      console.error("Error fetching owner profile:", ownerError);
      throw new Error("Owner profile not found");
    }

    // Format activation date
    const activationDate = new Date(staffData.password_changed_at || new Date()).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Get position label in Portuguese
    const positionLabels: Record<string, string> = {
      'personal_trainer': 'Personal Trainer',
      'recepcao': 'Recepção',
      'limpeza': 'Limpeza',
      'manutencao': 'Manutenção',
      'administracao': 'Administração',
      'gerencia': 'Gerência',
      'outro': 'Outro',
    };

    const positionLabel = positionLabels[staffData.position] || staffData.position;

    // Render the email template
    const html = await renderAsync(
      React.createElement(StaffActivationEmail, {
        staffName: staffData.name,
        staffEmail: staffData.email,
        staffPosition: positionLabel,
        companyName: companyData.name,
        activationDate: activationDate,
      })
    );

    // Send email to company owner
    const emailResponse = await resend.emails.send({
      from: 'Cagio System <onboarding@resend.dev>',
      to: [ownerProfile.email],
      subject: `✅ Funcionário ${staffData.name} ativou a conta`,
      html,
      // Optional: Add company email as CC if it exists
      ...(companyData.email && { cc: [companyData.email] }),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent successfully",
        email_id: emailResponse.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in notify-staff-activation function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
