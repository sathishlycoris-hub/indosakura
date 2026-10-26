<?php
// app/Models/ServiceLanding.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceLanding extends Model
{
    use HasFactory;

    public const JSON_KEYS = [
        'trust_highlights', 'stats', 'sub_services', 'why_choose', 'industries',
        'tech_stack', 'process_steps', 'portfolio', 'engagement_models', 'faqs',
        'section_titles',
    ];

    protected $fillable = [
        'service_id', 'slug', 'sort_order', 'is_published',
        'title', 'title_ja', 'card_description', 'card_description_ja',
        'eyebrow', 'eyebrow_ja', 'subtitle', 'subtitle_ja',
        'hero_description', 'hero_description_ja', 'hero_image',
        'cta_label', 'cta_label_ja', 'cta_url',
        'secondary_cta_label', 'secondary_cta_label_ja', 'secondary_cta_url',
        'intro', 'intro_ja',
        'trust_highlights', 'stats', 'sub_services', 'why_choose', 'industries',
        'tech_stack', 'process_steps', 'portfolio', 'engagement_models', 'faqs',
        'section_titles',
        'cta_title', 'cta_title_ja', 'cta_description', 'cta_description_ja',
        'meta_title', 'meta_title_ja', 'meta_description', 'meta_description_ja',
        'meta_keywords', 'meta_keywords_ja', 'og_image',
    ];

    protected $casts = [
        'is_published'      => 'boolean',
        'trust_highlights'  => 'array',
        'stats'             => 'array',
        'sub_services'      => 'array',
        'why_choose'        => 'array',
        'industries'        => 'array',
        'tech_stack'        => 'array',
        'process_steps'     => 'array',
        'portfolio'         => 'array',
        'engagement_models' => 'array',
        'faqs'              => 'array',
        'section_titles'    => 'array',
    ];

    protected $appends = ['public_url'];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /** The URL admins paste anywhere (menus, ads, other pages). */
    public function getPublicUrlAttribute(): string
    {
        return '/services/landing/' . $this->slug;
    }

    public function getEffectiveMetaTitle(string $lang = 'en'): string
    {
        $field = $lang === 'ja' ? 'meta_title_ja' : 'meta_title';
        return $this->{$field}
            ?? ($lang === 'ja' ? $this->title_ja : null)
            ?? $this->title
            ?? '';
    }

    public function getEffectiveMetaDescription(string $lang = 'en'): string
    {
        $field = $lang === 'ja' ? 'meta_description_ja' : 'meta_description';
        return $this->{$field} ?? '';
    }
}
