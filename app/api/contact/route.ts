import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { name, email, message, subject } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not defined in environment.');
      return NextResponse.json(
        { error: 'Mail service is currently unconfigured. Please email directly at mandeep.pc2006@gmail.com' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const emailSubject = subject || `Portfolio Inquiry from ${name}`;

    const { data, error } = await resend.emails.send({
      from: `New Message <noreply@mandeepiitp.tech>`,
      to: ['mandeep.pc2006@gmail.com'],
      replyTo: email,
      subject: emailSubject,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from mandeepiitp.tech/ui`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0d0d0f; color: #e4e4e7; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ffffff; margin-top: 0; font-size: 20px; border-bottom: 1px solid #27272a; padding-bottom: 12px;">New Contact Message from Portfolio</h2>
          <div style="margin: 16px 0; background: #141417; padding: 16px; border-radius: 8px; border: 1px solid #27272a;">
            <p style="margin: 4px 0; font-size: 14px;"><strong style="color: #0071e3;">Sender:</strong> ${name}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong style="color: #0071e3;">Email:</strong> <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></p>
            <p style="margin: 4px 0; font-size: 14px;"><strong style="color: #0071e3;">Date:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
          <div style="margin: 16px 0;">
            <h4 style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Message Content:</h4>
            <div style="background: #18181b; padding: 16px; border-radius: 8px; border: 1px solid #27272a; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #f4f4f5;">
              ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </div>
          </div>
          <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #27272a; font-size: 12px; color: #71717a;">
            Sent automatically from your portfolio web interface (<a href="https://mandeepiitp.tech/ui" style="color: #71717a;">mandeepiitp.tech/ui</a>).
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to send message.' },
      { status: 500 }
    );
  }
}
