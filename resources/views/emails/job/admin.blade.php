<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; }
  .box { max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 8px; }
  h2 { color: #e63946; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 10px; border-bottom: 1px solid #f0f0f0; }
  td:first-child { font-weight: bold; width: 220px; color: #555; }
</style></head>
<body>
<div class="box">
  <h2>New Job Application</h2>
  <table>
    <tr><td>Job</td><td>{{ $application->job->title ?? 'N/A' }}</td></tr>
    <tr><td>Name</td><td>{{ $application->full_name }}</td></tr>
    <tr><td>Email</td><td>{{ $application->email }}</td></tr>
    <tr><td>Phone</td><td>{{ $application->phone }}</td></tr>
    <tr><td>Cover Letter</td><td>{{ $application->cover_letter ?? '-' }}</td></tr>
    <!-- <tr><td>Resume</td><td>{{ $application->resume ? ($application->resume_original_name ?: basename($application->resume)) . ' (see attachment)' : '-' }}</td></tr> -->
    <tr><td>Applied At</td><td>{{ $application->created_at->format('Y-m-d H:i') }}</td></tr>
  </table>
</div>
</body>
</html>