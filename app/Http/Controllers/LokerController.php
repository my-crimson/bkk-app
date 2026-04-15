<?php

namespace App\Http\Controllers;

use App\Models\Lowker;
use App\Models\Perusahaan;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LokerController extends Controller
{
    // Public: list lowongan
    public function index(Request $request)
    {
        $query = Lowker::with(['perusahaan', 'jurusan']);

        if ($request->filled('jurusan')) {
            $query->whereHas('jurusan', function ($q) use ($request) {
                $q->where('jurusan', 'like', '%' . $request->jurusan . '%');
            });
        }

        if ($request->filled('lokasi')) {
            $query->where('lokasi', 'like', '%' . $request->lokasi . '%');
        }

        $lowker = $query->orderBy('tgl_posting', 'desc')->paginate(6)->withQueryString();
        $jurusanList = Jurusan::orderBy('jurusan')->pluck('jurusan');

        return Inertia::render('Loker/Index', [
            'lowker' => $lowker,
            'jurusanList' => $jurusanList,
            'filters' => $request->only(['jurusan', 'lokasi']),
        ]);
    }

    // Public: detail lowongan
    public function detail($id)
    {
        $lowker = Lowker::with(['perusahaan', 'jurusan'])->findOrFail($id);
        return Inertia::render('Loker/Detail', [
            'lowker' => $lowker,
        ]);
    }

    // Public: persyaratan
    public function persyaratan($id)
    {
        $lowker = Lowker::with(['perusahaan', 'jurusan'])->findOrFail($id);
        return Inertia::render('Loker/Persyaratan', [
            'lowker' => $lowker,
        ]);
    }

    // Admin CRUD: list
    public function crudIndex(Request $request)
    {
        $query = Lowker::with(['perusahaan', 'jurusan']);

        if ($request->filled('jurusan')) {
            $query->whereHas('jurusan', function ($q) use ($request) {
                $q->where('jurusan', 'like', '%' . $request->jurusan . '%');
            });
        }

        if ($request->filled('lokasi')) {
            $query->where('lokasi', 'like', '%' . $request->lokasi . '%');
        }

        $lowker = $query->orderBy('tgl_posting', 'desc')->paginate(6)->withQueryString();
        $jurusanList = Jurusan::orderBy('jurusan')->pluck('jurusan');

        return Inertia::render('Admin/Loker/Index', [
            'lowker' => $lowker,
            'jurusanList' => $jurusanList,
            'filters' => $request->only(['jurusan', 'lokasi']),
        ]);
    }

    // Admin: create form
    public function create()
    {
        $perusahaan = Perusahaan::orderBy('nama_perusahaan')->get();
        $jurusan = Jurusan::orderBy('jurusan')->get();
        return Inertia::render('Admin/Loker/Create', [
            'perusahaan' => $perusahaan,
            'jurusan' => $jurusan,
        ]);
    }

    // Admin: store
    public function store(Request $request)
    {
        $request->validate([
            'judul_lowker' => 'required|string|max:255',
            'id_perusahaan' => 'required|exists:perusahaan,id_perusahaan',
            'id_jurusan' => 'required|exists:jurusan,id_jurusan',
            'email' => 'required|email',
        ]);

        Lowker::create([
            'judul_lowker' => $request->judul_lowker,
            'deskripsi_lowker' => $request->deskripsi_lowker ?? $request->deskripsi,
            'kualifikasi' => $request->kualifikasi ?? $request->persyaratan,
            'gaji' => $request->gaji,
            'lokasi' => $request->lokasi,
            'tgl_posting' => $request->tgl_posting ?? now()->toDateString(),
            'tgl_ditutup' => $request->tgl_ditutup,
            'id_perusahaan' => $request->id_perusahaan,
            'id_jurusan' => $request->id_jurusan,
            'email' => $request->email,
            'pendidikan' => $request->pendidikan,
            'tipe_pekerjaan' => $request->tipe_pekerjaan,
            'keahlian' => $request->keahlian,
            'waktu_bekerja' => $request->waktu_bekerja,
            'tunjangan' => $request->tunjangan,
        ]);

        return redirect()->route('admin.loker.index')->with('success', 'Lowongan kerja berhasil ditambahkan!');
    }

    // Admin: edit form
    public function edit($id)
    {
        $lowker = Lowker::findOrFail($id);
        $perusahaan = Perusahaan::orderBy('nama_perusahaan')->get();
        $jurusan = Jurusan::orderBy('jurusan')->get();
        return Inertia::render('Admin/Loker/Edit', [
            'lowker' => $lowker,
            'perusahaan' => $perusahaan,
            'jurusan' => $jurusan,
        ]);
    }

    // Admin: update
    public function update(Request $request, $id)
    {
        $request->validate([
            'judul_lowker' => 'required|string|max:255',
            'id_perusahaan' => 'required|exists:perusahaan,id_perusahaan',
            'id_jurusan' => 'required|exists:jurusan,id_jurusan',
            'email' => 'required|email',
        ]);

        $lowker = Lowker::findOrFail($id);
        $lowker->update([
            'judul_lowker' => $request->judul_lowker,
            'deskripsi_lowker' => $request->deskripsi_lowker ?? $request->deskripsi,
            'kualifikasi' => $request->kualifikasi ?? $request->persyaratan,
            'gaji' => $request->gaji,
            'lokasi' => $request->lokasi,
            'tgl_posting' => $request->tgl_posting,
            'tgl_ditutup' => $request->tgl_ditutup,
            'id_perusahaan' => $request->id_perusahaan,
            'id_jurusan' => $request->id_jurusan,
            'email' => $request->email,
            'pendidikan' => $request->pendidikan,
            'tipe_pekerjaan' => $request->tipe_pekerjaan,
            'keahlian' => $request->keahlian,
            'waktu_bekerja' => $request->waktu_bekerja,
            'tunjangan' => $request->tunjangan,
        ]);

        return redirect()->route('admin.loker.index')->with('success', 'Lowongan kerja berhasil diperbarui!');
    }

    // Admin: delete
    public function destroy($id)
    {
        $lowker = Lowker::findOrFail($id);
        $lowker->delete();

        return redirect()->route('admin.loker.index')->with('success', 'Lowongan kerja berhasil dihapus!');
    }
}
