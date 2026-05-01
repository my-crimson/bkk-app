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
        Schema::table('informasis', function (Blueprint $table) {
            $table->string('pengantar_foto')->nullable();
            $table->string('pengantar_nama')->nullable();
            $table->string('pengantar_jabatan')->nullable();
            $table->string('pengantar_nip')->nullable();
            $table->json('level_options')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('informasis', function (Blueprint $table) {
            $table->dropColumn(['pengantar_foto', 'pengantar_nama', 'pengantar_jabatan', 'pengantar_nip', 'level_options']);
        });
    }
};
