<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; }
  .box { max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 8px; }
  h2 { color: #e63946; }
  .footer { margin-top: 30px; font-size: 12px; color: #999; }
</style></head>
<body>
<div class="box">
  <h2>Application Received!</h2>
  <p>Dear {{ $application->full_name }},</p>
  <p>Thank you for applying to <strong>{{ $application->job->title ?? 'the position' }}</strong> at Indo-Sakura.</p>
  <p>We have received your application and our team will review it shortly. We will contact you if your profile matches our requirements.</p>
  <p>Best regards,<br><strong>Indo-Sakura HR Team</strong></p>
  <div class="footer">info@mail.indosakura.com | 03-5633-7776</div>
</div>
</body>
</html>