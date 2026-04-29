<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('perusahaan', function (Blueprint $table) {
            $dropColumns = [];
            foreach (['kota', 'deskripsi_perusahaan', 'kontak', 'standar', 'kategori', 'kerja_sama'] as $column) {
                if (Schema::hasColumn('perusahaan', $column)) {
                    $dropColumns[] = $column;
                }
            }

            if (!empty($dropColumns)) {
                $table->dropColumn($dropColumns);
            }
        });

        Schema::table('lowker', function (Blueprint $table) {
            $dropColumns = [];
            foreach ([
                'deskripsi_lowker',
                'kualifikasi',
                'email',
                'pendidikan',
                'tipe_pekerjaan',
                'keahlian',
                'waktu_bekerja',
                'tunjangan',
                'jumlah_pelamar',
            ] as $column) {
                if (Schema::hasColumn('lowker', $column)) {
                    $dropColumns[] = $column;
                }
            }

            if (!empty($dropColumns)) {
                $table->dropColumn($dropColumns);
            }
        });
    }

    public function down(): void
    {
        Schema::table('perusahaan', function (Blueprint $table) {
            if (!Schema::hasColumn('perusahaan', 'kota')) $table->string('kota', 150)->nullable()->after('alamat');
            if (!Schema::hasColumn('perusahaan', 'deskripsi_perusahaan')) $table->text('deskripsi_perusahaan')->nullable()->after('kota');
            if (!Schema::hasColumn('perusahaan', 'kontak')) $table->string('kontak', 50)->nullable()->after('email');
            if (!Schema::hasColumn('perusahaan', 'standar')) $table->string('standar', 100)->nullable()->after('kontak');
            if (!Schema::hasColumn('perusahaan', 'kategori')) $table->string('kategori', 100)->nullable()->after('standar');
            if (!Schema::hasColumn('perusahaan', 'kerja_sama')) $table->string('kerja_sama', 150)->nullable()->after('kategori');
        });

        Schema::table('lowker', function (Blueprint $table) {
            if (!Schema::hasColumn('lowker', 'deskripsi_lowker')) $table->text('deskripsi_lowker')->nullable()->after('judul_lowker');
            if (!Schema::hasColumn('lowker', 'kualifikasi')) $table->text('kualifikasi')->nullable()->after('deskripsi_lowker');
            if (!Schema::hasColumn('lowker', 'email')) $table->string('email', 255)->nullable()->after('status');
            if (!Schema::hasColumn('lowker', 'pendidikan')) $table->string('pendidikan', 100)->nullable()->after('email');
            if (!Schema::hasColumn('lowker', 'tipe_pekerjaan')) $table->string('tipe_pekerjaan', 100)->nullable()->after('pendidikan');
            if (!Schema::hasColumn('lowker', 'keahlian')) $table->text('keahlian')->nullable()->after('tipe_pekerjaan');
            if (!Schema::hasColumn('lowker', 'waktu_bekerja')) $table->string('waktu_bekerja', 100)->nullable()->after('keahlian');
            if (!Schema::hasColumn('lowker', 'tunjangan')) $table->text('tunjangan')->nullable()->after('waktu_bekerja');
            if (!Schema::hasColumn('lowker', 'jumlah_pelamar')) $table->unsignedInteger('jumlah_pelamar')->default(0)->after('tunjangan');
        });
    }
};

