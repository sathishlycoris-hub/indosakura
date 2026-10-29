<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Faq;
use Inertia\Inertia;
use App\Models\ServiceIndustry;
use App\Models\Seo;
use App\Models\ServicePage;
use App\Models\ServiceItem;

class ServicePageController extends Controller
{
    /* ─── Services listing page ─── */
    public function index()
    {
        return Inertia::render('Services', [
            'lang' => app()->getLocale(),
            'seo'  => Seo::where('page', 'services')->first(),
            'pageData' => ServicePage::first(),
            'services' => Service::select(
                'id', 'title', 'title_ja', 'slug',
                'subtitle', 'subtitle_ja', 'hero_image'
            )->orderBy('id')->get(),

            'faqs' => Faq::select('id', 'question', 'question_ja', 'answer', 'answer_ja')
                ->orderBy('id')->get(),

            'industries' => ServiceIndustry::select('id', 'title', 'title_ja', 'description', 'description_ja')
                ->orderBy('sort_order')->get(),

            'serviceNav' => Service::select('title', 'title_ja', 'slug')->orderBy('id')->get(),
        ]);
    }

    /* ─── Service detail page ─── */
    public function show(string $slug)
{
    // /services/{slug} serves a real Service first; if none has this slug,
    // it falls back to a published Service Landing page with that slug.
    if (!Service::where('slug', $slug)->exists()
        && \App\Models\ServiceLanding::where('slug', $slug)->where('is_published', true)->exists()) {
        return app(\App\Http\Controllers\ServiceLandingPageController::class)->show($slug);
    }

    $service = Service::where('slug', $slug)
        ->with(['highlights', 'benefits', 'pageFaqs', 'pageIndustries', 'items', 'landings', 'blogs', 'featuredCaseStudies.solution:id,slug,title,title_ja'])
        ->firstOrFail();

    $lang = app()->getLocale();

    $faqs = $service->pageFaqs->isNotEmpty()
        ? $service->pageFaqs
        : Faq::select('id', 'question', 'question_ja', 'answer', 'answer_ja')->orderBy('id')->get();

    $industries = $service->pageIndustries->isNotEmpty()
        ? $service->pageIndustries
        : ServiceIndustry::select('id', 'title', 'title_ja', 'description', 'description_ja')
            ->orderBy('sort_order')->get();

    return Inertia::render('Services/Show', [
        'lang'    => $lang,
        'service' => $service,
        'faqs'    => $faqs,
        // child items for the arrow links
        'serviceItems' => $service->items->map(fn ($it) => [
            'id'          => $it->id,
            'title'       => $it->title,
            'title_ja'    => $it->title_ja,
            'description' => $it->card_description,
            'description_ja' => $it->card_description_ja,
            'slug'        => $it->slug,
        ])->concat(
            // Service Landing pages attached to this service — rendered with the
            // same arrow-cards, but linking to /services/landing/{slug}.
            $service->landings->map(fn ($ln) => [
                'id'          => 'landing-' . $ln->id,
                'title'       => $ln->title,
                'title_ja'    => $ln->title_ja,
                'description' => $ln->card_description,
                'description_ja' => $ln->card_description_ja,
                'slug'        => $ln->slug,
                'url'         => $ln->public_url,
            ])
        )->values(),
        // ★ NEW — blogs attached to this service, for the "Case Studies"-style
        // card grid at the bottom of Services/Show. Links out to the shared
        // /blogs/{slug} detail page under Insights.
        'blogs' => $service->blogs->map(fn ($b) => [
            'slug'                  => $b->slug,
            'title'                 => $b->title,
            'title_ja'              => $b->title_ja,
            'short_description'     => $b->short_description,
            'short_description_ja'  => $b->short_description_ja,
            'image'                 => $b->image,
            'category'              => $b->category,
            'category_ja'           => $b->category_ja,
        ]),
        // ★ NEW — Case Studies "featured" on this Service page (via the
        // service_solution_case_study pivot). These are existing
        // SolutionCaseStudy rows — content stays owned by their actual
        // parent Solution — so each card still links to
        // /solutions/{solution_slug}/case-studies/{slug}, same detail page
        // used everywhere else.
        'featuredCaseStudies' => $service->featuredCaseStudies->map(fn ($cs) => [
            'slug'                => $cs->slug,
            'title'               => $cs->title,
            'title_ja'            => $cs->title_ja,
            'company_name'        => $cs->company_name,
            'company_name_ja'     => $cs->company_name_ja,
            'ceo_name'            => $cs->ceo_name,
            'ceo_name_ja'         => $cs->ceo_name_ja,
            'logo'                => $cs->logo,
            'hero_description'    => $cs->hero_description,
            'hero_description_ja' => $cs->hero_description_ja,
            'solution_slug'       => $cs->solution?->slug,
            'solution_title'      => $cs->solution?->title,
            'solution_title_ja'   => $cs->solution?->title_ja,
        ]),
        'pageSeo' => [
            'meta_title'       => $service->getEffectiveMetaTitle($lang),
            'meta_description' => $service->getEffectiveMetaDescription($lang),
            'meta_keywords'    => $lang === 'ja'
                ? ($service->meta_keywords_ja ?? $service->meta_keywords ?? '')
                : ($service->meta_keywords ?? ''),
            'og_image'         => $service->og_image
                ? asset('storage/' . $service->og_image)
                : ($service->hero_image ? asset('storage/' . $service->hero_image) : null),
        ],
        'faqSource'      => $service->pageFaqs->isNotEmpty() ? 'service' : 'global',
        'industries'     => $industries,
        'industrySource' => $service->pageIndustries->isNotEmpty() ? 'service' : 'global',
        'serviceNav'     => Service::select('title', 'title_ja', 'slug')->orderBy('id')->get(),
    ]);
}

public function showItem(string $serviceSlug, string $itemSlug)
{
    $service = Service::where('slug', $serviceSlug)->firstOrFail();

    $item = ServiceItem::where('service_id', $service->id)
        ->where('slug', $itemSlug)
        ->firstOrFail();

    $lang = app()->getLocale();

    return Inertia::render('Services/ItemShow', [
        'lang'    => $lang,
        'service' => $service->only(['id', 'title', 'title_ja', 'slug']),
        'item'    => $item,
        'pageSeo' => [
            'meta_title'       => $item->getEffectiveMetaTitle($lang),
            'meta_description' => $item->getEffectiveMetaDescription($lang),
            'meta_keywords'    => $lang === 'ja'
                ? ($item->meta_keywords_ja ?? $item->meta_keywords ?? '')
                : ($item->meta_keywords ?? ''),
            'og_image'         => $item->og_image
                ? asset('storage/' . $item->og_image)
                : ($item->hero_image ? asset('storage/' . $item->hero_image) : null),
        ],
        'serviceNav' => Service::select('title', 'title_ja', 'slug')->orderBy('id')->get(),
    ]);
}
}