<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilController extends Controller
{
    public function index()
    {
        $alumni = Alumni::with('jurusan')->findOrFail(session('user_id'));
        return Inertia::render('Profil/Index', [
            'alumni' => $alumni,
        ]);
    }

    public function update(Request $request)
    {
        $alumni = Alumni::findOrFail(session('user_id'));

        $data = $request->only([
            'nama', 'jenis_kelamin', 'nisn', 'tempat_lahir', 'tanggal_lahir',
            'nik', 'agama', 'alamat', 'rt', 'rw', 'dusun', 'kelurahan',
            'kecamatan', 'kode_pos', 'email', 'no_wa',
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('uploads/profil', 'public');
            $data['gambar'] = $path;
        }

        $alumni->update($data);

        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}
