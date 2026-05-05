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
        $alumniQuery = Alumni::with('jurusan')->orderBy('nama');
        $alumni = $alumniQuery->paginate(50);
        $jurusan = Jurusan::whereIn('jurusan', [
            'Rekayasa Perangkat Lunak (RPL)',
            'Teknik Kimia Industri (TKI)',
            'Teknik Komputer dan Jaringan (TKJ)',
            'Animasi',
            'Broadcasting',
            'Usaha Layanan Wisata (ULW)',
            'Akuntansi & Keuangan Lembaga (AKL)',
            'Manajemen Perkantoran dan Layanan Bisnis',
            'Bisnis Digital (BD)',
            'Desain Komunikasi Visual (DKV)',
        ])->get();

        return Inertia::render('Rekap/Alumni', [
            'alumni' => $alumni,
            'jurusan' => $jurusan,
            'summary' => [
                'total_alumni' => $alumniQuery->count(),
            ],
        ]);
    }

    public function loker(Request $request)
    {
        $allowedCodes = ['RPL', 'TKI', 'TKJ', 'ANM', 'BR', 'ULW', 'AKL', 'MPLB', 'BD', 'DKV'];
        $codeAliases = [
            'RPL' => ['REKAYASA PERANGKAT LUNAK (RPL)'],
            'TKI' => ['TEKNIK KIMIA INDUSTRI (TKI)'],
            'TKJ' => ['TEKNIK KOMPUTER DAN JARINGAN (TKJ)'],
            'ANM' => ['ANIMASI'],
            'BR' => ['BROADCASTING'],
            'ULW' => ['USAHA LAYANAN WISATA (ULW)'],
            'AKL' => ['AKUNTANSI & KEUANGAN LEMBAGA (AKL)'],
            'MPLB' => ['MANAJEMEN PERKANTORAN DAN LAYANAN BISNIS'],
            'BD' => ['BISNIS DIGITAL (BD)'],
            'DKV' => ['DESAIN KOMUNIKASI VISUAL (DKV)'],
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
                'chart_perusahaan' => $lowker
                    ->groupBy(fn ($item) => $item->perusahaan->nama ?? '-')
                    ->map(fn ($items, $name) => ['label' => $name, 'value' => $items->count()])
                    ->sortByDesc('value')
                    ->take(8)
                    ->values(),
                'chart_lokasi' => $lowker
                    ->groupBy(fn ($item) => $item->lokasi ?? '-')
                    ->map(fn ($items, $name) => ['label' => $name, 'value' => $items->count()])
                    ->sortByDesc('value')
                    ->take(8)
                    ->values(),
            ],
        ]);
    }
}
