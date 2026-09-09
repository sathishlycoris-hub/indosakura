<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * ★ SINGLE-DOMAIN VERSION — indosakura.co.jp has been retired. Language
     * is no longer derived from the host; everything lives on
     * indosakura.com and language is purely a session value:
     *
     *  - Set once per session by GeoRedirect (IP-based default, 'en' unless
     *    the visitor looks up as Japan).
     *  - Overridden any time by the visitor via the EN/JA button, which hits
     *    /switch-language/{lang} (see routes/web.php) and updates the same
     *    session value.
     *
     * Defaults to English if nothing has set it yet (e.g. non-GET/XHR first
     * request, before GeoRedirect has had a chance to run).
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $lang = session('lang', 'en');
        $lang = $lang === 'ja' ? 'ja' : 'en';

        session(['lang' => $lang]);
        app()->setLocale($lang);

        // Kept for any code that still reads this — there's only one domain
        // now, so the language toggle is always available; never locked.
        $request->attributes->set('langLocked', false);

        return $next($request);
    }
}