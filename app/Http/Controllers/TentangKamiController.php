<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TentangKamiController extends Controller
{
    public function visiMisi()
    {
        return Inertia::render('TentangKami/VisiMisi');
    }

    public function proker()
    {
        return Inertia::render('TentangKami/Proker');
    }

    public function tujuan()
    {
        return Inertia::render('TentangKami/Tujuan');
    }

    public function strukturOrganisasi()
    {
        return Inertia::render('TentangKami/StrukturOrganisasi');
    }
}
