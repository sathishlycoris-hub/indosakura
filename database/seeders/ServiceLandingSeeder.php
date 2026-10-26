<?php
// php artisan db:seed --class=ServiceLandingSeeder
// Seeds the "Mobile App Development Company in Tokyo" landing page as a sample record.
// Content is draft copy — verify claims/technologies before publishing.

namespace Database\Seeders;

use App\Models\ServiceLanding;
use Illuminate\Database\Seeder;

class ServiceLandingSeeder extends Seeder
{
    public function run(): void
    {
        $ld = fn (string $t, string $d) => ['title' => $t, 'title_ja' => '', 'description' => $d, 'description_ja' => ''];

        ServiceLanding::updateOrCreate(
            ['slug' => 'mobile-app-development-company-tokyo'],
            [
                'is_published' => true,
                'title' => 'Mobile App Development Company in Tokyo, Japan',
                'card_description' => 'Custom iOS, Android, cross-platform and enterprise mobile apps from a Tokyo-based team.',
                'eyebrow' => 'CUSTOM MOBILE APPLICATION DEVELOPMENT | TOKYO, JAPAN',
                'subtitle' => 'Build Scalable, Secure & High-Performance Mobile Applications',
                'hero_description' => '<p>Transform your business ideas into powerful mobile experiences with Indo-Sakura Software Japan. We deliver custom iOS, Android, cross-platform and enterprise mobile application development tailored to your business objectives.</p><p>Combining Japanese project coordination with India-based engineering capabilities, we help businesses build user-friendly, scalable and future-ready mobile applications.</p>',
                'cta_label' => 'Get a Free Consultation',
                'cta_url' => '/contact',
                'secondary_cta_label' => 'Explore Our Work',
                'secondary_cta_url' => '#portfolio',
                'trust_highlights' => [
                    ['title' => 'Tokyo-Based Company', 'title_ja' => ''],
                    ['title' => '20+ Years of Experience', 'title_ja' => ''],
                    ['title' => 'Japan–India Delivery', 'title_ja' => ''],
                ],
                'intro' => '<p>Indo-Sakura Software Japan K.K. is a Tokyo-headquartered IT services and software development company supporting businesses with digital transformation, enterprise applications and custom software.</p><p>From early-stage concepts to complex enterprise mobility solutions, our approach focuses on usability, security, maintainability and measurable business value.</p>',
                'stats' => [
                    ['value' => '20+', 'label' => 'Years of Experience', 'label_ja' => ''],
                    ['value' => '55+', 'label' => 'Global Customers', 'label_ja' => ''],
                    ['value' => '155+', 'label' => 'IT Professionals', 'label_ja' => ''],
                ],
                'sub_services' => [
                    $ld('iOS App Development', '<p>Custom iPhone and iPad applications built for performance and seamless Apple ecosystem integration.</p>'),
                    $ld('Android App Development', '<p>Feature-rich Android applications for customer engagement and operational efficiency.</p>'),
                    $ld('Cross-Platform App Development', '<p>iOS and Android apps from shared code using Flutter or React Native where appropriate.</p>'),
                    $ld('Enterprise Mobile App Development', '<p>Secure business apps integrating enterprise APIs, ERP, CRM, authentication and workflows.</p>'),
                    $ld('Mobile UI/UX Design', '<p>User research, wireframing, prototypes and accessible interfaces.</p>'),
                    $ld('AI-Powered Mobile Applications', '<p>Conversational AI, intelligent search, OCR and workflow automation where beneficial.</p>'),
                    $ld('Mobile App Modernization', '<p>Upgrade legacy apps, improve performance and modernize integrations.</p>'),
                    $ld('App Maintenance & Support', '<p>Monitoring, issue resolution, compatibility updates and feature enhancements.</p>'),
                ],
                'why_choose' => [
                    $ld('Tokyo-based company', 'Local business coordination and knowledge of Japanese business expectations.'),
                    $ld('Japan–India engineering model', 'Access to broader development capabilities with coordinated delivery.'),
                    $ld('20+ years in IT services', 'Established software engineering and enterprise delivery experience.'),
                    $ld('Custom development approach', 'Applications tailored to workflows, users and integration needs.'),
                    $ld('AI and enterprise expertise', 'Intelligent functionality and backend integrations.'),
                    $ld('Long-term delivery focus', 'Architecture designed for maintenance and future enhancements.'),
                ],
                'industries' => [
                    $ld('Healthcare', 'Appointment booking, patient engagement and care coordination.'),
                    $ld('Retail & E-commerce', 'Mobile commerce, loyalty platforms and order tracking.'),
                    $ld('Manufacturing', 'Field operations, inventory and production reporting.'),
                    $ld('Banking & Fintech', 'Secure financial workflows and mobile customer services.'),
                    $ld('Logistics', 'Fleet monitoring, delivery tracking and workforce mobility.'),
                    $ld('Real Estate', 'Property discovery, booking enquiries and CRM integration.'),
                ],
                'tech_stack' => [
                    ['category' => 'Native iOS', 'category_ja' => '', 'items' => 'Swift, SwiftUI'],
                    ['category' => 'Native Android', 'category_ja' => '', 'items' => 'Kotlin, Jetpack Compose'],
                    ['category' => 'Cross-platform', 'category_ja' => '', 'items' => 'Flutter, React Native'],
                    ['category' => 'Backend', 'category_ja' => '', 'items' => 'Node.js, Python, Java'],
                    ['category' => 'Databases', 'category_ja' => '', 'items' => 'PostgreSQL, MongoDB'],
                    ['category' => 'Cloud', 'category_ja' => '', 'items' => 'AWS, Azure, Google Cloud'],
                    ['category' => 'UI/UX design', 'category_ja' => '', 'items' => 'Figma'],
                    ['category' => 'Integrations', 'category_ja' => '', 'items' => 'REST APIs, GraphQL, Firebase'],
                ],
                'process_steps' => [
                    ['step_number' => 1, 'title' => 'Discovery & Requirement Analysis', 'title_ja' => '', 'description' => '<p>Understand business goals, target users, key features and technical constraints.</p>', 'description_ja' => ''],
                    ['step_number' => 2, 'title' => 'UI/UX Design & Prototyping', 'title_ja' => '', 'description' => '<p>Wireframes, user flows and interactive prototypes.</p>', 'description_ja' => ''],
                    ['step_number' => 3, 'title' => 'Mobile App Development', 'title_ja' => '', 'description' => '<p>Frontend, backend integrations, APIs and essential security controls.</p>', 'description_ja' => ''],
                    ['step_number' => 4, 'title' => 'Testing & Quality Assurance', 'title_ja' => '', 'description' => '<p>Usability, device compatibility, performance, functionality and security.</p>', 'description_ja' => ''],
                    ['step_number' => 5, 'title' => 'Deployment & Ongoing Support', 'title_ja' => '', 'description' => '<p>App Store and Google Play release support, monitoring and future improvements.</p>', 'description_ja' => ''],
                ],
                'portfolio' => [
                    ['title' => 'Ride Booking Application', 'title_ja' => '', 'description' => 'Ride reservations, real-time driver tracking, fare estimates and secure payments.', 'description_ja' => '', 'capabilities' => 'Location integration, Multi-role app, Booking workflows', 'capabilities_ja' => ''],
                    ['title' => 'THEROHEAL Physiotherapy Platform', 'title_ja' => '', 'description' => 'Appointment bookings, therapist workflows, treatment management and recovery tracking.', 'description_ja' => '', 'capabilities' => 'Healthcare workflows, Appointments, User dashboards', 'capabilities_ja' => ''],
                    ['title' => 'QR-Based Safety & Smart Assistance Platform', 'title_ja' => '', 'description' => 'Vehicle safety, visitor management, emergency reporting and real-time notifications.', 'description_ja' => '', 'capabilities' => 'QR scanning, Notifications, Administration, Security workflows', 'capabilities_ja' => ''],
                ],
                'engagement_models' => [
                    $ld('Project-Based Development', 'Defined scope, milestones and agreed deliverables for new mobile products.'),
                    $ld('Dedicated Development Team', 'Extend engineering capacity with developers aligned to project priorities.'),
                    $ld('Application Enhancement & Support', 'Improve an existing app through upgrades, integrations and maintenance.'),
                ],
                'faqs' => [
                    ['question' => 'How much does mobile app development cost in Tokyo?', 'question_ja' => '', 'answer' => '<p>Cost depends on complexity, platforms, UI/UX, backend integrations and maintenance needs. We assess your requirements and prepare a tailored estimate.</p>', 'answer_ja' => ''],
                    ['question' => 'How long does it take to develop a mobile application?', 'question_ja' => '', 'answer' => '<p>Timelines vary by scope, complexity, approvals and integrations. A defined MVP generally takes less effort than a feature-rich enterprise app; a realistic schedule follows requirements analysis.</p>', 'answer_ja' => ''],
                    ['question' => 'Do you develop both Android and iOS applications?', 'question_ja' => '', 'answer' => '<p>Yes — iOS, Android and cross-platform. The best approach depends on your audience, performance expectations and requirements.</p>', 'answer_ja' => ''],
                    ['question' => 'Can you modernize an existing mobile application?', 'question_ja' => '', 'answer' => '<p>Yes. Modernization can include architecture review, UI upgrades, API integration, performance improvements and migration planning, after an initial technical assessment.</p>', 'answer_ja' => ''],
                    ['question' => 'Do you provide mobile app development services to Japanese businesses?', 'question_ja' => '', 'answer' => '<p>Indo-Sakura is headquartered in Tokyo and works with Japan–India delivery, supporting organizations in Japan through coordinated software development.</p>', 'answer_ja' => ''],
                    ['question' => 'Can AI be integrated into mobile applications?', 'question_ja' => '', 'answer' => '<p>Yes — conversational assistants, document OCR, recommendations and workflow automation, where they solve a defined business problem with proper security and privacy safeguards.</p>', 'answer_ja' => ''],
                ],
                'section_titles' => [
                    'about'      => ['en' => 'Trusted Mobile App Development Services in Tokyo', 'ja' => ''],
                    'services'   => ['en' => 'Comprehensive Mobile App Development Services in Tokyo', 'ja' => ''],
                    'why'        => ['en' => 'Why Choose Indo-Sakura for Mobile App Development in Tokyo?', 'ja' => ''],
                    'industries' => ['en' => 'Industry-Focused Mobile App Development Solutions', 'ja' => ''],
                    'tech'       => ['en' => 'Mobile App Development Technologies & Platforms', 'ja' => ''],
                    'process'    => ['en' => 'Our Mobile App Development Process', 'ja' => ''],
                    'portfolio'  => ['en' => 'Our Mobile Application Development Success Stories', 'ja' => ''],
                    'engagement' => ['en' => 'Hire Mobile App Developers in Tokyo — Flexible Engagement Options', 'ja' => ''],
                    'faq'        => ['en' => 'Frequently Asked Questions About Mobile App Development in Tokyo', 'ja' => ''],
                ],
                'cta_title' => 'Ready to Build Your Mobile App with a Tokyo-Based Development Partner?',
                'cta_description' => 'Turn your application concept into an actionable development roadmap. Discuss your requirements with Indo-Sakura Software Japan.',
                'meta_title' => 'Mobile App Development Company in Tokyo | Indo-Sakura Software Japan',
                'meta_description' => 'Custom iOS, Android, cross-platform and enterprise mobile app development in Tokyo by Indo-Sakura Software Japan K.K. Get a free consultation.',
            ]
        );
    }
}
