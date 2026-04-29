<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JurusanDetailSeeder extends Seeder
{
    public function run(): void
    {
        // Update or insert Teknik Kimia Industri with full detail
        $existing = DB::table('jurusan')->where('jurusan', 'LIKE', '%Teknik Kimia Industri%')->first();

        $data = [
            'jurusan' => 'Teknik Kimia Industri (TKI)',
            'deskripsi' => 'Jurusan Teknik Kimia Industri adalah salah satu bidang studi yang menggabungkan ilmu teknik dan ilmu kimia untuk mempelajari proses-proses industri yang melibatkan bahan kimia. Secara umum, teknik kimia industri memfokuskan pada pengembangan, perancangan, dan pengoperasian sistem industri yang dapat mengubah bahan mentah menjadi produk jadi melalui proses kimia dan fisik yang efisien.',
            'prospek_kerja' => "Industri perminyakan dan gas alam\nPertambangan batu bara\nIndustri semen\nIndustri pupuk\nProcess Engineer (Insinyur Proses): Bertanggung jawab atas desain dan pengoptimalan proses produksi\nProduction Manager (Manajer Produksi): Mengelola proses produksi dan memastikan kualitas serta efisiensi\nQuality Control Analyst (Analis Kontrol Kualitas): Memastikan produk yang dihasilkan memenuhi standar kualitas\nEnvironmental Engineer (Insinyur Lingkungan): Mengelola dan meminimalkan dampak lingkungan dari proses industri\nResearch and Development (R&D): Mengembangkan produk baru atau meningkatkan proses produksi yang sudah ada",
        ];

        if ($existing) {
            DB::table('jurusan')->where('id_jurusan', $existing->id_jurusan)->update($data);
        } else {
            DB::table('jurusan')->insert($data);
        }
    }
}
