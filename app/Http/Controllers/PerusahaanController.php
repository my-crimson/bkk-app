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

        Perusahaan::create($request->only([
            'nama', 'alamat', 'deskripsi_perusahaan', 'logo', 'website',
            'email', 'telepon', 'jenis_perusahaan', 'skala', 'jumlah_karyawan',
        ]));

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
        $perusahaan->update($request->only([
            'nama', 'alamat', 'deskripsi_perusahaan', 'logo', 'website',
            'email', 'telepon', 'jenis_perusahaan', 'skala', 'jumlah_karyawan',
        ]));

        return redirect()->route('admin.perusahaan.index')->with('success', 'Perusahaan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        Perusahaan::findOrFail($id)->delete();
        return redirect()->route('admin.perusahaan.index')->with('success', 'Perusahaan berhasil dihapus!');
    }
}
