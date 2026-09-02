<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
    'recaptcha' => [
    'site_key'   => env('RECAPTCHA_SITE_KEY'),
    'secret_key' => env('RECAPTCHA_SECRET_KEY'),
],

    // ★ NEW — the two production hostnames used for domain-based language
    // switching. Override these in .env for local/staging environments if
    // you want to test the actual cross-domain redirect there; otherwise
    // the app falls back to session-based locale on unrecognized hosts
    // (see App\Http\Middleware\SetLocale) and these values are only used
    // when actually building a switch-language link.
    'indosakura' => [
        'com_domain'   => env('INDOSAKURA_COM_DOMAIN', 'indosakura.com'),
        'co_jp_domain' => env('INDOSAKURA_CO_JP_DOMAIN', 'indosakura.co.jp'),
    ],

];
