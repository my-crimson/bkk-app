<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaController extends Controller
{
    // PUBLIC
    public function publicIndex(Request $request)
    {
        $allBerita = Berita::orderBy('id_berita', 'desc')->get();

        // 2. Query filter
        $query = Berita::query();

        if ($request->filled('search')) {
            $term = $request->search;

            $query->where(function ($q) use ($term) {
                $q->where('judul', 'like', "%{$term}%")
                    ->orWhere('lokasi', 'like', "%{$term}%")
                    ->orWhere('deskripsi', 'like', "%{$term}%");
            });
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        $filteredData = $query
            ->orderBy('id_berita', 'desc')
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('InformasiKegiatan/Index', [
            'allBerita' => $allBerita,
            'berita' => $filteredData,
            'filters' => $request->only(['search', 'tanggal']),
        ]);
    }

    // ADMIN CRUD
    public function index(Request $request)
    {
        $query = Berita::query();

        // FILTER SEARCH
        if ($request->filled('search')) {
            $term = $request->search;

            $query->where(function ($q) use ($term) {
                $q->where('judul', 'like', "%{$term}%")
                    ->orWhere('lokasi', 'like', "%{$term}%")
                    ->orWhere('deskripsi', 'like', "%{$term}%");
            });
        }

        // FILTER TANGGAL
        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        // ADMIN PAGINATION
        $berita = $query
            ->orderBy('id_berita', 'desc')
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Admin/Berita/Index', [
            'berita' => $berita,
            'filters' => $request->only(['search', 'tanggal']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Berita/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
        ]);

        $data = $request->only([
            'judul',
            'tanggal',
            'jml_peserta',
            'lokasi',
            'deskripsi'
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')
                ->store('uploads/kegiatan', 'public');

            $data['gambar'] = basename($path);
        }

        Berita::create($data);

        return redirect()
            ->route('admin.berita.index')
            ->with('success', 'Kegiatan berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $berita = Berita::findOrFail($id);

        return Inertia::render('Admin/Berita/Edit', [
            'berita' => $berita,
        ]);
    }

    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $data = $request->only([
            'judul',
            'tanggal',
            'jml_peserta',
            'lokasi',
            'deskripsi'
        ]);

        $request->validate([
            'judul' => 'required|string|max:255',
        ]);
        
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')
                ->store('uploads/kegiatan', 'public');

            $data['gambar'] = basename($path);
        }
        

        $berita->update($data);

        return redirect()
            ->route('admin.berita.index')
            ->with('success', 'Kegiatan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        Berita::findOrFail($id)->delete();

        return redirect()
            ->route('admin.berita.index')
            ->with('success', 'Kegiatan berhasil dihapus!');
    }
}