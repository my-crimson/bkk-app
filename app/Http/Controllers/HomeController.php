<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function beranda()
    {
        return Inertia::render('Home/Beranda');
    }

    public function pengantar()
    {
        return Inertia::render('Home/Pengantar');
    }

    public function informasiKegiatan()
    {
        $berita = Berita::orderBy('tanggal', 'desc')->get();
        return Inertia::render('Home/InformasiKegiatan', [
            'berita' => $berita,
        ]);
    }

    public function infoKeg()
    {
        $berita = Berita::orderBy('tanggal', 'desc')->get();
        return Inertia::render('Home/InfoKeg', [
            'berita' => $berita,
        ]);
    }
}
