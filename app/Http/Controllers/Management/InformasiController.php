<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\Informasi;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class InformasiController extends Controller
{
    public function index()
    {
        $informasi = Informasi::first();
        if (!$informasi) {
            $informasi = Informasi::create([
                'visi' => '',
                'misi' => '',
                'proker' => '',
                'tujuan' => '',
                'pengantar' => ''
            ]);
        }

        $struktur = StrukturOrganisasi::orderBy('level')->orderBy('id')->get();

        return Inertia::render('Management/Informasi/Index', [
            'informasi' => $informasi,
            'struktur' => $struktur
        ]);
    }

    public function updateInformasi(Request $request)
    {
        $request->validate([
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'proker' => 'nullable|string',
            'tujuan' => 'nullable|string',
            'pengantar' => 'nullable|string',
        ]);

        $informasi = Informasi::first();
        if (!$informasi) {
            $informasi = new Informasi();
        }

        $informasi->visi = $request->visi;
        $informasi->misi = $request->misi;
        $informasi->proker = $request->proker;
        $informasi->tujuan = $request->tujuan;
        $informasi->pengantar = $request->pengantar;
        $informasi->save();

        return redirect()->back()->with('success', 'Informasi berhasil diperbarui.');
    }

    public function updatePengantarProfile(Request $request)
    {
        $request->validate([
            'pengantar_nama' => 'nullable|string|max:255',
            'pengantar_jabatan' => 'nullable|string|max:255',
            'pengantar_nip' => 'nullable|string|max:255',
            'pengantar_foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $informasi = Informasi::first();
        if (!$informasi) {
            $informasi = new Informasi();
        }

        $informasi->pengantar_nama = $request->pengantar_nama;
        $informasi->pengantar_jabatan = $request->pengantar_jabatan;
        $informasi->pengantar_nip = $request->pengantar_nip;

        if ($request->hasFile('pengantar_foto')) {
            if ($informasi->pengantar_foto && Storage::disk('public')->exists('uploads/pengantar/' . $informasi->pengantar_foto)) {
                Storage::disk('public')->delete('uploads/pengantar/' . $informasi->pengantar_foto);
            }
            $file = $request->file('pengantar_foto');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('uploads/pengantar', $filename, 'public');
            $informasi->pengantar_foto = $filename;
        }

        $informasi->save();

        return redirect()->back()->with('success', 'Profil pengantar berhasil diperbarui.');
    }

    public function updateLevelOptions(Request $request)
    {
        $request->validate([
            'level_options' => 'required|array',
        ]);

        $informasi = Informasi::first();
        if (!$informasi) {
            $informasi = new Informasi();
        }

        $informasi->level_options = $request->level_options;
        $informasi->save();

        return redirect()->back()->with('success', 'Level options berhasil diperbarui.');
    }

    public function storeStruktur(Request $request)
    {
        $request->validate([
            'level' => 'required|integer',
            'jabatan' => 'required|string|max:255',
            'nama' => 'required|string',
            'nip' => 'nullable|string|max:255',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $data = $request->all();

        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('uploads/struktur', $filename, 'public');
            $data['foto_profil'] = $filename;
        }

        StrukturOrganisasi::create($data);

        return redirect()->back()->with('success', 'Anggota struktur berhasil ditambahkan.');
    }

    public function updateStruktur(Request $request, $id)
    {
        $request->validate([
            'level' => 'required|integer',
            'jabatan' => 'required|string|max:255',
            'nama' => 'required|string',
            'nip' => 'nullable|string|max:255',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $struktur = StrukturOrganisasi::findOrFail($id);
        $data = $request->except('foto_profil');

        if ($request->hasFile('foto_profil')) {
            // Delete old file if exists
            if ($struktur->foto_profil && Storage::disk('public')->exists('uploads/struktur/' . $struktur->foto_profil)) {
                Storage::disk('public')->delete('uploads/struktur/' . $struktur->foto_profil);
            }
            $file = $request->file('foto_profil');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('uploads/struktur', $filename, 'public');
            $data['foto_profil'] = $filename;
        }

        $struktur->update($data);

        return redirect()->back()->with('success', 'Anggota struktur berhasil diperbarui.');
    }

    public function destroyStruktur($id)
    {
        $struktur = StrukturOrganisasi::findOrFail($id);
        if ($struktur->foto_profil && Storage::disk('public')->exists('uploads/struktur/' . $struktur->foto_profil)) {
            Storage::disk('public')->delete('uploads/struktur/' . $struktur->foto_profil);
        }
        $struktur->delete();

        return redirect()->back()->with('success', 'Anggota struktur berhasil dihapus.');
    }
}
