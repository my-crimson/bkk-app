<?php

use Illuminate\Support\Facades\Route;
use App\Models\Lowker;
use App\Models\Alumni;
use App\Mail\LamaranSuratMail;
use Illuminate\Support\Facades\Mail;

Route::get('/test-email', function () {
    $lowker = Lowker::with('perusahaan')->first();
    $alumni = Alumni::first();
    
    if (!$lowker || !$alumni) {
        return response('Lowker atau Alumni tidak ditemukan', 400);
    }
    
    $result = [
        'lowker_id' => $lowker->id_lowker,
        'lowker_title' => $lowker->judul_lowker,
        'lowker_email' => $lowker->email,
        'perusahaan_name' => $lowker->perusahaan->nama,
        'perusahaan_email' => $lowker->perusahaan->email,
        'alumni_name' => $alumni->nama,
        'alumni_email' => $alumni->email,
    ];
    
    // Determine target email
    $emailTo = $lowker->email ?: $lowker->perusahaan->email;
    
    if (!$emailTo) {
        $result['status'] = 'ERROR: No email found';
        return response()->json($result, 400);
    }
    
    try {
        Mail::to($emailTo)->send(new LamaranSuratMail($lowker, $alumni, 'test_file.pdf'));
        $result['status'] = 'SUCCESS: Email sent to ' . $emailTo;
        $result['sent_to'] = $emailTo;
    } catch (\Exception $e) {
        $result['status'] = 'ERROR: ' . $e->getMessage();
        $result['exception'] = get_class($e);
    }
    
    return response()->json($result);
});

?>
