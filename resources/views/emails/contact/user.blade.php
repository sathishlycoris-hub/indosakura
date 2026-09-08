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
  <h2>Thank you, {{ $contact->name_en }}!</h2>
  <p>We have received your message and will get back to you within <strong>24 hours</strong>.</p>
  <p><strong>Your message:</strong><br>{{ $contact->product_service }}</p>
  <p>Best regards,<br><strong>Indo-Sakura Team</strong></p>
  <div class="footer">sales@indosakura.com | 03-5633-7776</div>
</div>
</body>
</html>