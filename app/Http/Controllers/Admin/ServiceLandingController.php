<?php
// app/Http/Controllers/Admin/ServiceLandingController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceLanding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceLandingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ServiceLanding/Index', [
            'landings' => ServiceLanding::with('service:id,title,slug')
                ->orderBy('sort_order')->orderByDesc('id')->get(),
            'services' => Service::select('id', 'title', 'slug')->orderBy('id')->get(),
            'baseUrl'  => url('/services'),
        ]);
    }

    private function validateAndDecode(Request $request, ?int $ignoreId = null): array
    {
        $request->validate([
            'service_id'           => 'nullable|exists:services,id',
            'title'                => 'required|string|max:255',
            'title_ja'             => 'nullable|string|max:255',
            'slug'                 => [
                'required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                'unique:service_landings,slug,' . ($ignoreId ?? 'NULL'),
                function ($attr, $value, $fail) {
                    // /services/{slug} is shared with real services, so a landing slug must not clash
                    if ($value === 'landing' || Service::where('slug', $value)->exists()) {
                        $fail('This name is already used by a service page. Please choose a different name.');
                    }
                },
            ],
            'card_description'     => 'nullable|string',
            'card_description_ja'  => 'nullable|string',
            'eyebrow'              => 'nullable|string|max:255',
            'eyebrow_ja'           => 'nullable|string|max:255',
            'subtitle'             => 'nullable|string',
            'subtitle_ja'          => 'nullable|string',
            'hero_description'     => 'nullable|string',
            'hero_description_ja'  => 'nullable|string',
            'intro'                => 'nullable|string',
            'intro_ja'             => 'nullable|string',
            'cta_label'            => 'nullable|string|max:255',
            'cta_label_ja'         => 'nullable|string|max:255',
            'cta_url'              => 'nullable|string|max:255',
            'secondary_cta_label'  => 'nullable|string|max:255',
            'secondary_cta_label_ja' => 'nullable|string|max:255',
            'secondary_cta_url'    => 'nullable|string|max:255',
            'cta_title'            => 'nullable|string|max:255',
            'cta_title_ja'         => 'nullable|string|max:255',
            'cta_description'      => 'nullable|string',
            'cta_description_ja'   => 'nullable|string',
            'hero_image'           => 'nullable|image|max:4096',
            'meta_title'           => 'nullable|string|max:255',
            'meta_title_ja'        => 'nullable|string|max:255',
            'meta_description'     => 'nullable|string|max:500',
            'meta_description_ja'  => 'nullable|string|max:500',
            'meta_keywords'        => 'nullable|string|max:500',
            'meta_keywords_ja'     => 'nullable|string|max:500',
            'og_image'             => 'nullable|image|max:4096',
        ], [
            'title.required' => 'The landing page title is required.',
            'slug.regex'     => 'Slug may only contain lowercase letters, numbers and hyphens.',
            'slug.unique'    => 'This slug is already used by another landing page.',
        ]);

        $decoded = [];
        foreach (ServiceLanding::JSON_KEYS as $key) {
            $val = $request->filled($key) ? json_decode($request->input($key), true) : null;
            $decoded[$key] = is_array($val) ? $val : [];
        }
        return $decoded;
    }

    private function buildPayload(Request $request, array $decoded, ?string $hero, ?string $og): array
    {
        $slug = Str::slug(trim($request->input('slug', '')) ?: $request->input('title', 'landing-' . time()));

        $plain = [
            'title', 'title_ja', 'card_description', 'card_description_ja',
            'eyebrow', 'eyebrow_ja', 'subtitle', 'subtitle_ja',
            'hero_description', 'hero_description_ja',
            'cta_label', 'cta_label_ja',
            'secondary_cta_label', 'secondary_cta_label_ja', 'secondary_cta_url',
            'intro', 'intro_ja',
            'cta_title', 'cta_title_ja', 'cta_description', 'cta_description_ja',
            'meta_title', 'meta_title_ja', 'meta_description', 'meta_description_ja',
            'meta_keywords', 'meta_keywords_ja',
        ];

        $payload = [
            'service_id'   => $request->filled('service_id') ? (int) $request->input('service_id') : null,
            'slug'         => $slug,
            'sort_order'   => (int) $request->input('sort_order', 0),
            'is_published' => $request->boolean('is_published', true),
            'cta_url'      => $request->input('cta_url') ?: '/contact',
            'hero_image'   => $hero,
            'og_image'     => $og,
        ];
        foreach ($plain as $f) {
            $payload[$f] = $request->input($f);
        }

        return array_merge($payload, $decoded);
    }

    public function store(Request $request)
    {
        $decoded = $this->validateAndDecode($request);

        DB::transaction(function () use ($request, $decoded) {
            $hero = $request->hasFile('hero_image')
                ? $request->file('hero_image')->store('service-landings', 'public') : null;
            $og = $request->hasFile('og_image')
                ? $request->file('og_image')->store('service-landings/og', 'public') : null;

            ServiceLanding::create($this->buildPayload($request, $decoded, $hero, $og));
        });

        return back()->with('success', 'Service landing page saved successfully.');
    }

    public function update(Request $request, ServiceLanding $serviceLanding)
    {
        $decoded = $this->validateAndDecode($request, $serviceLanding->id);

        DB::transaction(function () use ($request, $serviceLanding, $decoded) {
            $hero = $serviceLanding->hero_image;
            if ($request->hasFile('hero_image')) {
                if ($hero) Storage::disk('public')->delete($hero);
                $hero = $request->file('hero_image')->store('service-landings', 'public');
            }

            $og = $serviceLanding->og_image;
            if ($request->hasFile('og_image')) {
                if ($og) Storage::disk('public')->delete($og);
                $og = $request->file('og_image')->store('service-landings/og', 'public');
            }

            $serviceLanding->update($this->buildPayload($request, $decoded, $hero, $og));
        });

        return back()->with('success', 'Service landing page updated successfully.');
    }

    public function destroy(ServiceLanding $serviceLanding)
    {
        DB::transaction(function () use ($serviceLanding) {
            foreach (['hero_image', 'og_image'] as $img) {
                if ($serviceLanding->{$img}) Storage::disk('public')->delete($serviceLanding->{$img});
            }
            $serviceLanding->delete();
        });

        return back()->with('success', 'Service landing page deleted successfully.');
    }
}
