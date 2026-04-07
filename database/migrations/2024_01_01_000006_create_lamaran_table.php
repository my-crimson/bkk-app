<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lamaran', function (Blueprint $table) {
            $table->increments('id_lamaran');
            $table->unsignedInteger('id_alumni')->nullable();
            $table->unsignedInteger('id_lowker')->nullable();
            $table->date('tanggal_lamar')->nullable();
            $table->enum('status', ['pending', 'diterima', 'ditolak'])->default('pending');
            $table->string('file_lamaran', 255)->nullable();

            $table->foreign('id_alumni')->references('id')->on('alumni');
            $table->foreign('id_lowker')->references('id_lowker')->on('lowker');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lamaran');
    }
};
