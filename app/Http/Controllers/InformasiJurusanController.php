<?php

namespace App\Http\Controllers;

use App\Models\Jurusan;
use Inertia\Inertia;

class InformasiJurusanController extends Controller
{
    public function index()
    {
        $jurusan = Jurusan::all();
        return Inertia::render('InformasiJurusan/Index', [
            'jurusan' => $jurusan,
        ]);
    }
}
