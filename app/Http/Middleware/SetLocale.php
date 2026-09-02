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
     * Language is now derived from the domain on BOTH sides:
     *
     *  - indosakura.com   → English
     *  - indosakura.co.jp → Japanese
     *
     * There is no per-domain toggle anymore — switching language means
     * switching domain (see the /set-language route and Header.tsx, which
     * now link to the equivalent path on the other domain instead of
     * POSTing to flip a session flag).
     *
     * The only place session comes in: local/staging hosts that match
     * neither pattern (localhost, a Laragon .test domain, a preview URL)
     * fall back to whatever locale was last set in session, defaulting to
     * English on first visit. This keeps local dev working without needing
     * two separate domains configured.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = strtolower($request->getHost());
        $isJpDomain = str_ends_with($host, '.co.jp');
        $isComDomain = str_ends_with($host, '.com');

        if ($isJpDomain) {
            $lang = 'ja';
        } elseif ($isComDomain) {
            $lang = 'en';
        } else {
            // Local/staging fallback — no recognizable production domain.
            $lang = session('lang', 'en');
        }

        session(['lang' => $lang]);
        app()->setLocale($lang);

        // Kept for any code that still reads this — no domain is "locked"
        // anymore since both now support both languages via the domain
        // switch link, but nothing currently depends on it being true.
        $request->attributes->set('langLocked', false);

        return $next($request);
    }
}
