<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Mail\JobApplicationAdminMail;
use App\Mail\JobApplicationUserMail;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class JobApplicationController extends Controller
{
    public function store(Request $request, Job $job)
    {
        // Step 1: Verify reCAPTCHA
        $recaptcha = Http::asForm()->post(
            'https://www.google.com/recaptcha/api/siteverify',
            [
                'secret'   => config('services.recaptcha.secret_key'),
                'response' => $request->input('recaptcha'),
                'remoteip' => $request->ip(),
            ]
        );
         Log::info('reCAPTCHA response:', $recaptcha->json());

        if (!data_get($recaptcha->json(), 'success')) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        }

        // Step 2: Validate
        $data = $request->validate([
            'full_name'    => 'required|string|max:255',
            'email'        => 'required|email',
            'phone'        => 'required|string|max:255',
            'cover_letter' => 'nullable|string',
            'resume'       => 'required|file|mimes:pdf,doc,docx|max:5120',
            'agree_terms'  => 'accepted',
        ]);

        // Step 3: Store resume
        $data['resume_original_name'] = $request->file('resume')->getClientOriginalName();
        $data['resume'] = $request->file('resume')->store('job-applications', 'public');

        // Step 4: Save to DB
        $application = $job->applications()->create($data);
        $application->load('job');

        // Step 5: Send emails
        Mail::to('info@mail.indosakura.com')->send(new JobApplicationAdminMail($application));
        Mail::to($application->email)->send(new JobApplicationUserMail($application));

        return back()->with('success', 'Application submitted successfully.');
    }
}