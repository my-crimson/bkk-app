<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h2 {
            color: #134CBC;
            border-bottom: 2px solid #134CBC;
            padding-bottom: 10px;
        }
        h3 {
            color: #134CBC;
            margin-top: 20px;
        }
        p {
            margin: 5px 0;
        }
        strong {
            color: #333;
        }
        hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 15px 0;
        }
        .footer {
            color: #666;
            font-size: 12px;
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>📋 Lamaran Pekerjaan Baru</h2>
        
        <p><strong>Lowongan:</strong> {{ $lowker->judul_lowker }}</p>
        <p><strong>Perusahaan:</strong> {{ $lowker->perusahaan->nama }}</p>
        
        <hr>
        
        <h3>👤 Data Pelamar</h3>
        <p><strong>Nama:</strong> {{ $alumni->nama }}</p>
        <p><strong>Email:</strong> {{ $alumni->email }}</p>
        <p><strong>WhatsApp:</strong> {{ $alumni->no_wa ?? 'N/A' }}</p>
        <p><strong>Alamat:</strong> {{ $alumni->alamat ?? 'N/A' }}</p>
        
        <hr>
        
        <h3>📝 Deskripsi Lowongan</h3>
        <p>{!! nl2br($lowker->deskripsi_lowker) !!}</p>
        
        <hr>
        
        <h3>✓ Persyaratan</h3>
        <p>{!! nl2br($lowker->kualifikasi) !!}</p>
        
        <hr>
        
        <div class="footer">
            <p>📎 Surat lamaran (CV) terlampir dalam email ini.</p>
        </div>
    </div>
</body>
</html>
