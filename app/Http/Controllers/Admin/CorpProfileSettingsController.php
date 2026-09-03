<?php

// ── Admin/CorpProfileSettingsController.php (updated with value_ja fields) ──

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CorpProfileSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CorpProfileSettingsController extends Controller
{
    private function getSettings(): CorpProfileSetting
    {
        return CorpProfileSetting::firstOrCreate([], [
            // Our Strengths text
            'strengths_heading'    => 'Combining Expertise for Innovation',
            'strengths_heading_ja' => '専門知識を融合し、革新を実現',
            'strengths_para1'      => 'Our engineers specialize in innovative IT solutions, ensuring high-quality performance and optimal results with nearly 20 years of experience. We deliver tailored, effective solutions that drive growth and success for businesses worldwide.',
            'strengths_para1_ja'   => '当社のエンジニアは革新的なITソリューションを専門とし、約20年の経験を活かして高品質で最適な成果を提供します。世界中の企業の成長と成功を支える、最適化されたソリューションをお届けします。',
            'strengths_para2'      => 'We embrace cutting-edge technologies like GenAI, machine learning, and cloud services, ensuring your business stays ahead in innovation while maintaining our bilingual capabilities for seamless Japan-India collaboration.',
            'strengths_para2_ja'   => 'GenAI、機械学習、クラウドサービスなどの最先端技術を活用し、日本とインドをつなぐバイリンガル体制で、企業の革新を支援します。',
            'strengths_cta'        => 'Ready to innovate and drive an impact?',
            'strengths_cta_ja'     => '革新への第一歩を踏み出しましょう',

            // Stat boxes (value now has _ja variant)
            'str_stat1_value' => '19+',    'str_stat1_value_ja' => '19+',      'str_stat1_label' => 'Years Experience', 'str_stat1_label_ja' => '年の実績',       'str_stat1_sub' => 'Japanese Companies',        'str_stat1_sub_ja' => '日本企業向け',
            'str_stat2_value' => '150+',   'str_stat2_value_ja' => '150+',     'str_stat2_label' => 'IT Engineers',     'str_stat2_label_ja' => 'ITエンジニア',   'str_stat2_sub' => 'High Performing',           'str_stat2_sub_ja' => '高い技術力',
            'str_stat3_value' => '2',      'str_stat3_value_ja' => '2',        'str_stat3_label' => 'Languages',        'str_stat3_label_ja' => '言語対応',       'str_stat3_sub' => 'Japanese & English',        'str_stat3_sub_ja' => '日本語・英語',
            'str_stat4_value' => 'Hybrid', 'str_stat4_value_ja' => 'ハイブリッド', 'str_stat4_label' => 'Development',  'str_stat4_label_ja' => '開発モデル',     'str_stat4_sub' => 'Flexible & Cost-Effective', 'str_stat4_sub_ja' => '柔軟かつ高品質',

            // Feature cards
            'str_feat1_title' => 'Proven Excellence',  'str_feat1_title_ja' => '確かな実績',         'str_feat1_sub' => 'High-quality performance',   'str_feat1_sub_ja' => '高品質なパフォーマンス',  'str_feat1_desc' => 'Our engineers deliver innovative IT solutions ensuring top performance.',  'str_feat1_desc_ja' => '革新的なITソリューションを提供し、企業の成功を支えます。',
            'str_feat2_title' => 'Bilingual Team',     'str_feat2_title_ja' => 'バイリンガルチーム', 'str_feat2_sub' => 'Seamless communication',     'str_feat2_sub_ja' => '円滑なコミュニケーション', 'str_feat2_desc' => 'Bridging language barriers for effective collaboration.',               'str_feat2_desc_ja' => '日本語と英語に対応し、円滑な連携を実現します。',
            'str_feat3_title' => 'Cutting-Edge Tech',  'str_feat3_title_ja' => '最先端技術',         'str_feat3_sub' => 'GenAI & Cloud',              'str_feat3_sub_ja' => 'GenAI & クラウド',         'str_feat3_desc' => 'Leveraging GenAI and cloud services for innovation.',                   'str_feat3_desc_ja' => '最新技術で企業の成長を加速します。',
            'str_feat4_title' => 'Hybrid Model',       'str_feat4_title_ja' => 'ハイブリッドモデル', 'str_feat4_sub' => 'On-site & Offshore',        'str_feat4_sub_ja' => '柔軟な開発体制',           'str_feat4_desc' => 'Flexible and scalable development model.',                              'str_feat4_desc_ja' => '柔軟でコスト効率の高い開発体制を提供します。',

            // Locations
            'loc1_name' => 'Tokyo Headquarters',       'loc1_name_ja' => '東京本社',             'loc1_address' => '5-30-13 Toyo, Edogawa-ku, Tokyo',             'loc1_address_ja' => '東京都江戸川区東陽5-30-13',
            'loc2_name' => 'Osaka Sales Office',       'loc2_name_ja' => '大阪営業所',           'loc2_address' => '1-3-12 Umeda, Kita-ku, Osaka',                'loc2_address_ja' => '大阪市北区梅田1丁目3番12号',
            'loc3_name' => 'India Development Center', 'loc3_name_ja' => 'インド開発センター',   'loc3_address' => 'Bangalore, India',                            'loc3_address_ja' => 'バンガロール、インド',
            'loc4_name' => 'U.S. Sales Office',        'loc4_name_ja' => '米国営業所',           'loc4_address' => 'Albany, NY, USA',                             'loc4_address_ja' => '米国・NY州ALBANY市',
            'loc5_name' => 'Dubai Sales Office',       'loc5_name_ja' => 'ドバイ営業所',         'loc5_address' => '#3051 Single Biz Tower, Business Bay, Dubai', 'loc5_address_ja' => '#3051 Single Biz Tower Biz Bay, Dubai',
        ]);
    }

    public function index() 
    {
        return Inertia::render('Admin/CorpProfile/Index', [
            'settings' => $this->getSettings(),
        ]);
    }

    public function update(Request $request)
    {
        $settings = $this->getSettings();

        $data = $request->validate([
            'strengths_heading'    => 'nullable|string',
            'strengths_heading_ja' => 'nullable|string',
            'strengths_para1'      => 'nullable|string',
            'strengths_para1_ja'   => 'nullable|string',
            'strengths_para2'      => 'nullable|string',
            'strengths_para2_ja'   => 'nullable|string',
            'strengths_cta'        => 'nullable|string',
            'strengths_cta_ja'     => 'nullable|string',

            'str_stat1_value' => 'nullable|string', 'str_stat1_value_ja' => 'nullable|string', 'str_stat1_label' => 'nullable|string', 'str_stat1_label_ja' => 'nullable|string', 'str_stat1_sub' => 'nullable|string', 'str_stat1_sub_ja' => 'nullable|string',
            'str_stat2_value' => 'nullable|string', 'str_stat2_value_ja' => 'nullable|string', 'str_stat2_label' => 'nullable|string', 'str_stat2_label_ja' => 'nullable|string', 'str_stat2_sub' => 'nullable|string', 'str_stat2_sub_ja' => 'nullable|string',
            'str_stat3_value' => 'nullable|string', 'str_stat3_value_ja' => 'nullable|string', 'str_stat3_label' => 'nullable|string', 'str_stat3_label_ja' => 'nullable|string', 'str_stat3_sub' => 'nullable|string', 'str_stat3_sub_ja' => 'nullable|string',
            'str_stat4_value' => 'nullable|string', 'str_stat4_value_ja' => 'nullable|string', 'str_stat4_label' => 'nullable|string', 'str_stat4_label_ja' => 'nullable|string', 'str_stat4_sub' => 'nullable|string', 'str_stat4_sub_ja' => 'nullable|string',

            'str_feat1_title' => 'nullable|string', 'str_feat1_title_ja' => 'nullable|string', 'str_feat1_sub' => 'nullable|string', 'str_feat1_sub_ja' => 'nullable|string', 'str_feat1_desc' => 'nullable|string', 'str_feat1_desc_ja' => 'nullable|string',
            'str_feat2_title' => 'nullable|string', 'str_feat2_title_ja' => 'nullable|string', 'str_feat2_sub' => 'nullable|string', 'str_feat2_sub_ja' => 'nullable|string', 'str_feat2_desc' => 'nullable|string', 'str_feat2_desc_ja' => 'nullable|string',
            'str_feat3_title' => 'nullable|string', 'str_feat3_title_ja' => 'nullable|string', 'str_feat3_sub' => 'nullable|string', 'str_feat3_sub_ja' => 'nullable|string', 'str_feat3_desc' => 'nullable|string', 'str_feat3_desc_ja' => 'nullable|string',
            'str_feat4_title' => 'nullable|string', 'str_feat4_title_ja' => 'nullable|string', 'str_feat4_sub' => 'nullable|string', 'str_feat4_sub_ja' => 'nullable|string', 'str_feat4_desc' => 'nullable|string', 'str_feat4_desc_ja' => 'nullable|string',

            'loc1_name' => 'nullable|string', 'loc1_name_ja' => 'nullable|string', 'loc1_address' => 'nullable|string', 'loc1_address_ja' => 'nullable|string',
            'loc2_name' => 'nullable|string', 'loc2_name_ja' => 'nullable|string', 'loc2_address' => 'nullable|string', 'loc2_address_ja' => 'nullable|string',
            'loc3_name' => 'nullable|string', 'loc3_name_ja' => 'nullable|string', 'loc3_address' => 'nullable|string', 'loc3_address_ja' => 'nullable|string',
            'loc4_name' => 'nullable|string', 'loc4_name_ja' => 'nullable|string', 'loc4_address' => 'nullable|string', 'loc4_address_ja' => 'nullable|string',
            'loc5_name' => 'nullable|string', 'loc5_name_ja' => 'nullable|string', 'loc5_address' => 'nullable|string', 'loc5_address_ja' => 'nullable|string',
        ]);

        $settings->update($data);

        return back()->with('success', 'Corporate profile settings saved successfully');
    }
}