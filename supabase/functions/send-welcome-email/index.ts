import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Create a Supabase client with the project URL and service key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // In a real implementation, you would use an email service like SendGrid, Mailgun, etc.
    // For this example, we'll just log the email details
    console.log(
      `Sending welcome email to ${email} for user ${name || "New User"}`,
    );

    // Example of how you might send an email using a third-party service
    // This is just a placeholder - you would need to implement the actual email sending logic
    const emailContent = {
      to: email,
      subject: "Welcome to Basketball Rules Test Generator!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Welcome to Basketball Rules Test Generator!</h1>
          <p>Hello ${name || "there"},</p>
          <p>Thank you for creating an account with us. We're excited to have you on board!</p>
          <p>With your new account, you can:</p>
          <ul>
            <li>Take basketball rules tests to improve your knowledge</li>
            <li>Track your progress over time</li>
            <li>Identify areas where you need improvement</li>
            <li>Access study resources tailored to your needs</li>
          </ul>
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          <p>Best regards,</p>
          <p>The Basketball Rules Test Generator Team</p>
        </div>
      `,
    };

    // Log the email content for demonstration purposes
    console.log("Email content:", emailContent);

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
