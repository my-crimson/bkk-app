<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Alumni;
use App\Models\Jurusan;
use Inertia\Inertia;

class TracerStudyController extends Controller
{
    public function index()
    {
        $surveys = Survey::with('alumni.jurusan')->orderBy('tgl_dibuat', 'desc')->get();
        $alumni = Alumni::with('jurusan')->get();
        $jurusan = Jurusan::all();

        return Inertia::render('TracerStudy/Index', [
            'surveys' => $surveys,
            'alumni' => $alumni,
            'jurusan' => $jurusan,
        ]);
    }
}
