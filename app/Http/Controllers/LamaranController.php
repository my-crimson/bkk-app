<?php

namespace App\Http\Controllers;

use App\Models\Lamaran;
use Illuminate\Support\Facades\Storage;

class LamaranController extends Controller
{
    public function download($id)
    {
        $lamaran = Lamaran::findOrFail($id);

        if (!$lamaran->file_lamaran) {
            abort(404, 'File tidak ditemukan.');
        }

        $path = storage_path('app/public/uploads/lamaran/' . $lamaran->file_lamaran);

        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($path);
    }
}
