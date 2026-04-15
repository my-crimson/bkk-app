<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f6f9;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: #134CBC;
            color: white;
            padding: 25px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .intro {
            background: #f0f4ff;
            border-left: 4px solid #134CBC;
            padding: 12px 16px;
            margin-bottom: 25px;
            border-radius: 0 4px 4px 0;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h3 {
            color: #134CBC;
            margin: 0 0 12px;
            font-size: 16px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
        }
        .field {
            margin: 8px 0;
            font-size: 14px;
        }
        .field strong {
            display: inline-block;
            min-width: 140px;
            color: #555;
        }
        .footer {
            text-align: center;
            padding: 20px 30px;
            background: #f9f9f9;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Lamaran Pekerjaan Baru</h1>
            <p>Sistem BKK - Bursa Kerja Khusus</p>
        </div>

        <div class="content">
            <div class="intro">
                Anda menerima lamaran baru untuk posisi <strong>{{ $lowker->judul_lowker }}</strong>.
            </div>

            <div class="section">
                <h3>👤 Data Pelamar</h3>
                <div class="field"><strong>Nama:</strong> {{ $alumni->nama ?? '-' }}</div>
                <div class="field"><strong>Email:</strong> {{ $alumni->email ?? '-' }}</div>
                <div class="field"><strong>No. HP / WA:</strong> {{ $alumni->no_wa ?? '-' }}</div>
            </div>
        </div>

        <div class="footer">
            <p>📎 File surat lamaran / CV pelamar terlampir dalam email ini.</p>
            <p>Email ini dikirim otomatis oleh Sistem BKK.</p>
        </div>
    </div>
</body>
</html>
