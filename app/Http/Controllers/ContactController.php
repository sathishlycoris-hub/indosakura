<?php
namespace App\Http\Controllers;

use App\Mail\ContactAdminMail;
use App\Mail\ContactUserMail;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
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

        if (!data_get($recaptcha->json(), 'success')) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        }

        // Step 2: Validate
        $data = $request->validate([
            'name_en'        => 'required|string|max:255',
            'email'          => 'required|email|max:255',
            'telephone'      => 'required|string|max:20',
            'address'        => 'required|string|max:255',
            'productService' => 'required|string',
        ]);

        // Step 3: Save to DB
        $contact = Contact::create([
            'name_en'         => $data['name_en'],
            'email'           => $data['email'],
            'telephone'       => $data['telephone'],
            'address'         => $data['address'],
            'product_service' => $data['productService'],
        ]);

        // Step 4: Send emails
        Mail::to('hello@indosakura.com')->send(new ContactAdminMail($contact));
        Mail::to($contact->email)->send(new ContactUserMail($contact));

        return redirect()->route('contact.thank_you');
    }
}