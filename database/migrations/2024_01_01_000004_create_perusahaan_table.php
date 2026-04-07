<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perusahaan', function (Blueprint $table) {
            $table->increments('id_perusahaan');
            $table->string('nama_perusahaan', 255)->nullable();
            $table->text('alamat')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('logo', 255)->nullable();
            $table->string('website', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('telepon', 20)->nullable();
            $table->string('jenis_perusahaan', 100)->nullable();
            $table->string('skala', 50)->nullable();
            $table->string('jumlah_karyawan', 100)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perusahaan');
    }
};
