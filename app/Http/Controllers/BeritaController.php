<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::orderBy('tanggal', 'desc')->paginate(5)->withQueryString();
        return Inertia::render('Admin/Berita/Index', [
            'berita' => $berita,
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

        $data = $request->only(['judul', 'tanggal', 'jml_peserta', 'lokasi', 'deskripsi']);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('uploads/kegiatan', 'public');
            $data['gambar'] = basename($path);
        }

        Berita::create($data);
        return redirect()->route('admin.berita.index')->with('success', 'Kegiatan berhasil ditambahkan!');
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
        $data = $request->only(['judul', 'tanggal', 'jml_peserta', 'lokasi', 'deskripsi']);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('uploads/kegiatan', 'public');
            $data['gambar'] = basename($path);
        }

        $berita->update($data);
        return redirect()->route('admin.berita.index')->with('success', 'Kegiatan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        Berita::findOrFail($id)->delete();
        return redirect()->route('admin.berita.index')->with('success', 'Kegiatan berhasil dihapus!');
    }
}
