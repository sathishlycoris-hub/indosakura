<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SiteSettingsController extends Controller
{
    private function getSettings(): SiteSetting
    {
        return SiteSetting::firstOrCreate([], [
            // Header
            'logo_image' => null,
            'nav1_en' => 'Products',
            'nav1_ja' => 'ソリューション',
            'nav1_href' => '/solutions',
            'nav2_en' => 'Services',
            'nav2_ja' => 'サービス',
            'nav2_href' => '/services',
            'nav3_en' => 'Insights',
            'nav3_ja' => '導入事例',
            'nav3_href' => '/blogs',
            'nav4_en' => 'Corporate Info',
            'nav4_ja' => '企業情報',
            'nav4_href' => '/corporate-info',
            'nav5_en' => 'Careers',
            'nav5_ja' => '採用情報',
            'nav5_href' => '/recruitment',
            'nav6_en' => 'India Desks',
            'nav6_ja' => 'インドデスク',
            'nav6_href' => '/india-desks',
            'contact_label_en' => 'Contact us',
            'contact_label_ja' => 'お問い合わせ',

            // Footer headings
            'footer_company_heading_en'   => 'Company',
            'footer_company_heading_ja'   => '会社情報',
            'footer_resources_heading_en' => 'Resources',
            'footer_resources_heading_ja' => 'リソース',
            'footer_solutions_heading_en' => 'Solutions',
            'footer_solutions_heading_ja' => 'ソリューション',
            'footer_services_heading_en'  => 'Services',
            'footer_services_heading_ja'  => 'サービス',
            'footer_copyright_en' => '© 2026 Indo-Sakura. All rights reserved.',
            'footer_copyright_ja' => '© 2026 インドサクラ株式会社。無断転載を禁じます。',
            'footer_offices_en'   => 'Offices in Japan, India & USA',
            'footer_offices_ja'   => '日本・インド・アメリカに拠点',
            'footer_sitemap_en'   => 'Sitemap',
            'footer_sitemap_ja' => 'サイトマップ',
            'footer_logo_image'   => null,

            'footer_india_desks_heading_en' => 'India Desks',
            'footer_india_desks_heading_ja' => 'インドデスク',

            // Footer company links
            'fc1_en' => 'About Us',
            'fc1_ja' => '会社概要',
            'fc1_href' => '/corporate/greetings',
            'fc2_en' => 'Corporate Info',
            'fc2_ja' => '企業情報',
            'fc2_href' => '/corporate-info',
            'fc3_en' => 'Insights',
            'fc3_ja' => '導入事例',
            'fc3_href' => '/blogs',
            'fc4_en' => 'Careers',
            'fc4_ja' => '採用情報',
            'fc4_href' => '/recruitment',
            'fc5_en' => 'Contact',
            'fc5_ja' => 'お問い合わせ',
            'fc5_href' => '/contact',

            // Footer resources links
            'fr1_en' => 'Blog',
            'fr1_ja' => 'ブログ',
            'fr1_href' => '/blogs',
            'fr2_en' => 'Support',
            'fr2_ja' => 'サポート',
            'fr2_href' => '/contact',
            'fr3_en' => 'Privacy Policy',
            'fr3_ja' => 'プライバシーポリシー',
            'fr3_href' => '/corporate/policy',
            'fr4_en' => 'Terms of Service',
            'fr4_ja' => '利用規約',
            'fr4_href' => '/usage',

            // Social
            'social_facebook'  => 'https://www.facebook.com/indosakurasoftwarejapan',
            'social_x'         => 'https://x.com/IndoSakuraJapan',
            'social_linkedin'  => 'https://www.linkedin.com/company/indo-sakura-software-japan',
            'social_youtube'   => 'https://www.youtube.com/@IndoSakura',
            'social_instagram' => 'https://www.instagram.com/indosakurasoftware/',

            // Floating
            'float_phone'            => '+819044078453',
            'float_email'            => 'info@indosakura.com',
            'float_whatsapp'         => '919629129539',
            'float_whatsapp_message' => 'Hello!',

            // Contact page
            'contact_phone'      => '03-5633-7776',
            'contact_email'      => 'info.japan@indosakura.com',
            'contact_address'    => '5-30-13 Toyo, Edogawa-ku, Tokyo',
            'contact_address_ja' => '東京都江戸川区東陽5-30-13',
            'contact_ind_phone'      => '',
            'contact_ind_phone_ja'   => '',
            'contact_ind_address'    => '',
            'contact_ind_address_ja' => '',
            'contact_tagline_en' => 'Trusted Indo-Sakura Partner',
            'contact_tagline_ja' => '信頼のインドサクラパートナー',
            'contact_heading_en' => "Let's build something together.",
            'contact_heading_ja' => "一緒に何かを作りましょう。",
            'contact_subtext_en' => 'Reach Out and Connect with Indo Sakura for innovative technology solutions.',
            'contact_subtext_ja' => '革新的なテクノロジーソリューションのために、インドサクラにお問い合わせください。',

            // Contact CTA section
            'cta_title_en'       => 'Contact Form',
            'cta_title_ja'       => 'お問い合わせフォーム',
            'cta_description_en' => 'Have questions about our solutions or need a quote? Get in touch with our team today.',
            'cta_description_ja' => 'ソリューションについてのご質問やお見積りのご依頼は、お気軽にお問い合わせください。',
            'cta_button_en'      => 'Contact Us',
            'cta_button_ja'      => 'お問い合わせ',
            'cta_button_href'    => '/contact',

            // Insights nav
            'ins1_en' => 'Blogs',
            'ins1_ja' => 'ブログ',
            'ins1_href' => '/blogs',
            'ins2_en' => 'Case Studies',
            'ins2_ja' => '事例紹介',
            'ins2_href' => '/blogs/casestudies',
            'ins3_en' => 'Infographics',
            'ins3_ja' => 'インフォグラフィックス',
            'ins3_href' => '/blogs/infographics',
            'ins4_en' => 'Seminar (Events)',
            'ins4_ja' => 'セミナー',
            'ins4_href' => '/blogs/seminars-index',

            // Sitemap company links
            'sitemap_company1_en' => 'Greetings',
            'sitemap_company1_ja' => 'ご挨拶',
            'sitemap_company1_href' => '/corporate/greetings',
            'sitemap_company2_en' => 'Corporate Info',
            'sitemap_company2_ja' => '企業情報',
            'sitemap_company2_href' => '/corporate-info',
            'sitemap_company3_en' => 'Case Studies',
            'sitemap_company3_ja' => '導入事例',
            'sitemap_company3_href' => '/blogs/casestudies',
            'sitemap_company4_en' => 'Careers',
            'sitemap_company4_ja' => '採用情報',
            'sitemap_company4_href' => '/recruitment',
            'sitemap_company5_en' => 'Contact',
            'sitemap_company5_ja' => 'お問い合わせ',
            'sitemap_company5_href' => '/contact',

            // Sitemap resources links
            'sitemap_resources1_en' => 'Blog',
            'sitemap_resources1_ja' => 'ブログ',
            'sitemap_resources1_href' => '/blogs',
            'sitemap_resources2_en' => 'Support',
            'sitemap_resources2_ja' => 'サポート',
            'sitemap_resources2_href' => '/contact',
            'sitemap_resources3_en' => 'Privacy Policy',
            'sitemap_resources3_ja' => 'プライバシーポリシー',
            'sitemap_resources3_href' => '/corporate/policy',
            'sitemap_resources4_en' => 'Terms of Service',
            'sitemap_resources4_ja' => '利用規約',
            'sitemap_resources4_href' => '/usage',
            'sitemap_resources5_en' => 'Sitemap',
            'sitemap_resources5_ja' => 'サイトマップ',
            'sitemap_resources5_href' => '/sitemap',

            // Corporate sub-nav
            'corp1_en' => 'Corporate Info TOP',
            'corp1_ja' => '企業情報トップ',
            'corp1_href' => '/corporate-info',
            'corp2_en' => 'Greetings',
            'corp2_ja' => 'ご挨拶',
            'corp2_href' => '/corporate/greetings',
            'corp3_en' => 'Corporate Philosophy',
            'corp3_ja' => '企業理念',
            'corp3_href' => '/corporate/philosophy',
            'corp4_en' => 'Profile',
            'corp4_ja' => '会社概要',
            'corp4_href' => '/corporate/profile',
            'corp5_en' => 'History',
            'corp5_ja' => '沿革',
            'corp5_href' => '/corporate/history',
            'corp6_en' => 'Team',
            'corp6_ja' => 'チーム',
            'corp6_href' => '/corporate/team',
            'corp7_en' => 'Press Release',
            'corp7_ja' => 'プレスリリース',
            'corp7_href' => '/corporate/press-release',
            'corp8_en' => 'Clients',
            'corp8_ja' => '取引先・ビジネスパートナー',
            'corp8_href' => '/corporate/clients',
            'corp9_en' => 'Policy Statements',
            'corp9_ja' => 'ポリシー',
            'corp9_href' => '/corporate/policy',
        ]);
    }

    public function index()
    {
        return Inertia::render('Admin/SiteSettings/Index', [
            'settings' => $this->getSettings(),
        ]);
    }

    public function update(Request $request)
    {
        $settings = $this->getSettings();

        $data = $request->validate([
            'logo_image' => 'nullable|image|max:4096',

            'nav1_en' => 'nullable|string',
            'nav1_ja' => 'nullable|string',
            'nav1_href' => 'nullable|string',
            'nav2_en' => 'nullable|string',
            'nav2_ja' => 'nullable|string',
            'nav2_href' => 'nullable|string',
            'nav3_en' => 'nullable|string',
            'nav3_ja' => 'nullable|string',
            'nav3_href' => 'nullable|string',
            'nav4_en' => 'nullable|string',
            'nav4_ja' => 'nullable|string',
            'nav4_href' => 'nullable|string',
            'nav5_en' => 'nullable|string',
            'nav5_ja' => 'nullable|string',
            'nav5_href' => 'nullable|string',
            'nav6_en' => 'nullable|string',
            'nav6_ja' => 'nullable|string',
            'nav6_href' => 'nullable|string',
            'contact_label_en' => 'nullable|string',
            'contact_label_ja' => 'nullable|string',

            'footer_company_heading_en'   => 'nullable|string',
            'footer_company_heading_ja'   => 'nullable|string',
            'footer_resources_heading_en' => 'nullable|string',
            'footer_resources_heading_ja' => 'nullable|string',
            'footer_solutions_heading_en' => 'nullable|string',
            'footer_solutions_heading_ja' => 'nullable|string',
            'footer_services_heading_en'  => 'nullable|string',
            'footer_services_heading_ja'  => 'nullable|string',
            'footer_copyright_en' => 'nullable|string',
            'footer_copyright_ja' => 'nullable|string',
            'footer_offices_en'   => 'nullable|string',
            'footer_offices_ja'   => 'nullable|string',
            'footer_sitemap_en'   => 'nullable|string',
            'footer_sitemap_ja'   => 'nullable|string',
            'footer_logo_image'   => 'nullable|image|max:4096',

            'fc1_en' => 'nullable|string',
            'fc1_ja' => 'nullable|string',
            'fc1_href' => 'nullable|string',
            'fc2_en' => 'nullable|string',
            'fc2_ja' => 'nullable|string',
            'fc2_href' => 'nullable|string',
            'fc3_en' => 'nullable|string',
            'fc3_ja' => 'nullable|string',
            'fc3_href' => 'nullable|string',
            'fc4_en' => 'nullable|string',
            'fc4_ja' => 'nullable|string',
            'fc4_href' => 'nullable|string',
            'fc5_en' => 'nullable|string',
            'fc5_ja' => 'nullable|string',
            'fc5_href' => 'nullable|string',

            'fr1_en' => 'nullable|string',
            'fr1_ja' => 'nullable|string',
            'fr1_href' => 'nullable|string',
            'fr2_en' => 'nullable|string',
            'fr2_ja' => 'nullable|string',
            'fr2_href' => 'nullable|string',
            'fr3_en' => 'nullable|string',
            'fr3_ja' => 'nullable|string',
            'fr3_href' => 'nullable|string',
            'fr4_en' => 'nullable|string',
            'fr4_ja' => 'nullable|string',
            'fr4_href' => 'nullable|string',

            'social_facebook'  => 'nullable|string',
            'social_x'         => 'nullable|string',
            'social_linkedin'  => 'nullable|string',
            'social_youtube'   => 'nullable|string',
            'social_instagram' => 'nullable|string',

            'float_phone' => 'nullable|string',
            'float_email' => 'nullable|email',
            'float_whatsapp' => 'nullable|string',
            'float_whatsapp_message' => 'nullable|string',

            'contact_phone'      => 'nullable|string',
            'contact_email'      => 'nullable|email',
            'contact_address'    => 'nullable|string',
            'contact_address_ja' => 'nullable|string',
            'contact_ind_phone'      => 'nullable|string',
            'contact_ind_phone_ja'   => 'nullable|string',
            'contact_ind_address'    => 'nullable|string',
            'contact_ind_address_ja' => 'nullable|string',
            'contact_tagline_en' => 'nullable|string',
            'contact_tagline_ja' => 'nullable|string',
            'contact_heading_en' => 'nullable|string',
            'contact_heading_ja' => 'nullable|string',
            'contact_subtext_en' => 'nullable|string',
            'contact_subtext_ja' => 'nullable|string',

            'cta_title_en'       => 'nullable|string',
            'cta_title_ja'       => 'nullable|string',
            'cta_description_en' => 'nullable|string',
            'cta_description_ja' => 'nullable|string',
            'cta_button_en'      => 'nullable|string',
            'cta_button_ja'      => 'nullable|string',
            'cta_button_href'    => 'nullable|string',

            'ins1_en' => 'nullable|string',
            'ins1_ja' => 'nullable|string',
            'ins1_href' => 'nullable|string',
            'ins2_en' => 'nullable|string',
            'ins2_ja' => 'nullable|string',
            'ins2_href' => 'nullable|string',
            'ins3_en' => 'nullable|string',
            'ins3_ja' => 'nullable|string',
            'ins3_href' => 'nullable|string',
            'ins4_en' => 'nullable|string',
            'ins4_ja' => 'nullable|string',
            'ins4_href' => 'nullable|string',

            'footer_india_desks_heading_en' => 'nullable|string',
            'footer_india_desks_heading_ja' => 'nullable|string',

            'sitemap_company1_en' => 'nullable|string',
            'sitemap_company1_ja' => 'nullable|string',
            'sitemap_company1_href' => 'nullable|string',
            'sitemap_company2_en' => 'nullable|string',
            'sitemap_company2_ja' => 'nullable|string',
            'sitemap_company2_href' => 'nullable|string',
            'sitemap_company3_en' => 'nullable|string',
            'sitemap_company3_ja' => 'nullable|string',
            'sitemap_company3_href' => 'nullable|string',
            'sitemap_company4_en' => 'nullable|string',
            'sitemap_company4_ja' => 'nullable|string',
            'sitemap_company4_href' => 'nullable|string',
            'sitemap_company5_en' => 'nullable|string',
            'sitemap_company5_ja' => 'nullable|string',
            'sitemap_company5_href' => 'nullable|string',

            'sitemap_resources1_en' => 'nullable|string',
            'sitemap_resources1_ja' => 'nullable|string',
            'sitemap_resources1_href' => 'nullable|string',
            'sitemap_resources2_en' => 'nullable|string',
            'sitemap_resources2_ja' => 'nullable|string',
            'sitemap_resources2_href' => 'nullable|string',
            'sitemap_resources3_en' => 'nullable|string',
            'sitemap_resources3_ja' => 'nullable|string',
            'sitemap_resources3_href' => 'nullable|string',
            'sitemap_resources4_en' => 'nullable|string',
            'sitemap_resources4_ja' => 'nullable|string',
            'sitemap_resources4_href' => 'nullable|string',
            'sitemap_resources5_en' => 'nullable|string',
            'sitemap_resources5_ja' => 'nullable|string',
            'sitemap_resources5_href' => 'nullable|string',

            'corp1_en' => 'nullable|string',
            'corp1_ja' => 'nullable|string',
            'corp1_href' => 'nullable|string',
            'corp2_en' => 'nullable|string',
            'corp2_ja' => 'nullable|string',
            'corp2_href' => 'nullable|string',
            'corp3_en' => 'nullable|string',
            'corp3_ja' => 'nullable|string',
            'corp3_href' => 'nullable|string',
            'corp4_en' => 'nullable|string',
            'corp4_ja' => 'nullable|string',
            'corp4_href' => 'nullable|string',
            'corp5_en' => 'nullable|string',
            'corp5_ja' => 'nullable|string',
            'corp5_href' => 'nullable|string',
            'corp6_en' => 'nullable|string',
            'corp6_ja' => 'nullable|string',
            'corp6_href' => 'nullable|string',
            'corp7_en' => 'nullable|string',
            'corp7_ja' => 'nullable|string',
            'corp7_href' => 'nullable|string',
            'corp8_en' => 'nullable|string',
            'corp8_ja' => 'nullable|string',
            'corp8_href' => 'nullable|string',
            'corp9_en' => 'nullable|string',
            'corp9_ja' => 'nullable|string',
            'corp9_href' => 'nullable|string',
        ]);

        if ($request->hasFile('logo_image')) {
            if ($settings->logo_image) Storage::disk('public')->delete($settings->logo_image);
            $data['logo_image'] = $request->file('logo_image')->store('site', 'public');
        } else {
            unset($data['logo_image']);
        }

        if ($request->hasFile('footer_logo_image')) {
            if ($settings->footer_logo_image) Storage::disk('public')->delete($settings->footer_logo_image);
            $data['footer_logo_image'] = $request->file('footer_logo_image')->store('site', 'public');
        } else {
            unset($data['footer_logo_image']);
        }

        $settings->update($data);

        return back()->with('success', 'Site settings saved successfully');
    }
}