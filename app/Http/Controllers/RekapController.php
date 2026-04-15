<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\Lowker;
use App\Models\Jurusan;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RekapController extends Controller
{
    public function alumni()
    {
        $alumni = Alumni::with('jurusan')->orderBy('nama')->get();
        $jurusan = Jurusan::all();
        return Inertia::render('Rekap/Alumni', [
            'alumni' => $alumni,
            'jurusan' => $jurusan,
        ]);
    }

    public function loker(Request $request)
    {
        $allowedCodes = ['RPL', 'TKJ', 'KI', 'DKV', 'ANM', 'AK', 'MP', 'BD', 'ULW', 'PSPT'];
        $codeAliases = [
            'RPL' => ['RPL', 'REKAYASA PERANGKAT LUNAK'],
            'TKJ' => ['TKJ', 'TEKNIK KOMPUTER DAN JARINGAN'],
            'KI' => ['KI', 'TKI', 'TEKNIK KIMIA INDUSTRI'],
            'DKV' => ['DKV', 'DESAIN KOMUNIKASI VISUAL'],
            'ANM' => ['ANM', 'ANIMASI'],
            'AK' => ['AK', 'AKUNTANSI'],
            'MP' => ['MP', 'MANAJEMEN PERKANTORAN'],
            'BD' => ['BD', 'BISNIS DIGITAL'],
            'ULW' => ['ULW', 'USAHA LAYANAN WISATA'],
            'PSPT' => ['PSPT', 'PERHOTELAN DAN LAYANAN PARIWISATA'],
        ];

        $selectedPerusahaan = $request->query('perusahaan');
        $selectedLokasi = $request->query('lokasi');
        $selectedKode = $request->query('jurusan');
        $selectedRange = $request->query('rentang', 'all');

        $query = Lowker::with(['perusahaan', 'jurusan']);

        if ($selectedPerusahaan) {
            $query->whereHas('perusahaan', fn ($q) => $q->where('nama', $selectedPerusahaan));
        }

        if ($selectedLokasi) {
            $query->where('lokasi', $selectedLokasi);
        }

        if ($selectedKode && in_array($selectedKode, $allowedCodes, true)) {
            $aliases = $codeAliases[$selectedKode] ?? [$selectedKode];
            $query->whereHas('jurusan', fn ($q) => $q->whereIn('jurusan', $aliases));
        }

        $nowWib = Carbon::now('Asia/Jakarta');
        if ($selectedRange === 'today') {
            $query->whereDate('tgl_posting', $nowWib->toDateString());
        } elseif ($selectedRange === '7d') {
            $query->whereDate('tgl_posting', '>=', $nowWib->copy()->subDays(7)->toDateString());
        } elseif ($selectedRange === '30d') {
            $query->whereDate('tgl_posting', '>=', $nowWib->copy()->subDays(30)->toDateString());
        }

        $lowker = $query->orderBy('tgl_posting', 'desc')->get();

        $cards = collect($allowedCodes)->map(function ($code) use ($lowker, $codeAliases) {
            $aliases = $codeAliases[$code] ?? [$code];
            $count = $lowker->filter(function ($item) use ($aliases) {
                $name = strtoupper(trim((string) ($item->jurusan->jurusan ?? '')));
                return in_array($name, array_map('strtoupper', $aliases), true);
            })->count();

            return [
                'kode' => $code,
                'jumlah_lowongan' => $count,
            ];
        });

        $perusahaanOptions = $lowker->pluck('perusahaan.nama')->filter()->unique()->sort()->values();
        $lokasiOptions = $lowker->pluck('lokasi')->filter()->unique()->sort()->values();

        return Inertia::render('Rekap/Loker', [
            'lowker' => $lowker,
            'cards' => $cards,
            'perusahaanOptions' => $perusahaanOptions,
            'lokasiOptions' => $lokasiOptions,
            'filters' => [
                'perusahaan' => $selectedPerusahaan,
                'lokasi' => $selectedLokasi,
                'jurusan' => $selectedKode,
                'rentang' => $selectedRange,
            ],
            'summary' => [
                'total_lowongan' => $lowker->count(),
                'total_perusahaan' => $lowker->pluck('perusahaan.id_perusahaan')->filter()->unique()->count(),
            ],
        ]);
    }
}
