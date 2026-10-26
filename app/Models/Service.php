<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'title_ja',
        'slug',
        'subtitle', 'subtitle_ja',
        'hero_description', 'hero_description_ja',
        'hero_image',
        'how_it_works', 'how_it_works_ja',
        'overview', 'overview_ja',
        'cta_label', 'cta_label_ja',
        'cta_url',
        'service_items',
        'why_choose',
        'approach_steps',
        'testimonials',
        'tech_stack',
        // SEO
        'meta_title',
        'meta_title_ja',
        'meta_description',
        'meta_description_ja',
        'meta_keywords',
        'meta_keywords_ja',
        'og_image',
    ];

    protected $casts = [
        'service_items'  => 'array',
        'why_choose'     => 'array',
        'approach_steps' => 'array',
        'testimonials'   => 'array',
        'tech_stack'     => 'array',
    ];

    public function highlights()
    {
        return $this->hasMany(ServiceHighlight::class)->orderBy('sort_order');
    }

    public function benefits()
    {
        return $this->hasMany(ServiceBenefit::class)->orderBy('sort_order');
    }

    public function pageFaqs()
    {
        return $this->hasMany(ServicePageFaq::class)->orderBy('sort_order');
    }

    public function pageIndustries()
    {
        return $this->hasMany(ServicePageIndustry::class)->orderBy('sort_order');
    }

    // ★ NEW — blogs attached to this service, most recently published first
    // (matches how the "Case Studies" card grid is ordered elsewhere).
    // Published-only: used by the PUBLIC Services/Show page.
    public function blogs()
    {
        return $this->hasMany(Blog::class)
            ->where('status', 'published')
            ->orderByDesc('published_date');
    }

    // ★ NEW — same relation but WITHOUT the published-only filter, so the
    // admin edit form's "Attached Blogs" checklist correctly shows drafts as
    // checked too. The public blogs() above intentionally stays filtered.
    public function adminBlogs()
    {
        return $this->hasMany(Blog::class)->orderByDesc('published_date');
    }

    // ★ NEW — Case Studies "featured" on this Service page, via the
    // service_solution_case_study pivot. These are existing SolutionCaseStudy
    // rows (owned by their actual Solution) simply linked here for display —
    // no duplication of case-study content.
    public function featuredCaseStudies()
    {
        return $this->belongsToMany(
            SolutionCaseStudy::class,
            'service_solution_case_study',
            'service_id',
            'solution_case_study_id'
        )->withPivot('sort_order')->orderBy('service_solution_case_study.sort_order');
    }

    /**
     * Resolve effective meta title for a given locale.
     */
    public function getEffectiveMetaTitle(string $lang = 'en'): string
    {
        $field = $lang === 'ja' ? 'meta_title_ja' : 'meta_title';
        return $this->{$field}
            ?? ($lang === 'ja' ? $this->title_ja : null)
            ?? $this->title
            ?? '';
    }

    /**
     * Resolve effective meta description for a given locale.
     */
    public function getEffectiveMetaDescription(string $lang = 'en'): string
    {
        $field = $lang === 'ja' ? 'meta_description_ja' : 'meta_description';
        return $this->{$field} ?? '';
    }

    public function items(): HasMany
{
    return $this->hasMany(ServiceItem::class)->orderBy('sort_order');
}

    /** Landing pages attached to this service (/services/landing/{slug}). */
    public function landings(): HasMany
    {
        return $this->hasMany(ServiceLanding::class)
            ->where('is_published', true)
            ->orderBy('sort_order');
    }
}