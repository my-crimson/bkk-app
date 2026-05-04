<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfilController extends Controller
{
    public function index()
    {
        $alumni = Alumni::with('jurusan')->findOrFail(session('user_id'));
        return Inertia::render('Profil/Index', [
            'alumni' => $alumni,
            'mustChangePassword' => session('must_change_password', false),
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

        // Refresh session data so navbar reflects changes immediately
        session(['nama' => $alumni->nama, 'gambar' => $alumni->gambar]);

        return back()->with('success', 'Profil berhasil diperbarui!');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|min:6|confirmed',
        ], [
            'password.required' => 'Password baru harus diisi.',
            'password.min' => 'Password minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $alumni = Alumni::findOrFail(session('user_id'));

        $alumni->update([
            'password' => Hash::make($request->password),
            'password_changed' => true,
        ]);

        // Hapus flag must_change_password dari session
        session()->forget('must_change_password');

        return back()->with('success', 'Password berhasil diubah! Selanjutnya gunakan password baru untuk login.');
    }
}
