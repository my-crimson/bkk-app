<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumni', function (Blueprint $table) {
            $table->dropColumn('kelas');
            $table->string('tahun_lulus', 4)->nullable()->after('id_jurusan');
        });
    }

    public function down(): void
    {
        Schema::table('alumni', function (Blueprint $table) {
            $table->string('kelas', 5)->nullable();
            $table->dropColumn('tahun_lulus');
        });
    }
};
