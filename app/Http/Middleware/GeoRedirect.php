<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class GeoRedirect
{
    /**
     * Session key marking that a language decision has already been made
     * THIS SESSION — either by the geo-check running once, or by the
     * visitor manually clicking EN/JA (see routes/web.php: /switch-language).
     * Once set, this middleware never overrides the language again for the
     * rest of the session.
     */
    private const DECIDED_KEY = 'lang_decided';

    /**
     * Handle an incoming request.
     *
     * ★ SINGLE-DOMAIN VERSION — indosakura.co.jp has been retired. Everything
     * now lives on indosakura.com; language is a session value, not a domain.
     *
     * First-request-of-session-only geo check: a visitor with no decision
     * yet this session is geo-located, and if that lookup confidently says
     * Japan, the session language is set to 'ja'; everyone else (including
     * failed/uncertain lookups) defaults to 'en'. No redirect ever happens
     * here — the visitor stays on whatever URL they landed on, only the
     * language changes. The session is then marked so this never fires
     * again until a new session starts. Manual EN/JA selection (routes/web.php:
     * /switch-language) also marks the session, so a manual pick this
     * session is never re-evaluated by geo on a later request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only ever consider a full top-level page load, not asset/XHR/API
        // requests, and only GET (never touch session state mid-flight on
        // a POST/PUT/DELETE).
        if (!$request->isMethod('GET') || $request->ajax() || $request->wantsJson()) {
            return $next($request);
        }

        // Already decided this session (geo-checked before, or manually
        // chose EN/JA) — never re-evaluate. This is what stops location
        // silently overriding a manual choice for the rest of the session.
        if (session()->has(self::DECIDED_KEY)) {
            return $next($request);
        }

        $countryCode = $this->lookupCountry($request->ip());

        session([self::DECIDED_KEY => true]);

        // Uncertain/failed lookup → default to English, per spec (fall back
        // to default behavior when detection is unavailable).
        session(['lang' => $countryCode === 'JP' ? 'ja' : 'en']);

        return $next($request);
    }

    /**
     * Best-effort country lookup. Returns a 2-letter ISO country code, or
     * null on any failure/timeout/uncertainty — callers must treat null as
     * "use the default." The IP itself is sent to the lookup provider
     * (necessarily, for a geo-IP lookup) but is never logged, stored, or
     * exposed to the frontend from this method.
     */
    private function lookupCountry(?string $ip): ?string
    {
        if (
            !$ip ||
            in_array($ip, ['127.0.0.1', '::1'], true) ||
            filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false
        ) {
            return null;
        }

        try {
            $response = Http::timeout(1.5)
                ->retry(1, 100)
                ->get("https://ipwho.is/{$ip}", ['fields' => 'success,country_code']);

            if ($response->ok() && $response->json('success') === true) {
                $code = $response->json('country_code');
                return is_string($code) ? strtoupper($code) : null;
            }
        } catch (\Throwable $e) {
            // Never let a geo-lookup failure break the request — just fall
            // back to the default language. Logged at debug level only, no
            // IP included in the log line.
            Log::debug('GeoRedirect: country lookup failed, defaulting to en', [
                'error' => $e->getMessage(),
            ]);
        }

        return null;
    }
}