<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lowker', function (Blueprint $table) {
            $table->increments('id_lowker');
            $table->string('judul_lowker', 255)->nullable();
            $table->text('deskripsi')->nullable();
            $table->text('persyaratan')->nullable();
            $table->string('gaji', 100)->nullable();
            $table->string('lokasi', 255)->nullable();
            $table->date('tgl_posting')->nullable();
            $table->date('tgl_ditutup')->nullable();
            $table->unsignedInteger('id_perusahaan')->nullable();
            $table->unsignedInteger('id_jurusan')->nullable();
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');

            $table->foreign('id_perusahaan')->references('id_perusahaan')->on('perusahaan');
            $table->foreign('id_jurusan')->references('id_jurusan')->on('jurusan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lowker');
    }
};
