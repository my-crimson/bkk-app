<?php

use App\Models\Lamaran;
use App\Models\Lowker;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('lowker:cleanup-expired', function () {
    $today = Carbon::now('Asia/Jakarta')->toDateString();
    $expiredIds = Lowker::query()
        ->whereNotNull('tgl_ditutup')
        ->whereDate('tgl_ditutup', '<', $today)
        ->pluck('id_lowker');

    if ($expiredIds->isEmpty()) {
        $this->info('Tidak ada lowongan expired untuk dibersihkan.');
        return;
    }

    $lamaranDeleted = Lamaran::whereIn('id_lowker', $expiredIds)->delete();
    $lowkerDeleted = Lowker::whereIn('id_lowker', $expiredIds)->delete();

    $this->info("Cleanup selesai. Lowongan dihapus: {$lowkerDeleted}, Lamaran dihapus: {$lamaranDeleted}.");
})->purpose('Hapus lowongan expired beserta lamaran terkait');

Schedule::command('lowker:cleanup-expired')
    ->dailyAt('00:10')
    ->timezone('Asia/Jakarta')
    ->withoutOverlapping();
