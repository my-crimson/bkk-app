<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumni', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nama', 100);
            $table->string('jenis_kelamin', 10);
            $table->string('nisn', 255);
            $table->string('tempat_lahir', 255);
            $table->date('tanggal_lahir');
            $table->string('nik', 255);
            $table->string('agama', 11);
            $table->text('alamat');
            $table->integer('rt')->nullable();
            $table->integer('rw')->nullable();
            $table->string('dusun', 100)->nullable();
            $table->string('kelurahan', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->integer('kode_pos')->nullable();
            $table->string('email', 100)->nullable();
            $table->string('no_wa', 15)->nullable();
            $table->unsignedInteger('id_jurusan')->nullable();
            $table->string('password', 100);
            $table->string('gambar', 255)->nullable();

            $table->foreign('id_jurusan')->references('id_jurusan')->on('jurusan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni');
    }
};
