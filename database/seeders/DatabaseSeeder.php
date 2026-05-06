<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed management user
        DB::table('users')->insert([
            'username' => 'management',
            'password' => Hash::make('management123'),
            'role' => 'management',
        ]);
    }
}
