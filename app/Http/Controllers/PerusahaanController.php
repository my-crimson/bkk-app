<?php

namespace App\Http\Controllers;

use App\Models\Perusahaan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
<<<<<<< HEAD
=======
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
>>>>>>> remotes/origin/main

        $perusahaan = Perusahaan::findOrFail($id);

        $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only([
            'nama_perusahaan', 'alamat', 'deskripsi', 'website',
            'email', 'telepon', 'jenis_perusahaan', 'skala', 'jumlah_karyawan',
        ]);

        // ======================
        // UPDATE LOGO
        // ======================
        if ($request->hasFile('logo')) {

            if ($perusahaan->logo) {
                Storage::delete('public/logo_perusahaan/' . $perusahaan->logo);
            }

            $fileLogo = $request->file('logo');
            $namaLogo = 'logo_' . time() . '_' . $fileLogo->getClientOriginalName();
            $fileLogo->storeAs('logo_perusahaan', $namaLogo, 'public');

            $data['logo'] = $namaLogo;
        }

        // ======================
        // UPDATE GAMBAR
        // ======================
        if ($request->hasFile('gambar')) {

            if ($perusahaan->gambar) {
                Storage::delete('public/gambar_perusahaan/' . $perusahaan->gambar);
            }

            $fileGambar = $request->file('gambar');
            $namaGambar = 'gambar_' . time() . '_' . $fileGambar->getClientOriginalName();
            $fileGambar->storeAs('gambar_perusahaan', $namaGambar, 'public');

            $data['gambar'] = $namaGambar;
        }

        $perusahaan->update($data);

        return redirect()->route('admin.perusahaan.index')
            ->with('success', 'Perusahaan berhasil diperbarui!');
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
