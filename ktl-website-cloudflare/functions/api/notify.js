// Sends an email notification to the admin whenever a new provider listing is submitted.
// Uses Resend (resend.com) — free tier, no domain verification required when sending
// to the same email address used to create the Resend account.
//
// Requires two environment variables, set in Cloudflare Pages → Settings → Variables and secrets:
//   RESEND_API_KEY   (Secret)  — your Resend API key
//   NOTIFY_EMAIL     (Text)    — the email address that should receive notifications

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const apiKey = context.env.RESEND_API_KEY;
    const toEmail = context.env.NOTIFY_EMAIL;

    if (!apiKey || !toEmail) {
      // Not configured yet — fail quietly so the onboarding form still works.
      return new Response(JSON.stringify({ ok: false, reason: 'not configured' }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }

    const text =
      `A new service provider has submitted a listing to Keta Tourism Logistics.\n\n` +
      `Name: ${data.name || ''}\n` +
      `Category: ${data.category || ''}\n` +
      `Location: ${data.location || ''}\n` +
      `Phone: ${data.phone || ''}\n` +
      `Email: ${data.email || 'n/a'}\n` +
      `Link: ${data.link || 'n/a'}\n\n` +
      `Description:\n${data.desc || ''}\n\n` +
      `Log in to the admin panel to approve or reject it.`;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Keta Tourism Logistics <onboarding@resend.dev>',
        to: [toEmail],
        subject: `New listing submitted: ${data.name || 'Untitled'}`,
        text
      })
    });

    return new Response(JSON.stringify({ ok: resendRes.ok }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }
}
