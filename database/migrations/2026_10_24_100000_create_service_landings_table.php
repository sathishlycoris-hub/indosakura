<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_landings', function (Blueprint $table) {
            $table->id();

            // Optional parent service. When set, the landing page also shows up
            // as an arrow-card on /services/{service-slug} (same as service items).
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();

            // Public URL => /services/landing/{slug}
            $table->string('slug')->unique();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_published')->default(true);

            // Card (shown on parent service page)
            $table->string('title');
            $table->string('title_ja')->nullable();
            $table->text('card_description')->nullable();
            $table->text('card_description_ja')->nullable();

            // Hero
            $table->string('eyebrow')->nullable();
            $table->string('eyebrow_ja')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('subtitle_ja')->nullable();
            $table->longText('hero_description')->nullable();
            $table->longText('hero_description_ja')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('cta_label')->nullable();
            $table->string('cta_label_ja')->nullable();
            $table->string('cta_url')->nullable();
            $table->string('secondary_cta_label')->nullable();
            $table->string('secondary_cta_label_ja')->nullable();
            $table->string('secondary_cta_url')->nullable();

            // About
            $table->longText('intro')->nullable();
            $table->longText('intro_ja')->nullable();

            // JSON sections
            $table->json('trust_highlights')->nullable(); // [{title,title_ja}]
            $table->json('stats')->nullable();            // [{value,label,label_ja}]
            $table->json('sub_services')->nullable();     // [{title,description,..}]
            $table->json('why_choose')->nullable();
            $table->json('industries')->nullable();
            $table->json('tech_stack')->nullable();       // [{category,items}]
            $table->json('process_steps')->nullable();
            $table->json('portfolio')->nullable();        // [{title,description,capabilities}]
            $table->json('engagement_models')->nullable();
            $table->json('faqs')->nullable();
            $table->json('section_titles')->nullable();   // {about:{en,ja},services:{..},...}

            // Closing CTA
            $table->string('cta_title')->nullable();
            $table->string('cta_title_ja')->nullable();
            $table->text('cta_description')->nullable();
            $table->text('cta_description_ja')->nullable();

            // SEO
            $table->string('meta_title')->nullable();
            $table->string('meta_title_ja')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->string('meta_description_ja', 500)->nullable();
            $table->string('meta_keywords', 500)->nullable();
            $table->string('meta_keywords_ja', 500)->nullable();
            $table->string('og_image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_landings');
    }
};
