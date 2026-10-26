<?php
// app/Http/Controllers/ServiceLandingPageController.php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceLanding;
use Inertia\Inertia;

class ServiceLandingPageController extends Controller
{
    /** GET /services/landing/{slug} */
    public function show(string $slug)
    {
        $landing = ServiceLanding::with('service:id,title,title_ja,slug')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $lang = app()->getLocale();

        return Inertia::render('Services/Landing', [
            'lang'    => $lang,
            'landing' => $landing,
            'pageSeo' => [
                'meta_title'       => $landing->getEffectiveMetaTitle($lang),
                'meta_description' => $landing->getEffectiveMetaDescription($lang),
                'meta_keywords'    => $lang === 'ja'
                    ? ($landing->meta_keywords_ja ?? $landing->meta_keywords ?? '')
                    : ($landing->meta_keywords ?? ''),
                'og_image'         => $landing->og_image
                    ? asset('storage/' . $landing->og_image)
                    : ($landing->hero_image ? asset('storage/' . $landing->hero_image) : null),
            ],
            'serviceNav' => Service::select('title', 'title_ja', 'slug')->orderBy('id')->get(),
        ]);
    }
}
