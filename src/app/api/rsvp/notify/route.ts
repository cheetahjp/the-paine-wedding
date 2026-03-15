import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Lazy-initialized so the module doesn't throw at build time when the key is absent
let _resend: Resend | null = null;
function getResend(): Resend {
    if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
    return _resend;
}

const ADMIN_EMAIL = process.env.RSVP_NOTIFY_EMAIL || "jeff@jeffpainemedia.com";
const FROM_EMAIL = process.env.RSVP_FROM_EMAIL || "rsvp@thepainewedding.com";

type GuestEntry = {
    name: string;
    attending: boolean | null;
    dietary_restrictions: string | null;
};

type NotifyPayload = {
    household: string;
    guests: GuestEntry[];
    songRequest: string | null;
    advice: string | null;
    guestEmail: string | null;
};

export async function POST(request: NextRequest) {
    // Silently succeed if Resend is not configured — never blocks RSVP submission
    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ ok: true, skipped: true });
    }

    try {
        const body = (await request.json()) as NotifyPayload;
        const { household, guests, songRequest, advice, guestEmail } = body;

        const attendingGuests = guests.filter((g) => g.attending === true);
        const decliningGuests = guests.filter((g) => g.attending === false);

        // ── Admin notification ────────────────────────────────────────────
        const guestRows = guests
            .map((g) => {
                const status =
                    g.attending === true
                        ? "✅ Attending"
                        : g.attending === false
                        ? "❌ Declined"
                        : "⏳ Pending";
                const diet = g.dietary_restrictions
                    ? `<br/><em style="color:#666;font-size:12px;">Dietary: ${g.dietary_restrictions}</em>`
                    : "";
                return `<tr>
                  <td style="padding:6px 12px;border-bottom:1px solid #eee;">${g.name}</td>
                  <td style="padding:6px 12px;border-bottom:1px solid #eee;">${status}${diet}</td>
                </tr>`;
            })
            .join("");

        const adminHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New RSVP</title></head>
<body style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a2e;">
  <h1 style="font-size:24px;margin-bottom:4px;">New RSVP Received</h1>
  <p style="color:#666;margin-top:0;">The Paine Wedding — September 26, 2026</p>

  <div style="background:#f8f5ef;border-radius:12px;padding:20px;margin:20px 0;">
    <h2 style="margin:0 0 8px;font-size:18px;">${household}</h2>
    <p style="margin:0;color:#666;">${attendingGuests.length} attending · ${decliningGuests.length} declining</p>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <thead>
      <tr style="background:#f0ece3;">
        <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Guest</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Status</th>
      </tr>
    </thead>
    <tbody>${guestRows}</tbody>
  </table>

  ${songRequest ? `<p style="margin-bottom:8px;"><strong>Song Request:</strong> ${songRequest}</p>` : ""}
  ${advice ? `<p style="margin-bottom:8px;"><strong>Advice:</strong> ${advice}</p>` : ""}
  ${guestEmail ? `<p style="margin-bottom:8px;"><strong>Guest Email:</strong> ${guestEmail}</p>` : ""}

  <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
  <p style="font-size:12px;color:#999;">
    View the full guest dashboard at
    <a href="https://thepainewedding.com/admin" style="color:#1a3f6f;">thepainewedding.com/admin</a>
  </p>
</body>
</html>`;

        await getResend().emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `RSVP: ${household} — ${attendingGuests.length > 0 ? `${attendingGuests.length} Attending` : "Declined"}`,
            html: adminHtml,
        });

        // ── Guest confirmation ─────────────────────────────────────────────
        if (guestEmail) {
            const attendingList =
                attendingGuests.length > 0
                    ? `<ul style="color:#555;padding-left:20px;">${attendingGuests.map((g) => `<li>${g.name}</li>`).join("")}</ul>`
                    : "";

            const confirmationHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>RSVP Confirmed</title></head>
<body style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a2e;">
  <h1 style="font-size:28px;text-align:center;margin-bottom:4px;">Thank You!</h1>
  <p style="text-align:center;color:#888;margin-top:0;">Your RSVP has been received.</p>

  <div style="background:#f8f5ef;border-radius:12px;padding:24px;margin:20px 0;text-align:center;">
    <p style="font-size:22px;margin:0 0 8px;font-family:Georgia,serif;">Ashlyn &amp; Jeffrey</p>
    <p style="color:#888;margin:0;">Saturday, September 26, 2026</p>
    <p style="color:#888;margin:4px 0 0;">Davis &amp; Grey Farms · Celeste, Texas</p>
  </div>

  ${attendingGuests.length > 0
      ? `<p style="margin-bottom:8px;">We can't wait to celebrate with you!</p>${attendingList}`
      : `<p style="color:#555;">We'll miss you — thank you for letting us know!</p>`
  }

  ${songRequest ? `<p style="margin-top:16px;"><strong>Song Request:</strong> ${songRequest} 🎵</p>` : ""}

  <p style="margin-top:20px;color:#555;line-height:1.6;">
    Need to update your RSVP? Visit
    <a href="https://thepainewedding.com/rsvp" style="color:#1a3f6f;">thepainewedding.com/rsvp</a>
    and search your name again.
  </p>

  <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
  <p style="font-size:12px;color:#999;text-align:center;">
    <a href="https://thepainewedding.com" style="color:#999;">thepainewedding.com</a>
  </p>
</body>
</html>`;

            await getResend().emails.send({
                from: FROM_EMAIL,
                to: guestEmail,
                subject: "RSVP Confirmed — Ashlyn & Jeffrey's Wedding",
                html: confirmationHtml,
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("RSVP notification error:", error);
        // Always return 200 so RSVP submission never fails due to email issues
        return NextResponse.json({ ok: false, error: "Email send failed" }, { status: 200 });
    }
}
