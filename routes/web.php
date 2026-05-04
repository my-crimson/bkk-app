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
Route::get('/login/siswa', [AuthController::class, 'showAlumniLogin'])->name('login.alumni');
Route::get('/login/management', [AuthController::class, 'showManagementLogin'])->name('login.management');
Route::post('/login/siswa', [AuthController::class, 'loginAlumni'])->name('login.alumni.post');
Route::post('/login/management', [AuthController::class, 'loginManagement'])->name('login.management.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ========== ADMIN ROUTES ==========
Route::middleware('role:management')->prefix('management')->group(function () {
    // CRUD Loker
    Route::get('/loker', [LokerController::class, 'crudIndex'])->name('management.loker.index');
    Route::get('/loker/create', [LokerController::class, 'create'])->name('management.loker.create');
    Route::post('/loker', [LokerController::class, 'store'])->name('management.loker.store');
    Route::get('/loker/{id}/edit', [LokerController::class, 'edit'])->name('management.loker.edit');
    Route::put('/loker/{id}', [LokerController::class, 'update'])->name('management.loker.update');
    Route::delete('/loker/{id}', [LokerController::class, 'destroy'])->name('management.loker.destroy');

    // CRUD Perusahaan
    Route::get('/perusahaan', [PerusahaanController::class, 'crudIndex'])->name('management.perusahaan.index');
    Route::get('/perusahaan/create', [PerusahaanController::class, 'create'])->name('management.perusahaan.create');
    Route::post('/perusahaan', [PerusahaanController::class, 'store'])->name('management.perusahaan.store');
    Route::get('/perusahaan/{id}/edit', [PerusahaanController::class, 'edit'])->name('management.perusahaan.edit');
    Route::match(['put', 'post'], '/perusahaan/{id}', [PerusahaanController::class, 'update'])
        ->name('management.perusahaan.update');
    Route::delete('/perusahaan/{id}', [PerusahaanController::class, 'destroy'])->name('management.perusahaan.destroy');

    // CRUD Berita/Kegiatan
    Route::get('/berita', [BeritaController::class, 'index'])->name('management.berita.index');
    Route::get('/berita/create', [BeritaController::class, 'create'])->name('management.berita.create');
    Route::post('/berita', [BeritaController::class, 'store'])->name('management.berita.store');
    Route::get('/berita/{id}/edit', [BeritaController::class, 'edit'])->name('management.berita.edit');
    Route::put('/berita/{id}', [BeritaController::class, 'update'])->name('management.berita.update');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('management.berita.destroy');

    // CRUD Jurusan
    Route::get('/jurusan', [InformasiJurusanController::class, 'crudIndex'])->name('management.jurusan.index');
    Route::get('/jurusan/create', [InformasiJurusanController::class, 'create'])->name('management.jurusan.create');
    Route::post('/jurusan', [InformasiJurusanController::class, 'store'])->name('management.jurusan.store');
    Route::get('/jurusan/{id}/edit', [InformasiJurusanController::class, 'edit'])->name('management.jurusan.edit');
    Route::match(['put', 'post'], '/jurusan/{id}', [InformasiJurusanController::class, 'update'])->name('management.jurusan.update');
    Route::delete('/jurusan/{id}', [InformasiJurusanController::class, 'destroy'])->name('management.jurusan.destroy');

    // Rekap
    Route::get('/rekap-alumni', [RekapController::class, 'alumni'])->name('management.rekap.alumni');
    Route::get('/rekap-loker', [RekapController::class, 'loker'])->name('management.rekap.loker');

    // Tracer Study
    Route::get('/tracer-study', [TracerStudyController::class, 'index'])->name('management.tracer-study');

    // CRUD Informasi
    Route::get('/informasi', [\App\Http\Controllers\Management\InformasiController::class, 'index'])->name('management.informasi.index');
    Route::put('/informasi', [\App\Http\Controllers\Management\InformasiController::class, 'updateInformasi'])->name('management.informasi.update');
    Route::post('/informasi/pengantar-profile', [\App\Http\Controllers\Management\InformasiController::class, 'updatePengantarProfile'])->name('management.informasi.pengantar-profile');
    Route::put('/informasi/level-options', [\App\Http\Controllers\Management\InformasiController::class, 'updateLevelOptions'])->name('management.informasi.level-options');
    Route::post('/informasi/struktur', [\App\Http\Controllers\Management\InformasiController::class, 'storeStruktur'])->name('management.informasi.struktur.store');
    Route::post('/informasi/struktur/{id}', [\App\Http\Controllers\Management\InformasiController::class, 'updateStruktur'])->name('management.informasi.struktur.update');
    Route::delete('/informasi/struktur/{id}', [\App\Http\Controllers\Management\InformasiController::class, 'destroyStruktur'])->name('management.informasi.struktur.destroy');

    // CRUD Management Users
    Route::post('/management-user', [\App\Http\Controllers\Management\UserController::class, 'store'])->name('management.management-user.store');
    Route::put('/management-user/{id}', [\App\Http\Controllers\Management\UserController::class, 'update'])->name('management.management-user.update');
    Route::delete('/management-user/{id}', [\App\Http\Controllers\Management\UserController::class, 'destroy'])->name('management.management-user.destroy');

    // CRUD Siswa/Alumni
    Route::get('/alumni', [\App\Http\Controllers\Management\AlumniController::class, 'index'])->name('management.alumni.index');
    Route::get('/alumni/create', [\App\Http\Controllers\Management\AlumniController::class, 'create'])->name('management.alumni.create');
    Route::post('/alumni', [\App\Http\Controllers\Management\AlumniController::class, 'store'])->name('management.alumni.store');
    Route::get('/alumni/{id}/edit', [\App\Http\Controllers\Management\AlumniController::class, 'edit'])->name('management.alumni.edit');
    Route::put('/alumni/{id}', [\App\Http\Controllers\Management\AlumniController::class, 'update'])->name('management.alumni.update');
    Route::delete('/alumni/{id}', [\App\Http\Controllers\Management\AlumniController::class, 'destroy'])->name('management.alumni.destroy');
    Route::post('/alumni/bulk-delete', [\App\Http\Controllers\Management\AlumniController::class, 'bulkDestroy'])->name('management.alumni.bulk-destroy');
    Route::post('/alumni/import', [\App\Http\Controllers\Management\AlumniController::class, 'import'])->name('management.alumni.import');
    Route::get('/alumni/template', [\App\Http\Controllers\Management\AlumniController::class, 'downloadTemplate'])->name('management.alumni.template');
    Route::post('/alumni/{id}/reset-password', [\App\Http\Controllers\Management\AlumniController::class, 'resetPassword'])->name('management.alumni.reset-password');

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\Management\AlumniController::class, 'notifications'])->name('management.notifications');
    Route::post('/notifications/{id}/resolve', [\App\Http\Controllers\Management\AlumniController::class, 'resolveNotification'])->name('management.notifications.resolve');
    Route::get('/notifications/pending-count', [\App\Http\Controllers\Management\AlumniController::class, 'pendingCount'])->name('management.notifications.pending-count');
});

// Forgot Password (public)
Route::post('/forgot-password', [\App\Http\Controllers\ForgotPasswordController::class, 'store'])->name('forgot-password.store');

// ========== ALUMNI ROUTES ==========
Route::middleware('role:alumni')->group(function () {
    Route::get('/survey', [SurveyController::class, 'index'])->name('survey');
    Route::post('/survey', [SurveyController::class, 'store'])->name('survey.store');
    Route::get('/profil', [ProfilController::class, 'index'])->name('profil');
    Route::put('/profil', [ProfilController::class, 'update'])->name('profil.update');
    Route::post('/profil/change-password', [ProfilController::class, 'changePassword'])->name('profil.change-password');
});

// Lamaran routes
Route::middleware('role:alumni')->group(function () {
    Route::post('/lamaran', [LamaranController::class, 'store'])->name('lamaran.store');
});

// Lamaran download
Route::get('/lamaran/download/{id}', [LamaranController::class, 'download'])->name('lamaran.download');
