<?php

namespace App\Http\Controllers;

use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InformasiJurusanController extends Controller
{
    /**
     * Public page — show all jurusan that have descriptions
     */
    public function index()
    {
        $jurusan = Jurusan::orderBy('jurusan')->get();

        return Inertia::render('InformasiJurusan/Index', [
            'jurusan' => $jurusan,
        ]);
    }

    // ==================== CRUD (Admin) ====================

    public function crudIndex()
    {
        $jurusan = Jurusan::orderBy('jurusan')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Jurusan/Index', [
            'jurusan' => $jurusan,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Jurusan/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'jurusan' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'prospek_kerja' => 'nullable|string',
            'gambar1' => 'nullable|image|max:2048',
            'gambar2' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['jurusan', 'deskripsi', 'prospek_kerja']);

        if ($request->hasFile('gambar1')) {
            $path = $request->file('gambar1')->store('uploads/jurusan', 'public');
            $data['gambar1'] = basename($path);
        }

        if ($request->hasFile('gambar2')) {
            $path = $request->file('gambar2')->store('uploads/jurusan', 'public');
            $data['gambar2'] = basename($path);
        }

        Jurusan::create($data);

        return redirect()->route('admin.jurusan.index')->with('success', 'Jurusan berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $jurusan = Jurusan::findOrFail($id);

        return Inertia::render('Admin/Jurusan/Edit', [
            'jurusan' => $jurusan,
        ]);
    }

    public function update(Request $request, $id)
    {
        $jurusan = Jurusan::findOrFail($id);

        $request->validate([
            'jurusan' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'prospek_kerja' => 'nullable|string',
            'gambar1' => 'nullable|image|max:2048',
            'gambar2' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['jurusan', 'deskripsi', 'prospek_kerja']);

        if ($request->hasFile('gambar1')) {
            $path = $request->file('gambar1')->store('uploads/jurusan', 'public');
            $data['gambar1'] = basename($path);
        }

        if ($request->hasFile('gambar2')) {
            $path = $request->file('gambar2')->store('uploads/jurusan', 'public');
            $data['gambar2'] = basename($path);
        }

        $jurusan->update($data);

        return redirect()->route('admin.jurusan.index')->with('success', 'Jurusan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $jurusan = Jurusan::findOrFail($id);

        // Prevent delete if jurusan has alumni or lowker attached
        if ($jurusan->alumni()->count() > 0) {
            return redirect()->route('admin.jurusan.index')
                ->with('error', 'Jurusan tidak dapat dihapus karena masih memiliki data alumni terkait.');
        }

        if ($jurusan->lowker()->count() > 0) {
            return redirect()->route('admin.jurusan.index')
                ->with('error', 'Jurusan tidak dapat dihapus karena masih memiliki data lowongan kerja terkait.');
        }

        $jurusan->delete();

        return redirect()->route('admin.jurusan.index')->with('success', 'Jurusan berhasil dihapus!');
    }
}
