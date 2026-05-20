import { Resend } from 'resend';

const deposits = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { claimId, amount, recipientEmail, txHash, sender, pin } = body;

    if (!claimId || !amount || !recipientEmail || !txHash) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const claimUrl = `${origin}/claim/${claimId}`;

    // Store deposit info
    deposits.set(claimId, {
      claimId,
      amount,
      recipientEmail,
      txHash,
      sender,
      claimUrl,
      pin: pin || null,         // store 4-digit PIN if provided
      claimed: false,
      createdAt: new Date().toISOString(),
    });

    // Build beautiful HTML email
    const hasPin = pin && pin.length === 4;
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>You have received ETH via transfr</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFF;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:28px 36px 20px;background:#FFFFFF;border-radius:16px 16px 0 0;border:1px solid #E4E9F2;border-bottom:none;text-align:center;">
              <span style="font-size:20px;font-weight:800;color:#1A1C1E;letter-spacing:-0.04em;">transfr</span>
              <p style="color:#8A9099;font-size:12px;margin:4px 0 0;letter-spacing:0.06em;text-transform:uppercase;">Crypto Transfer Notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 36px;background:#FFFFFF;border-left:1px solid #E4E9F2;border-right:1px solid #E4E9F2;">
              <h1 style="color:#1A1C1E;font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:-0.02em;">You have received ETH</h1>
              <p style="color:#474D52;font-size:15px;margin:0 0 28px;line-height:1.6;">Someone just sent you testnet ETH via transfr. Claim it to your wallet now.</p>
              <div style="background:linear-gradient(135deg,#EEF2FF,#F0F5FF);border:1px solid rgba(0,71,255,0.2);border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
                <p style="color:#8A9099;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 8px;">Amount Waiting For You</p>
                <p style="color:#1A1C1E;font-size:44px;font-weight:800;letter-spacing:-0.04em;margin:0;line-height:1;">${amount}</p>
                <p style="color:#0047FF;font-size:16px;font-weight:700;margin:6px 0 0;">ETH</p>
              </div>
              ${hasPin ? `
              <div style="background:#FEF3C7;border:1px solid rgba(217,119,6,0.3);border-radius:12px;padding:14px 18px;margin-bottom:24px;">
                <p style="color:#D97706;font-size:12px;font-weight:700;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em;">PIN Required</p>
                <p style="color:#474D52;font-size:13px;margin:0;line-height:1.55;">This transfer is PIN-protected. The sender will share your 4-digit PIN separately. You will need it to claim.</p>
              </div>
              ` : ''}
              <a href="${claimUrl}" style="display:block;background:#0047FF;color:#ffffff;text-decoration:none;text-align:center;padding:16px 32px;border-radius:10px;font-size:16px;font-weight:700;margin-bottom:24px;">
                Claim My ${amount} ETH &rarr;
              </a>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E4E9F2;padding-top:16px;">
                <tr>
                  <td style="padding:8px 0;color:#8A9099;font-size:12px;">From</td>
                  <td align="right" style="padding:8px 0;color:#474D52;font-size:12px;font-family:monospace;">${sender ? sender.slice(0,6)+'...'+sender.slice(-4) : 'Anonymous'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#8A9099;font-size:12px;border-top:1px solid #E4E9F2;">Network</td>
                  <td align="right" style="padding:8px 0;color:#474D52;font-size:12px;border-top:1px solid #E4E9F2;">Ethereum Sepolia Testnet</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#8A9099;font-size:12px;border-top:1px solid #E4E9F2;">Tx Hash</td>
                  <td align="right" style="padding:8px 0;color:#0047FF;font-size:11px;font-family:monospace;border-top:1px solid #E4E9F2;">${txHash.slice(0,10)}...${txHash.slice(-8)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 28px;background:#F8FAFF;border-radius:0 0 16px 16px;border:1px solid #E4E9F2;border-top:none;text-align:center;">
              <p style="color:#8A9099;font-size:12px;margin:0;line-height:1.6;">
                Funds are secured in a smart contract until claimed.<br>
                <a href="${claimUrl}" style="color:#0047FF;text-decoration:none;">${claimUrl}</a>
              </p>
              <p style="color:#C4C9D4;font-size:11px;margin:10px 0 0;">© transfr &middot; Powered by Ethereum Sepolia</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    let emailStatus = 'not_sent';
    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY); // instantiate here, not at module level
        const emailResult = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'transfr <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: `ETH transfer notification from transfr`,
          html: emailHtml,
          text: `You have received ${amount} ETH on transfr.\n\nClaim your ETH here: ${claimUrl}\n\nFunds are secured in a smart contract until claimed.\n\nThis is an automated notification from transfr.`,
          reply_to: `noreply@rialo.online`,
        });
        console.log('Email sent:', emailResult);
        emailStatus = emailResult.error ? `resend_error: ${emailResult.error.message}` : 'sent';
      } else {
        emailStatus = 'no_api_key';
      }
    } catch (emailErr) {
      console.error('Email send failed (non-fatal):', emailErr.message);
      emailStatus = `email_error: ${emailErr.message}`;
    }

    return Response.json({ claimUrl, claimId, emailStatus });
  } catch (err) {
    console.error('Deposit API error:', err);
    return Response.json({ error: 'Internal server error', detail: err.message }, { status: 500 });
  }
}

export { deposits };
