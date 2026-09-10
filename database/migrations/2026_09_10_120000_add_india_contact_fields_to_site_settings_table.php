<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->text('contact_ind_phone')->nullable()->after('contact_address_ja');
            $table->text('contact_ind_phone_ja')->nullable()->after('contact_ind_phone');
            $table->text('contact_ind_address')->nullable()->after('contact_ind_phone_ja');
            $table->text('contact_ind_address_ja')->nullable()->after('contact_ind_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn([
                'contact_ind_phone',
                'contact_ind_phone_ja',
                'contact_ind_address',
                'contact_ind_address_ja',
            ]);
        });
    }
};
