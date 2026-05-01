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
Route::middleware('role:management')->prefix('admin')->group(function () {
    // CRUD Loker
    Route::get('/loker', [LokerController::class, 'crudIndex'])->name('admin.loker.index');
    Route::get('/loker/create', [LokerController::class, 'create'])->name('admin.loker.create');
    Route::post('/loker', [LokerController::class, 'store'])->name('admin.loker.store');
    Route::get('/loker/{id}/edit', [LokerController::class, 'edit'])->name('admin.loker.edit');
    Route::put('/loker/{id}', [LokerController::class, 'update'])->name('admin.loker.update');
    Route::delete('/loker/{id}', [LokerController::class, 'destroy'])->name('admin.loker.destroy');

    // CRUD Perusahaan
    Route::get('/perusahaan', [PerusahaanController::class, 'crudIndex'])->name('admin.perusahaan.index');
    Route::get('/perusahaan/create', [PerusahaanController::class, 'create'])->name('admin.perusahaan.create');
    Route::post('/perusahaan', [PerusahaanController::class, 'store'])->name('admin.perusahaan.store');
    Route::get('/perusahaan/{id}/edit', [PerusahaanController::class, 'edit'])->name('admin.perusahaan.edit');
    Route::match(['put', 'post'], '/perusahaan/{id}', [PerusahaanController::class, 'update'])
        ->name('admin.perusahaan.update');
    Route::delete('/perusahaan/{id}', [PerusahaanController::class, 'destroy'])->name('admin.perusahaan.destroy');

    // CRUD Berita/Kegiatan
    Route::get('/berita', [BeritaController::class, 'index'])->name('admin.berita.index');
    Route::get('/berita/create', [BeritaController::class, 'create'])->name('admin.berita.create');
    Route::post('/berita', [BeritaController::class, 'store'])->name('admin.berita.store');
    Route::get('/berita/{id}/edit', [BeritaController::class, 'edit'])->name('admin.berita.edit');
    Route::put('/berita/{id}', [BeritaController::class, 'update'])->name('admin.berita.update');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('admin.berita.destroy');

    // CRUD Jurusan
    Route::get('/jurusan', [InformasiJurusanController::class, 'crudIndex'])->name('admin.jurusan.index');
    Route::get('/jurusan/create', [InformasiJurusanController::class, 'create'])->name('admin.jurusan.create');
    Route::post('/jurusan', [InformasiJurusanController::class, 'store'])->name('admin.jurusan.store');
    Route::get('/jurusan/{id}/edit', [InformasiJurusanController::class, 'edit'])->name('admin.jurusan.edit');
    Route::match(['put', 'post'], '/jurusan/{id}', [InformasiJurusanController::class, 'update'])->name('admin.jurusan.update');
    Route::delete('/jurusan/{id}', [InformasiJurusanController::class, 'destroy'])->name('admin.jurusan.destroy');

    // Rekap
    Route::get('/rekap-alumni', [RekapController::class, 'alumni'])->name('admin.rekap.alumni');
    Route::get('/rekap-loker', [RekapController::class, 'loker'])->name('admin.rekap.loker');

    // Tracer Study
    Route::get('/tracer-study', [TracerStudyController::class, 'index'])->name('admin.tracer-study');

    // CRUD Informasi
    Route::get('/informasi', [\App\Http\Controllers\Admin\InformasiController::class, 'index'])->name('admin.informasi.index');
    Route::put('/informasi', [\App\Http\Controllers\Admin\InformasiController::class, 'updateInformasi'])->name('admin.informasi.update');
    Route::post('/informasi/pengantar-profile', [\App\Http\Controllers\Admin\InformasiController::class, 'updatePengantarProfile'])->name('admin.informasi.pengantar-profile');
    Route::put('/informasi/level-options', [\App\Http\Controllers\Admin\InformasiController::class, 'updateLevelOptions'])->name('admin.informasi.level-options');
    Route::post('/informasi/struktur', [\App\Http\Controllers\Admin\InformasiController::class, 'storeStruktur'])->name('admin.informasi.struktur.store');
    Route::post('/informasi/struktur/{id}', [\App\Http\Controllers\Admin\InformasiController::class, 'updateStruktur'])->name('admin.informasi.struktur.update');
    Route::delete('/informasi/struktur/{id}', [\App\Http\Controllers\Admin\InformasiController::class, 'destroyStruktur'])->name('admin.informasi.struktur.destroy');

    // CRUD Siswa/Alumni
    Route::get('/alumni', [\App\Http\Controllers\Admin\AlumniController::class, 'index'])->name('admin.alumni.index');
    Route::get('/alumni/create', [\App\Http\Controllers\Admin\AlumniController::class, 'create'])->name('admin.alumni.create');
    Route::post('/alumni', [\App\Http\Controllers\Admin\AlumniController::class, 'store'])->name('admin.alumni.store');
    Route::get('/alumni/{id}/edit', [\App\Http\Controllers\Admin\AlumniController::class, 'edit'])->name('admin.alumni.edit');
    Route::put('/alumni/{id}', [\App\Http\Controllers\Admin\AlumniController::class, 'update'])->name('admin.alumni.update');
    Route::delete('/alumni/{id}', [\App\Http\Controllers\Admin\AlumniController::class, 'destroy'])->name('admin.alumni.destroy');
    Route::post('/alumni/import', [\App\Http\Controllers\Admin\AlumniController::class, 'import'])->name('admin.alumni.import');
    Route::get('/alumni/template', [\App\Http\Controllers\Admin\AlumniController::class, 'downloadTemplate'])->name('admin.alumni.template');
    Route::post('/alumni/{id}/reset-password', [\App\Http\Controllers\Admin\AlumniController::class, 'resetPassword'])->name('admin.alumni.reset-password');

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\Admin\AlumniController::class, 'notifications'])->name('admin.notifications');
    Route::post('/notifications/{id}/resolve', [\App\Http\Controllers\Admin\AlumniController::class, 'resolveNotification'])->name('admin.notifications.resolve');
    Route::get('/notifications/pending-count', [\App\Http\Controllers\Admin\AlumniController::class, 'pendingCount'])->name('admin.notifications.pending-count');
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
