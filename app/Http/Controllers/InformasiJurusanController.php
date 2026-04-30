<?php

namespace App\Http\Controllers;

use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InformasiJurusanController extends Controller
{
    /**
     * PUBLIC
     * Menampilkan berdasarkan urutan ID
     */
    public function index(Request $request)
    {
        $query = Jurusan::query();

        // FILTER SEARCH
        if ($request->filled('search')) {
            $term = $request->search;

            $query->where(function ($q) use ($term) {
                $q->where('jurusan', 'like', "%{$term}%")
                    ->orWhere('deskripsi', 'like', "%{$term}%")
                    ->orWhere('prospek_kerja', 'like', "%{$term}%");
            });
        }

        // URUT BERDASARKAN ID (lama ke baru)
        $jurusan = $query
            ->orderBy('id_jurusan', 'asc')
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('InformasiJurusan/Index', [
            'jurusan' => $jurusan,
            'filters' => $request->only(['search']),
        ]);
    }

    // ==================== CRUD (Admin) ====================

    public function crudIndex(Request $request)
    {
        $query = Jurusan::query();

        // FILTER SEARCH
        if ($request->filled('search')) {
            $term = $request->search;

            $query->where(function ($q) use ($term) {
                $q->where('jurusan', 'like', "%{$term}%")
                    ->orWhere('deskripsi', 'like', "%{$term}%")
                    ->orWhere('prospek_kerja', 'like', "%{$term}%");
            });
        }

        // TERBARU PALING ATAS
        $jurusan = $query
            ->orderBy('id_jurusan', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Jurusan/Index', [
            'jurusan' => $jurusan,
            'filters' => $request->only(['search']),
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
            'deskripsi' => 'required|string',
            'prospek_kerja' => 'required|string',
            'gambar1' => 'required|image|max:2048',
            'gambar2' => 'required|image|max:2048',
        ]);

        $data = $request->only([
            'jurusan',
            'deskripsi',
            'prospek_kerja'
        ]);

        if ($request->hasFile('gambar1')) {
            $path = $request->file('gambar1')
                ->store('uploads/jurusan', 'public');

            $data['gambar1'] = basename($path);
        }

        if ($request->hasFile('gambar2')) {
            $path = $request->file('gambar2')
                ->store('uploads/jurusan', 'public');

            $data['gambar2'] = basename($path);
        }

        Jurusan::create($data);

        return redirect()
            ->route('admin.jurusan.index')
            ->with('success', 'Jurusan berhasil ditambahkan!');
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
            'deskripsi' => 'required|string',
            'prospek_kerja' => 'required|string',
            'gambar1' => 'nullable|image|max:2048',
            'gambar2' => 'nullable|image|max:2048',
        ]);

        $data = $request->only([
            'jurusan',
            'deskripsi',
            'prospek_kerja'
        ]);

        if ($request->hasFile('gambar1')) {
            $path = $request->file('gambar1')
                ->store('uploads/jurusan', 'public');

            $data['gambar1'] = basename($path);
        }

        if ($request->hasFile('gambar2')) {
            $path = $request->file('gambar2')
                ->store('uploads/jurusan', 'public');

            $data['gambar2'] = basename($path);
        }

        $jurusan->update($data);

        return redirect()
            ->route('admin.jurusan.index')
            ->with('success', 'Jurusan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $jurusan = Jurusan::findOrFail($id);

        if ($jurusan->alumni()->count() > 0) {
            return redirect()
                ->route('admin.jurusan.index')
                ->with(
                    'error',
                    'Jurusan tidak dapat dihapus karena masih memiliki data alumni terkait.'
                );
        }

        if ($jurusan->lowker()->count() > 0) {
            return redirect()
                ->route('admin.jurusan.index')
                ->with(
                    'error',
                    'Jurusan tidak dapat dihapus karena masih memiliki data lowongan kerja terkait.'
                );
        }

        $jurusan->delete();

        return redirect()
            ->route('admin.jurusan.index')
            ->with('success', 'Jurusan berhasil dihapus!');
    }
}