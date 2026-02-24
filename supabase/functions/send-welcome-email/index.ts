import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
    try {
        // Parse the payload from the Database Webhook
        const payload = await req.json();
        console.log("Webhook payload received:", payload);

        // The webhook payload structure for INSERTs has the new row in `record`
        const { record } = payload;
        const { name, email, user_type } = record;

        if (!email) {
            throw new Error("No email found in payload");
        }

        // Determine the email content based on user_type (client vs partner)
        const emailSubject = "Welcome to the Workaholic Waitlist";
        const waitlistType = user_type === "partner" ? "Partner" : "Client";

        const emailHtml = `
      <div style="font-family: Poppins, Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p>Hi ${name},</p>
        <br>
        <p>You're officially on the Workaholic ${waitlistType} waitlist.</p>
        <br>
        <p>Thank you for joining us as we build a smarter way to discover and access structured coworking spaces across Nigeria.</p>
        <br>
        <p>Workaholic is designed to help professionals:</p>
        <ul>
          <li style="margin-bottom: 8px;">Find reliable work environments near them</li>
          <li style="margin-bottom: 8px;">Compare vetted coworking spaces</li>
          <li style="margin-bottom: 8px;">Book seamlessly and intentionally</li>
        </ul>
        <br>
        <p>We’re currently preparing for internal testing and early access rollout.</p>
        <br>
        <p>As a waitlist member, you’ll be among the first to:</p>
        <ul>
          <li style="margin-bottom: 8px;">Experience the platform</li>
          <li style="margin-bottom: 8px;">Receive early product updates</li>
          <li style="margin-bottom: 8px;">Access exclusive beta invitations</li>
        </ul>
        <br>
        <p>We appreciate your early support.</p>
        <br>
        <p>The future of focused work starts with access.</p>
        <br>
        <p>&mdash;<br>
        <strong>Workaholic Africa</strong><br>
        Location-based coworking discovery<br>
        <a href="https://workaholicafrica.com" style="color: #666; text-decoration: underline;">WorkaholicAfrica.com</a></p>
      </div>
    `;

        // Call the Resend API
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Workaholic Africa <noreply@workaholicafrica.com>",
                to: [email],
                subject: emailSubject,
                html: emailHtml,
            }),
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.ok ? 200 : 400,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("Error processing webhook:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
});
