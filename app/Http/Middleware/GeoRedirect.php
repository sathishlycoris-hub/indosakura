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
     * Session key marking that a domain/language decision has already been
     * made THIS SESSION — either by the geo-check running once, or by the
     * visitor manually clicking EN/JA (see routes/web.php: /switch-language).
     * Once set, this middleware never redirects again for the rest of the
     * session. Deliberately session-scoped, not a long-lived cookie: a
     * fresh browser session (next visit, e.g. the next day) re-runs geo
     * detection from scratch, so a Japan visitor who picked EN today isn't
     * permanently pinned to .com on a later visit — only "don't keep
     * overriding within the same session" is guaranteed, not forever.
     */
    private const DECIDED_KEY = 'lang_decided';

    /**
     * Handle an incoming request.
     *
     * First-request-of-session-only geo redirect, layered on top of the
     * existing domain-based language system (SetLocale): a visitor with no
     * decision yet this session is geo-located, and if that lookup
     * confidently says Japan, sent to indosakura.co.jp; everyone else
     * (including failed/uncertain lookups) stays on/goes to indosakura.com.
     * The session is then marked so this never fires again until a new
     * session starts — manual EN/JA selection (routes/web.php:
     * /switch-language) also marks the session, so a manual pick this
     * session is never re-evaluated by geo on a later request in the same
     * session.
     *
     * Deliberately conservative to avoid the failure modes called out in
     * the spec: no redirect loop (the session flag makes this strictly
     * one-shot per session), no repeated redirects on every page load, no
     * reliance on navigator.language, no dependency on the geo lookup
     * succeeding (falls back to .com on any failure/uncertainty), and no
     * storage/exposure of the IP beyond a single outbound lookup that is
     * not logged or persisted anywhere.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only ever consider a full top-level page load, not asset/XHR/API
        // requests, and only GET (never redirect a POST/PUT/DELETE mid-flight).
        if (!$request->isMethod('GET') || $request->ajax() || $request->wantsJson()) {
            return $next($request);
        }

        // Already decided this session (geo-checked before, or manually
        // chose EN/JA) — never re-evaluate. This is what prevents both
        // redirect loops and location silently overriding a manual choice
        // for the rest of this session.
        if (session()->has(self::DECIDED_KEY)) {
            return $next($request);
        }

        // ★ Cross-domain bounce token from /switch-language (routes/web.php).
        // Session cookies don't carry between indosakura.com and
        // indosakura.co.jp, so a manual switch signs a short-lived,
        // one-time token onto the redirect URL instead. If present and
        // valid, this domain's session is marked decided WITHOUT running a
        // geo lookup, so the manual choice can never be immediately
        // overridden by IP on arrival. The token is single-use by nature
        // (expires in 30s and is stripped from the URL below); it carries
        // no PII, just a decision flag + expiry.
        if ($ld = $request->query('_ld')) {
            try {
                $payload = decrypt($ld);
                if (($payload['decided'] ?? false) === true && ($payload['exp'] ?? 0) >= now()->timestamp) {
                    session([self::DECIDED_KEY => true]);

                    // Redirect once more to strip ?_ld=... from the visible
                    // URL — otherwise it lingers in the address bar/browser
                    // history, gets shared in copied links, etc.
                    $clean = $request->fullUrlWithQuery(['_ld' => null]);
                    $clean = preg_replace('/([?&])_ld=$/', '', $clean); // drop trailing empty param
                    $clean = rtrim($clean, '?&');
                    return redirect()->to($clean);
                }
            } catch (\Throwable $e) {
                // Invalid/tampered/expired token — ignore it and fall
                // through to a normal geo check, same as if it weren't
                // present at all.
            }
        }

        $host = strtolower($request->getHost());
        $isProdDomain = str_ends_with($host, '.com') || str_ends_with($host, '.co.jp');

        // Local/staging — no real domain pair to redirect between, and no
        // point spending an outbound geo lookup on a dev machine. Let
        // SetLocale's session fallback handle locale as before.
        if (!$isProdDomain) {
            return $next($request);
        }

        $countryCode = $this->lookupCountry($request->ip());

        // Uncertain/failed lookup → do nothing, stay on whichever domain
        // the visitor already landed on (per spec: fall back to existing
        // default behavior when detection is unavailable). Still mark as
        // decided so we don't retry the lookup on every subsequent request
        // this session.
        if ($countryCode === null) {
            session([self::DECIDED_KEY => true]);
            return $next($request);
        }

        $isJapan = $countryCode === 'JP';
        $onJpDomain = str_ends_with($host, '.co.jp');

        session([self::DECIDED_KEY => true]);

        // Already on the domain that matches their location — nothing to do.
        if ($isJapan === $onJpDomain) {
            return $next($request);
        }

        $targetHost = $isJapan
            ? config('services.indosakura.co_jp_domain')
            : config('services.indosakura.com_domain');

        $scheme = $request->isSecure() ? 'https' : 'http';
        $path = $request->getRequestUri(); // includes query string, same-path by construction

        return redirect()->to("{$scheme}://{$targetHost}{$path}");
    }

    /**
     * Best-effort country lookup. Returns a 2-letter ISO country code, or
     * null on any failure/timeout/uncertainty — callers must treat null as
     * "don't redirect, use the default." The IP itself is sent to the
     * lookup provider (necessarily, for a geo-IP lookup) but is never
     * logged, stored, or exposed to the frontend from this method.
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
            // back to the default domain. Logged at debug level only, no IP
            // included in the log line.
            Log::debug('GeoRedirect: country lookup failed, defaulting to .com', [
                'error' => $e->getMessage(),
            ]);
        }

        return null;
    }
}
