<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\Lowker;
use App\Models\Jurusan;
use Inertia\Inertia;

class RekapController extends Controller
{
    public function alumni()
    {
        $alumni = Alumni::with('jurusan')->orderBy('nama')->get();
        $jurusan = Jurusan::all();
        return Inertia::render('Rekap/Alumni', [
            'alumni' => $alumni,
            'jurusan' => $jurusan,
        ]);
    }

    public function loker()
    {
        $lowker = Lowker::with(['perusahaan', 'jurusan'])->orderBy('tgl_posting', 'desc')->get();
        return Inertia::render('Rekap/Loker', [
            'lowker' => $lowker,
        ]);
    }
}
