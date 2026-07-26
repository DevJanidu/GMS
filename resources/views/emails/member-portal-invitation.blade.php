<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color:#ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                    <tr>
                        <td align="center" style="padding: 32px 32px 16px 32px;">
                            @if ($logoPath)
                                <img src="{{ $message->embed($logoPath) }}" alt="{{ $gymName }}" width="56" height="56" style="border-radius: 8px; object-fit: contain; margin-bottom: 12px;">
                            @endif
                            <div style="font-size: 15px; font-weight: 600; color: #52525b;">{{ $gymName }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 32px 8px 32px;">
                            <h1 style="font-size: 20px; margin: 0 0 16px 0; color: #18181b;">Hello {{ $memberName }},</h1>
                            <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 24px 0;">
                                {{ $gymName }} has set up your member portal account. From there you can see your membership, attendance history, receipts, and announcements.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 32px 24px 32px;">
                            <a href="{{ $url }}" style="display:inline-block; background-color:#059669; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding: 12px 28px; border-radius: 8px;">
                                Set up my portal account
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 32px 32px 32px;">
                            <p style="font-size: 13px; color: #71717a; margin:0;">This invitation link expires in 7 days.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
