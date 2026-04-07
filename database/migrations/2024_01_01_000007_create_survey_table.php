<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey', function (Blueprint $table) {
            $table->increments('id_survey');
            $table->unsignedInteger('id_alumni')->nullable();
            $table->enum('pilihan_survey', ['bekerja', 'wirausaha', 'menganggur', 'magang', 'kuliah'])->nullable();
            $table->text('kritiksaran')->nullable();
            $table->date('tgl_dibuat')->nullable();

            $table->foreign('id_alumni')->references('id')->on('alumni');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey');
    }
};
