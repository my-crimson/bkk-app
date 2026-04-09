<?php

namespace App\Http\Controllers;

use App\Models\Perusahaan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PerusahaanController extends Controller
{
    // Public
    public function index()
    {
        $perusahaan = Perusahaan::orderBy('nama')->get();
        return Inertia::render('Perusahaan/Index', [
            'perusahaan' => $perusahaan,
        ]);
    }

    // Admin CRUD
    public function crudIndex()
    {
        $perusahaan = Perusahaan::orderBy('nama')->get();
        return Inertia::render('Admin/Perusahaan/Index', [
            'perusahaan' => $perusahaan,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $data = $request->only([
            'nama', 'alamat', 'kota', 'deskripsi_perusahaan', 'kontak',
            'email', 'logo', 'gambar', 'standar', 'kategori',
        ]);
        
        // Set default value for kerja_sama (required field)
        $data['kerja_sama'] = $request->kerja_sama ?? '-';
        
        Perusahaan::create($data);

        return redirect()->route('admin.perusahaan.index')->with('success', 'Perusahaan berhasil ditambahkan!');
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
            'nama', 'alamat', 'kota', 'deskripsi_perusahaan', 'kontak',
            'email', 'logo', 'gambar', 'standar', 'kategori',
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
        Perusahaan::findOrFail($id)->delete();
        return redirect()->route('admin.perusahaan.index')->with('success', 'Perusahaan berhasil dihapus!');
    }
}
