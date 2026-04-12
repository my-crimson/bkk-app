<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TentangKamiController;
use App\Http\Controllers\LokerController;
use App\Http\Controllers\PerusahaanController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\TracerStudyController;
use App\Http\Controllers\RekapController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\InformasiJurusanController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\LamaranController;
use Illuminate\Support\Facades\Route;

// ========== PUBLIC ROUTES ==========
Route::get('/', [HomeController::class, 'beranda'])->name('beranda');
Route::get('/pengantar', [HomeController::class, 'pengantar'])->name('pengantar');
Route::get('/informasi-kegiatan', [HomeController::class, 'informasiKegiatan'])->name('informasi-kegiatan');
Route::get('/info-keg', [HomeController::class, 'infoKeg'])->name('info-keg');

// Tentang Kami
Route::get('/visi-misi', [TentangKamiController::class, 'visiMisi'])->name('visi-misi');
Route::get('/proker', [TentangKamiController::class, 'proker'])->name('proker');
Route::get('/tujuan', [TentangKamiController::class, 'tujuan'])->name('tujuan');
Route::get('/struktur-organisasi', [TentangKamiController::class, 'strukturOrganisasi'])->name('struktur-organisasi');

// Informasi Jurusan
Route::get('/informasi-jurusan', [InformasiJurusanController::class, 'index'])->name('informasi-jurusan');

// Perusahaan
Route::get('/perusahaan', [PerusahaanController::class, 'index'])->name('perusahaan');

// Loker (public)
Route::get('/loker', [LokerController::class, 'index'])->name('loker');
Route::get('/loker/{id}', [LokerController::class, 'detail'])->name('loker.detail');
Route::get('/loker/{id}/persyaratan', [LokerController::class, 'persyaratan'])->name('loker.persyaratan');

// ========== AUTH ROUTES ==========
Route::get('/login/admin', [AuthController::class, 'showAdminLogin'])->name('login.admin');
Route::get('/login/siswa', [AuthController::class, 'showAlumniLogin'])->name('login.alumni');
Route::get('/login/management', [AuthController::class, 'showManagementLogin'])->name('login.management');
Route::post('/login/admin', [AuthController::class, 'loginAdmin'])->name('login.admin.post');
Route::post('/login/siswa', [AuthController::class, 'loginAlumni'])->name('login.alumni.post');
Route::post('/login/management', [AuthController::class, 'loginManagement'])->name('login.management.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ========== ADMIN ROUTES ==========
Route::middleware('role:admin')->prefix('admin')->group(function () {
    // CRUD Loker
    Route::get('/loker', [LokerController::class, 'crudIndex'])->name('admin.loker.index');
    Route::get('/loker/create', [LokerController::class, 'create'])->name('admin.loker.create');
    Route::post('/loker', [LokerController::class, 'store'])->name('admin.loker.store');
    Route::get('/loker/{id}/edit', [LokerController::class, 'edit'])->name('admin.loker.edit');
    Route::put('/loker/{id}', [LokerController::class, 'update'])->name('admin.loker.update');
    Route::delete('/loker/{id}', [LokerController::class, 'destroy'])->name('admin.loker.destroy');

    // CRUD Perusahaan
    Route::get('/perusahaan', [PerusahaanController::class, 'crudIndex'])->name('admin.perusahaan.index');
    Route::post('/perusahaan', [PerusahaanController::class, 'store'])->name('admin.perusahaan.store');
    Route::get('/perusahaan/{id}/edit', [PerusahaanController::class, 'edit'])->name('admin.perusahaan.edit');
    Route::match(['put', 'post'], '/perusahaan/{id}', [PerusahaanController::class, 'update'])
        ->name('admin.perusahaan.update');
    Route::delete('/perusahaan/{id}', [PerusahaanController::class, 'destroy'])->name('admin.perusahaan.destroy');

    // CRUD Berita/Kegiatan
    Route::get('/berita', [BeritaController::class, 'index'])->name('admin.berita.index');
    Route::post('/berita', [BeritaController::class, 'store'])->name('admin.berita.store');
    Route::get('/berita/{id}/edit', [BeritaController::class, 'edit'])->name('admin.berita.edit');
    Route::put('/berita/{id}', [BeritaController::class, 'update'])->name('admin.berita.update');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('admin.berita.destroy');

    // Rekap
    Route::get('/rekap-alumni', [RekapController::class, 'alumni'])->name('admin.rekap.alumni');
    Route::get('/rekap-loker', [RekapController::class, 'loker'])->name('admin.rekap.loker');

    // Tracer Study
    Route::get('/tracer-study', [TracerStudyController::class, 'index'])->name('admin.tracer-study');
});

// ========== ALUMNI ROUTES ==========
Route::middleware('role:alumni')->group(function () {
    Route::get('/survey', [SurveyController::class, 'index'])->name('survey');
    Route::post('/survey', [SurveyController::class, 'store'])->name('survey.store');
    Route::get('/profil', [ProfilController::class, 'index'])->name('profil');
    Route::put('/profil', [ProfilController::class, 'update'])->name('profil.update');
});

// Lamaran download
Route::get('/lamaran/download/{id}', [LamaranController::class, 'download'])->name('lamaran.download');
