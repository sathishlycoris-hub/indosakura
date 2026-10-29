<?php
// app/Http/Controllers/SitemapController.php
// Single authoritative sitemap:  https://www.indosakura.com/sitemap.xml

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\IndiaDesk;
use App\Models\Infographic;
use App\Models\Job;
use App\Models\Service;
use App\Models\ServiceItem;
use App\Models\ServiceLanding;
use App\Models\Solution;
use App\Models\SolutionCaseStudy;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /** Fixed pages that exist as public routes. */
    private const STATIC = [
        '/', '/services', '/solutions', '/india-desks', '/blogs', '/blogs/casestudies',
        '/blogs/infographics', '/blogs/seminars-index',
        '/corporate/greetings', '/corporate/philosophy', '/corporate/profile',
        '/corporate/history', '/corporate/clients', '/corporate/team',
        '/corporate/press-release', '/corporate-info', '/recruitment', '/contact',
        '/cookie-policy', '/usage',
    ];

    public function index()
    {
        // Cached for 1 hour so crawlers never hammer the database.
        $xml = Cache::remember('sitemap.xml', 3600, fn () => $this->build());

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    private function build(): string
    {
        $host = 'https://' . config('services.indosakura.com_domain', 'www.indosakura.com');
        $urls = [];

        $add = function (string $path, $lastmod = null) use (&$urls, $host) {
            $path = '/' . trim($path, '/');
            $urls[$host . ($path === '/' ? '/' : $path)] = $lastmod;
        };

        foreach (self::STATIC as $p) {
            $add($p);
        }

        foreach (Service::select('slug', 'updated_at')->get() as $r) {
            $add("/services/{$r->slug}", $r->updated_at);
        }
        foreach (ServiceItem::with('service:id,slug')->select('service_id', 'slug', 'updated_at')->get() as $r) {
            if ($r->service && $r->slug) $add("/services/{$r->service->slug}/{$r->slug}", $r->updated_at);
        }
        foreach (ServiceLanding::where('is_published', true)->select('slug', 'updated_at')->get() as $r) {
            $add("/services/{$r->slug}", $r->updated_at);
        }
        foreach (Solution::select('slug', 'updated_at')->get() as $r) {
            $add("/solutions/{$r->slug}", $r->updated_at);
        }
        foreach (SolutionCaseStudy::with('solution:id,slug')->select('solution_id', 'slug', 'updated_at')->get() as $r) {
            if ($r->solution && $r->slug) $add("/solutions/{$r->solution->slug}/case-studies/{$r->slug}", $r->updated_at);
        }
        foreach (IndiaDesk::select('slug', 'updated_at')->get() as $r) {
            $add("/india-desks/{$r->slug}", $r->updated_at);
        }
        foreach (Blog::where('status', 'published')->select('slug', 'updated_at')->get() as $r) {
            $add("/blogs/{$r->slug}", $r->updated_at);
        }
        foreach (Infographic::where('status', 'published')->select('slug', 'updated_at')->get() as $r) {
            $add("/blogs/infographics/{$r->slug}", $r->updated_at);
        }
        foreach (Job::where('status', 'published')->select('slug', 'updated_at')->get() as $r) {
            $add("/recruitment/{$r->slug}", $r->updated_at);
        }

        $out  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $out .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $loc => $lastmod) {
            $out .= "  <url>\n    <loc>" . htmlspecialchars($loc, ENT_XML1) . "</loc>\n";
            if ($lastmod) {
                $out .= '    <lastmod>' . $lastmod->toAtomString() . "</lastmod>\n";
            }
            $out .= "  </url>\n";
        }
        return $out . "</urlset>\n";
    }
}
