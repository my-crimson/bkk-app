<?php

namespace App\Http\Controllers;

use App\Models\Lamaran;
use App\Models\Lowker;
use App\Models\Alumni;
use App\Mail\LamaranSuratMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class LamaranController extends Controller
{
    public function store(Request $request)
    {
        // Debug: Check session
        \Log::info('Lamaran store request', [
            'session_user_id' => session('user_id'),
            'session_role' => session('role'),
            'request_id_lowker' => $request->id_lowker,
        ]);

        // Get user ID from session
        $alumni_id = session('user_id');
        
        if (!$alumni_id) {
            return back()->with('error', 'Anda harus login terlebih dahulu untuk melamar. Session tidak ditemukan.');
        }

        // Validate request
        $request->validate([
            'id_lowker' => 'required|exists:lowker,id_lowker',
            'file_lamaran' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
        ]);

        // Check if lowongan has expired
        $lowker = Lowker::with('perusahaan')->findOrFail($request->id_lowker);
        if ($lowker->tgl_ditutup && \Carbon\Carbon::parse($lowker->tgl_ditutup)->lt(now()->startOfDay())) {
            return back()->with('error', 'Lowongan ini sudah ditutup dan tidak dapat dilamar lagi.');
        }

        // Check if already applied
        $existing = Lamaran::where('id_alumni', $alumni_id)
            ->where('id_lowker', $request->id_lowker)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah pernah melamar ke lowongan ini.');
        }

        // Get alumni data with jurusan relation
        $alumni = Alumni::with('jurusan')->findOrFail($alumni_id);

        // Upload file
        $file = $request->file('file_lamaran');
        $filename = time() . '_' . $alumni_id . '_' . $file->getClientOriginalName();
        
        try {
            Storage::disk('public')->putFileAs('uploads/lamaran', $file, $filename);
            \Log::info('File uploaded successfully', ['filename' => $filename]);
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengunggah file. Silakan coba lagi. ' . $e->getMessage());
        }

        // Create lamaran record
        try {
            Lamaran::create([
                'id_alumni' => $alumni_id,
                'id_lowker' => $request->id_lowker,
                'tanggal_lamaran' => now()->toDateString(),
                'surat_lamaran' => $filename,
            ]);
            \Log::info('Lamaran record created', ['id_alumni' => $alumni_id, 'id_lowker' => $request->id_lowker]);
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menyimpan lamaran. ' . $e->getMessage());
        }

        // Send email to company
        try {
            $emailTo = null;
            
            // Priority 1: Email dari perusahaan (yang paling penting!)
            if ($lowker->perusahaan && $lowker->perusahaan->email) {
                $emailTo = $lowker->perusahaan->email;
            }
            // Priority 2: Email dari lowker table (jika perusahaan tidak punya)
            elseif ($lowker->email) {
                $emailTo = $lowker->email;
            }
            
            if ($emailTo) {
                \Log::info('Sending email to: ' . $emailTo);
                Mail::to($emailTo)->send(new LamaranSuratMail($lowker, $alumni, $filename));
                \Log::info('Email sent successfully', ['email' => $emailTo]);
            } else {
                \Log::warning('No email found for company');
            }
        } catch (\Exception $e) {
            \Log::error('Error sending email: ' . $e->getMessage());
            \Log::error('Exception: ' . get_class($e) . ' at ' . $e->getFile() . ':' . $e->getLine());
        }

        return redirect()->route('loker')->with('success', 'Lamaran Anda berhasil dikirim! Email telah dikirim ke perusahaan.');
    }

    public function download($id)
    {
        $lamaran = Lamaran::findOrFail($id);

        if (!$lamaran->surat_lamaran) {
            abort(404, 'File tidak ditemukan.');
        }

        $path = storage_path('app/public/uploads/lamaran/' . $lamaran->surat_lamaran);

        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($path);
    }
}
