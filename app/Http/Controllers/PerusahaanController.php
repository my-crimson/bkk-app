<?php

namespace App\Http\Controllers;

use App\Models\Perusahaan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PerusahaanController extends Controller
{
    // Public
    public function index(Request $request)
    {
        // 1. Ambil SEMUA data untuk Carousel (Tanpa Filter)
        $carouselData = Perusahaan::orderBy('id_perusahaan')->get();

        // 2. Logika Query untuk Pencarian (Data yang akan berubah saat dicari)
        $query = Perusahaan::query();

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('nama', 'like', "%{$term}%")
                    ->orWhere('alamat', 'like', "%{$term}%");
            });
        }

        if ($request->filled('skala')) {
            $query->where('skala', $request->skala);
        }

        $filteredData = $query->orderBy('id_perusahaan')->get();

        return Inertia::render('Perusahaan/Index', [
            'carouselPerusahaan' => $carouselData, // Tetap utuh
            'perusahaan' => $filteredData,         // Berubah sesuai search
            'filters' => $request->only(['search', 'skala']),
        ]);
    }

    // Admin CRUD
    public function crudIndex(Request $request)
    {
        $query = Perusahaan::query();

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('nama', 'like', "%{$term}%")
                ->orWhere('alamat', 'like', "%{$term}%")
                ->orWhere('email', 'like', "%{$term}%");
            });
        }

        if ($request->filled('skala')) {
            $query->where('skala', $request->skala);
        }

        // Admin menggunakan pagination
        $perusahaan = $query->orderBy('id_perusahaan')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Perusahaan/Index', [
            'perusahaan' => $perusahaan,
            'filters' => $request->only(['search', 'skala']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Perusahaan/Create');
    }


    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $data = $request->only([
            'nama', 'alamat', 'deskripsi', 'kontak', 'website',
            'email', 'logo', 'gambar', 'jenis', 'skala',
        ]);
        
        // Set default value for kerja_sama (required field)
        $data['kerja_sama'] = $request->kerja_sama ?? '-';

        // ======================
        // UPLOAD LOGO
        // ======================
        if ($request->hasFile('logo')) {
            $fileLogo = $request->file('logo');
            $namaLogo = 'logo_' . time() . '_' . $fileLogo->getClientOriginalName();
            $fileLogo->storeAs('logo_perusahaan', $namaLogo, 'public');

            $data['logo'] = $namaLogo;
        }

        // ======================
        // UPLOAD GAMBAR
        // ======================
        if ($request->hasFile('gambar')) {
            $fileGambar = $request->file('gambar');
            $namaGambar = 'gambar_' . time() . '_' . $fileGambar->getClientOriginalName();
            $fileGambar->storeAs('gambar_perusahaan', $namaGambar, 'public');

            $data['gambar'] = $namaGambar;
        }

        try {
            Perusahaan::create($data);
        } catch (\Exception $e) {
            dd($e->getMessage());
        }

        return redirect()->route('admin.perusahaan.index')
            ->with('success', 'Perusahaan berhasil ditambahkan!');
    }


    public function edit($id)
    {
        $perusahaan = Perusahaan::findOrFail($id);
        return Inertia::render('Admin/Perusahaan/Edit', [
            'perusahaan' => $perusahaan,
        ]);
    }


    public function update(Request $request, $id)
    {
        $perusahaan = Perusahaan::findOrFail($id);
        
        $data = $request->only([
            'nama', 'alamat', 'deskripsi', 'kontak', 'website',
            'email', 'logo', 'gambar', 'jenis', 'skala',
        ]);
        
        // Set default value for kerja_sama if provided
        if ($request->kerja_sama) {
            $data['kerja_sama'] = $request->kerja_sama;
        }
        
        $perusahaan->update($data);

        return redirect()->route('admin.perusahaan.index')->with('success', 'Perusahaan berhasil diperbarui!');
    }


    public function destroy($id)
    {
        $perusahaan = Perusahaan::findOrFail($id);

        // Hapus logo
        if ($perusahaan->logo) {
            Storage::disk('public')->delete('logo_perusahaan/' . $perusahaan->logo);
        }

        // Hapus gambar
        if ($perusahaan->gambar) {
            Storage::disk('public')->delete('gambar_perusahaan/' . $perusahaan->gambar);
        }

        $perusahaan->delete();

        return redirect()->route('admin.perusahaan.index')
            ->with('success', 'Perusahaan berhasil dihapus!');
    }
}
