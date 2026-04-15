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
        // Halaman publik view-only: 1 halaman tampil 6 card
        $berita = Berita::orderBy('tanggal', 'desc')->paginate(6)->withQueryString();
        return Inertia::render('Home/InformasiKegiatan', [
            'berita' => $berita,
        ]);
    }

    public function infoKeg()
    {
        $berita = Berita::orderBy('tanggal', 'desc')->paginate(6)->withQueryString();
        return Inertia::render('Home/InfoKeg', [
            'berita' => $berita,
        ]);
    }
}
