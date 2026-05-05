<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\PasswordResetRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ForgotPasswordController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nisn' => 'required|string',
        ]);

        // Check operational hours (07:00 - 16:00 WIB)
        $now = Carbon::now('Asia/Jakarta');
        $minutesNow = ($now->hour * 60) + $now->minute;
        $startMinutes = 7 * 60;  // 07:00
        $endMinutes = 16 * 60;   // 16:00

        if ($minutesNow < $startMinutes || $minutesNow > $endMinutes) {
            return response()->json([
                'success' => false,
                'message' => 'Fitur reset password via website hanya tersedia pada jam operasional (07:00 - 16:00 WIB). Silakan hubungi admin via WhatsApp.',
            ], 422);
        }

        // Find alumni by NISN
        $alumni = Alumni::where('nisn', $request->nisn)->first();

        if (!$alumni) {
            return response()->json([
                'success' => false,
                'message' => 'NISN tidak ditemukan dalam sistem.',
            ], 404);
        }

        // Check for existing pending request
        $existing = PasswordResetRequest::where('id_alumni', $alumni->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Permintaan reset password Anda sudah dikirim dan sedang menunggu konfirmasi admin.',
            ], 422);
        }

        // Create new request
        PasswordResetRequest::create([
            'id_alumni' => $alumni->id,
            'status' => 'pending',
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan reset password berhasil dikirim! Admin akan segera memprosesnya.',
        ]);
    }
}
