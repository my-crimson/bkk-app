<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TentangKamiController extends Controller
{
    public function visiMisi()
    {
        $informasi = \App\Models\Informasi::first();
        return Inertia::render('TentangKami/VisiMisi', ['informasi' => $informasi]);
    }

    public function proker()
    {
        $informasi = \App\Models\Informasi::first();
        return Inertia::render('TentangKami/Proker', ['informasi' => $informasi]);
    }

    public function tujuan()
    {
        $informasi = \App\Models\Informasi::first();
        return Inertia::render('TentangKami/Tujuan', ['informasi' => $informasi]);
    }

    public function strukturOrganisasi()
    {
        $informasi = \App\Models\Informasi::first();
        $struktur = \App\Models\StrukturOrganisasi::orderBy('level')->orderBy('id')->get();
        return Inertia::render('TentangKami/StrukturOrganisasi', [
            'struktur' => $struktur,
            'informasi' => $informasi
        ]);
    }
}
