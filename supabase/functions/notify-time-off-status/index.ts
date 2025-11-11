import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { Resend } from "npm:resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { TimeOffApprovedEmail } from "./_templates/time-off-approved.tsx";
import { TimeOffRejectedEmail } from "./_templates/time-off-rejected.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TimeOffNotificationRequest {
  requestId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId, status, rejectionReason }: TimeOffNotificationRequest = await req.json();

    console.log("Processing time off notification:", { requestId, status });

    // Fetch time off request details
    const { data: timeOffRequest, error: requestError } = await supabase
      .from("staff_time_off")
      .select("*, staff!inner(name, email, user_id), companies!inner(name)")
      .eq("id", requestId)
      .single();

    if (requestError || !timeOffRequest) {
      console.error("Error fetching time off request:", requestError);
      return new Response(
        JSON.stringify({ error: "Time off request not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get staff email
    const staffEmail = timeOffRequest.staff.email;
    const staffName = timeOffRequest.staff.name;
    const companyName = timeOffRequest.companies.name;

    if (!staffEmail) {
      console.error("Staff member has no email");
      return new Response(
        JSON.stringify({ error: "Staff member has no email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare email data
    const emailData = {
      staffName,
      companyName,
      requestType: timeOffRequest.request_type,
      startDate: timeOffRequest.start_date,
      endDate: timeOffRequest.end_date,
      daysCount: timeOffRequest.days_count,
      reason: timeOffRequest.reason,
      rejectionReason,
    };

    // Render appropriate email template
    let html: string;
    let subject: string;

    if (status === 'approved') {
      html = await renderAsync(
        React.createElement(TimeOffApprovedEmail, emailData)
      );
      subject = `✅ Pedido de ${getTypeLabel(timeOffRequest.request_type)} Aprovado`;
    } else {
      html = await renderAsync(
        React.createElement(TimeOffRejectedEmail, emailData)
      );
      subject = `❌ Pedido de ${getTypeLabel(timeOffRequest.request_type)} Rejeitado`;
    }

    // Send email
    const { error: emailError } = await resend.emails.send({
      from: `${companyName} <onboarding@resend.dev>`,
      to: [staffEmail],
      subject,
      html,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully to:", staffEmail);

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in notify-time-off-status function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    vacation: 'Férias',
    sick_leave: 'Licença Médica',
    personal: 'Licença Pessoal',
    other: 'Outro'
  };
  return labels[type] || type;
}

serve(handler);
