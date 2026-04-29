<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jurusan', function (Blueprint $table) {
            $table->text('deskripsi')->nullable()->after('jurusan');
            $table->text('prospek_kerja')->nullable()->after('deskripsi');
            $table->string('gambar1', 255)->nullable()->after('prospek_kerja');
            $table->string('gambar2', 255)->nullable()->after('gambar1');
        });
    }

    public function down(): void
    {
        Schema::table('jurusan', function (Blueprint $table) {
            $table->dropColumn(['deskripsi', 'prospek_kerja', 'gambar1', 'gambar2']);
        });
    }
};
