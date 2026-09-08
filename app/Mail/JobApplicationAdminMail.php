<?php
namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class JobApplicationAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public JobApplication $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'New Job Application Received');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.job.admin');
    }

    public function attachments(): array
    {
        if (!$this->application->resume || !Storage::disk('public')->exists($this->application->resume)) {
            return [];
        }

        return [
            Attachment::fromStorageDisk('public', $this->application->resume)
                ->as($this->application->resume_original_name ?: basename($this->application->resume)),
        ];
    }
}