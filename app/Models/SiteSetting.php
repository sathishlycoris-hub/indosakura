<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        // ── Header ────────────────────────────────────────
        'logo_image',
        'nav1_en', 'nav1_ja', 'nav1_href',
        'nav2_en', 'nav2_ja', 'nav2_href',
        'nav3_en', 'nav3_ja', 'nav3_href',
        'nav4_en', 'nav4_ja', 'nav4_href',
        'nav5_en', 'nav5_ja', 'nav5_href',
        // newly added nav item for "India-Desk" section
        'nav6_en', 'nav6_ja', 'nav6_href',
        'contact_label_en', 'contact_label_ja',

        // ── Footer headings & bottom bar ──────────────────
        'footer_company_heading_en', 'footer_company_heading_ja',
        'footer_resources_heading_en', 'footer_resources_heading_ja',
        'footer_solutions_heading_en', 'footer_solutions_heading_ja',
        'footer_services_heading_en',  'footer_services_heading_ja',
        'footer_copyright_en', 'footer_copyright_ja',
        'footer_offices_en',   'footer_offices_ja',
        'footer_sitemap_en',   'footer_sitemap_ja',
        'footer_logo_image', 'footer_india_desks_heading_en', 'footer_india_desks_heading_ja',

        // ── Footer — Company links (5 items) ──────────────
        'fc1_en', 'fc1_ja', 'fc1_href',
        'fc2_en', 'fc2_ja', 'fc2_href',
        'fc3_en', 'fc3_ja', 'fc3_href',
        'fc4_en', 'fc4_ja', 'fc4_href',
        'fc5_en', 'fc5_ja', 'fc5_href',

        // ── Footer — Resources links (4 items) ────────────
        'fr1_en', 'fr1_ja', 'fr1_href',
        'fr2_en', 'fr2_ja', 'fr2_href',
        'fr3_en', 'fr3_ja', 'fr3_href',
        'fr4_en', 'fr4_ja', 'fr4_href',

        // ── Social media links ────────────────────────────
        'social_facebook',
        'social_x',
        'social_linkedin',
        'social_youtube',
        'social_instagram',

        // ── Floating actions ──────────────────────────────
        'float_phone',
        'float_email',
        'float_whatsapp',
        'float_whatsapp_message',

        // ── Contact page sidebar ──────────────────────────
        'contact_phone',
        'contact_email',
        'contact_address',
        'contact_address_ja',
        'contact_ind_phone',
        'contact_ind_phone_ja',
        'contact_ind_address',
        'contact_ind_address_ja',
        'contact_tagline_en',
        'contact_tagline_ja',
        'contact_heading_en',
        'contact_heading_ja',
        'contact_subtext_en',
        'contact_subtext_ja',

        // ── Contact CTA section (used on all pages) ───────
        'cta_title_en',       'cta_title_ja',
        'cta_description_en', 'cta_description_ja',
        'cta_button_en',      'cta_button_ja',
        'cta_button_href',

        // ── Insights navigation tabs (4 tabs) ─────────────
        'ins1_en', 'ins1_ja', 'ins1_href',
        'ins2_en', 'ins2_ja', 'ins2_href',
        'ins3_en', 'ins3_ja', 'ins3_href',
        'ins4_en', 'ins4_ja', 'ins4_href',

        // ── Sitemap page static sections ──────────────────
        'sitemap_company1_en', 'sitemap_company1_ja', 'sitemap_company1_href',
        'sitemap_company2_en', 'sitemap_company2_ja', 'sitemap_company2_href',
        'sitemap_company3_en', 'sitemap_company3_ja', 'sitemap_company3_href',
        'sitemap_company4_en', 'sitemap_company4_ja', 'sitemap_company4_href',
        'sitemap_company5_en', 'sitemap_company5_ja', 'sitemap_company5_href',

        'sitemap_resources1_en', 'sitemap_resources1_ja', 'sitemap_resources1_href',
        'sitemap_resources2_en', 'sitemap_resources2_ja', 'sitemap_resources2_href',
        'sitemap_resources3_en', 'sitemap_resources3_ja', 'sitemap_resources3_href',
        'sitemap_resources4_en', 'sitemap_resources4_ja', 'sitemap_resources4_href',
        'sitemap_resources5_en', 'sitemap_resources5_ja', 'sitemap_resources5_href',

        // ── Corporate sub-header (9 tabs) ─────────────────
        'corp1_en', 'corp1_ja', 'corp1_href',
        'corp2_en', 'corp2_ja', 'corp2_href',
        'corp3_en', 'corp3_ja', 'corp3_href',
        'corp4_en', 'corp4_ja', 'corp4_href',
        'corp5_en', 'corp5_ja', 'corp5_href',
        'corp6_en', 'corp6_ja', 'corp6_href',
        'corp7_en', 'corp7_ja', 'corp7_href',
        'corp8_en', 'corp8_ja', 'corp8_href',
        'corp9_en', 'corp9_ja', 'corp9_href',
    ];
}