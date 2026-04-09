<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #134CBC; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .section { margin: 20px 0; }
        .section h3 { color: #134CBC; margin-bottom: 10px; }
        .field { margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lamaran Masuk</h1>
        </div>
        
        <div class="content">
            <p>Anda menerima lamaran baru untuk posisi <strong>{{ $lowker->judul_lowker }}</strong></p>
            
            <div class="section">
                <h3>Data Pelamar</h3>
                <div class="field"><strong>Nama:</strong> {{ $alumni->nama }}</div>
                <div class="field"><strong>Email:</strong> {{ $alumni->email }}</div>
                <div class="field"><strong>No. WhatsApp:</strong> {{ $alumni->no_wa ?? '-' }}</div>
                <div class="field"><strong>NISN:</strong> {{ $alumni->nisn ?? '-' }}</div>
                <div class="field"><strong>Alamat:</strong> {{ $alumni->alamat ?? '-' }}</div>
            </div>
            
            <div class="section">
                <h3>Informasi Lowongan</h3>
                <div class="field"><strong>Posisi:</strong> {{ $lowker->judul_lowker }}</div>
                <div class="field"><strong>Tanggal Posting:</strong> {{ $lowker->tgl_posting }}</div>
                <div class="field"><strong>Tanggal Ditutup:</strong> {{ $lowker->tgl_ditutup }}</div>
            </div>
            
            <p style="border-top: 1px solid #ccc; padding-top: 20px;">
                File lampiran surat lamaran tersedia di email ini.
            </p>
        </div>
        
        <div class="footer">
            <p>Tim BKK - Sistem Informasi Bursa Kerja Khusus</p>
        </div>
    </div>
</body>
</html>
