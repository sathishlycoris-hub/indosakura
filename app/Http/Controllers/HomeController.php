<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Service;
use App\Models\Solution;
use App\Models\Newsevent;
use App\Models\Seo;
use App\Models\HomeCaseStudy;
use App\Models\Blog;

use App\Models\HomepageSetting;

class HomeController extends Controller
{
    public function index()
    {

        $homepage = HomepageSetting::firstOrCreate([]);

        $caseStudies = HomeCaseStudy::orderBy('sort_order')
            ->orderByDesc('id')
            ->take(4)
            ->get([
                'slug',
                'title', 'title_ja',
                'hero_image',
                'hero_description', 'hero_description_ja',
                'tags', 'tags_ja',
            ]);

        // ── "Information" feed — merges News/Events and Blogs into one
        // date-sorted list. Each entry is tagged with its own `type` so the
        // frontend can badge it ("News"/eventtype vs "Blog") and build the
        // right link (news.show route vs /blogs/{slug}).
        $newsItems = Newsevent::orderByDesc('date')
            ->take(10)
            ->get(['id', 'date', 'eventtype', 'eventtype_ja', 'short', 'short_ja'])
            ->map(fn ($n) => [
                'source'      => 'news',
                'id'          => $n->id,
                'date'        => $n->date,
                'type'        => $n->eventtype,
                'type_ja'     => $n->eventtype_ja,
                'title'       => $n->short,
                'title_ja'    => $n->short_ja,
                'href'        => route('news.show', $n->id),
            ]);

        $blogItems = Blog::where('status', 'published')
            ->orderByDesc('published_date')
            ->take(10)
            ->get(['id', 'slug', 'published_date', 'category', 'category_ja', 'title', 'title_ja'])
            ->map(fn ($b) => [
                'source'      => 'blog',
                'id'          => $b->id,
                'date'        => $b->published_date?->format('Y-m-d'),
                'type'        => $b->category ?: 'Blog',
                'type_ja'     => $b->category_ja ?: 'ブログ',
                'title'       => $b->title,
                'title_ja'    => $b->title_ja,
                'href'        => "/blogs/{$b->slug}",
            ]);

        $updates = $newsItems->concat($blogItems)
            ->sortByDesc('date')
            ->take(5)
            ->values();

        return Inertia::render('Index', [

            // ── homepage CMS content ──
            'homepage' => $homepage,
            'seo' => Seo::where('page', 'home')->first(),

            'updates' => $updates,

            'services' => Service::select(
                'id',
                'title',
                'slug',
                'hero_description',
                'title_ja',
                'hero_description_ja'
            )->orderBy('id')->get(),

            'solutions' => Solution::select(
                'id',
                'title',
                'slug',
                'hero_description',
                'title_ja',
                'hero_description_ja'
            )->orderBy('id')->get(),

            'caseStudies' => $caseStudies,
        ]);
    }
}
