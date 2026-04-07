<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed jurusan
        $jurusanList = [
            'Teknik Komputer dan Jaringan',
            'Rekayasa Perangkat Lunak',
            'Multimedia',
            'Teknik Kendaraan Ringan',
            'Teknik Sepeda Motor',
            'Teknik Instalasi Tenaga Listrik',
            'Teknik Pemesinan',
            'Teknik Pengelasan',
            'Tata Busana',
            'Akuntansi dan Keuangan Lembaga',
        ];

        foreach ($jurusanList as $j) {
            DB::table('jurusan')->insert(['jurusan' => $j]);
        }

        // Seed default admin user
        DB::table('users')->insert([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Seed management user
        DB::table('users')->insert([
            'username' => 'management',
            'password' => Hash::make('management123'),
            'role' => 'management',
        ]);
    }
}
