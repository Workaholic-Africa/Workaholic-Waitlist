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
        let emailSubject = "Welcome to the Workaholic Waitlist!";
        let emailHtml = "";

        if (user_type === "partner") {
            emailHtml = `
        <div style="font-family: Poppins, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #A0FF00;">Welcome, Partner!</h2>
          <p>Hi ${name},</p>
          <br>
          <p>You're officially on the Workaholic Partner waitlist.</p>
          <br>
          <p>Thank you for joining us as we build a smarter way to discover and access structured coworking spaces across Nigeria.</p>
          <br>
          <p>Workaholic is designed to help professionals:</p>
          <br>
          <ul>
            <li>Find reliable work environments near them</li>
            <li>Compare vetted coworking spaces</li>
            <li>Book seamlessly and intentionally</li>
          </ul>
          <br>
          <p>We’re currently preparing for internal testing and early access rollout.</p>
          <br>
          <p>As a waitlist member, you’ll be among the first to:</p>
          <br>
          <ul>
            <li>Experience the platform</li>
            <li>Receive early product updates</li>
            <li>Access exclusive beta invitations</li>
          </ul>
          <br>
          <p>We appreciate your early support.</p>
          <br>
          <p>The future of focused work starts with access.</p>
          <br>
          <p>Workaholic Africa</p>
          <p>Location-based coworking discovery</p>
          <p><a href="https://workaholicafrica.com">WorkaholicAfrica.com</a></p>
        </div>
      `;
        } else {
            emailHtml = `
        <div style="font-family: Poppins, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #A0FF00;">Welcome, Partner!</h2>
          <p>Hi ${name},</p>
          <br>
          <p>You're officially on the Workaholic Client waitlist.</p>
          <br>
          <p>Thank you for joining us as we build a smarter way to discover and access structured coworking spaces across Nigeria.</p>
          <br>
          <p>Workaholic is designed to help professionals:</p>
          <br>
          <ul>
            <li>Find reliable work environments near them</li>
            <li>Compare vetted coworking spaces</li>
            <li>Book seamlessly and intentionally</li>
          </ul>
          <br>
          <p>We’re currently preparing for internal testing and early access rollout.</p>
          <br>
          <p>As a waitlist member, you’ll be among the first to:</p>
          <br>
          <ul>
            <li>Experience the platform</li>
            <li>Receive early product updates</li>
            <li>Access exclusive beta invitations</li>
          </ul>
          <br>
          <p>We appreciate your early support.</p>
          <br>
          <p>The future of focused work starts with access.</p>
          <br>
          <p>Workaholic Africa</p>
          <p>Location-based coworking discovery</p>
          <p><a href="https://workaholicafrica.com">WorkaholicAfrica.com</a></p>
        </div>
      `;
        }

        // Call the Resend API
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                // TODO: Replace with the verified domain email you get from Resend
                from: "Workaholic <onboarding@resend.dev>",
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
