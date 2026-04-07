<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('berita', function (Blueprint $table) {
            $table->increments('id_berita');
            $table->string('judul', 255)->nullable();
            $table->date('tanggal')->nullable();
            $table->string('jml_peserta', 255)->nullable();
            $table->string('lokasi', 255)->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('gambar', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('berita');
    }
};
