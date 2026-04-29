<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Alumni;
use App\Models\Jurusan;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TracerStudyController extends Controller
{
    public function index(Request $request)
    {
        $wibNow = Carbon::now('Asia/Jakarta')->locale('id');
        $year = (int) $wibNow->format('Y');
        $month = (int) $wibNow->format('n');
        $periodStartYear = $month >= 7 ? $year : $year - 1;
        $periodEndYear = $periodStartYear + 1;

        $selectedCode = strtoupper((string) $request->query('jurusan', ''));
        $codeAliases = [
            'RPL' => ['Rekayasa Perangkat Lunak (RPL)'],
            'TKI' => ['Teknik Kimia Industri (TKI)'],
            'TKJ' => ['Teknik Komputer dan Jaringan (TKJ)'],
            'ANM' => ['Animasi'],
            'BR' => ['Broadcasting'],
            'ULW' => ['Usaha Layanan Wisata (ULW)'],
            'AKL' => ['Akuntansi & Keuangan Lembaga (AKL)'],
            'MPLB' => ['Manajemen Perkantoran dan Layanan Bisnis'],
            'BD' => ['Bisnis Digital (BD)'],
            'DKV' => ['Desain Komunikasi Visual (DKV)'],
        ];

        $alumniQuery = Alumni::with('jurusan');
        if ($selectedCode && isset($codeAliases[$selectedCode])) {
            $aliases = $codeAliases[$selectedCode];
            $alumniQuery->whereHas('jurusan', function ($q) use ($aliases) {
                $q->whereIn('jurusan', $aliases);
            });
        }

        $alumni = $alumniQuery->orderBy('nama')->get();
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
        ])
            ->orderBy('jurusan')
            ->get();

        $latestSurveys = Survey::whereIn('id_alumni', $alumni->pluck('id'))
            ->orderBy('tgl_dibuat', 'desc')
            ->get()
            ->groupBy('id_alumni')
            ->map(fn ($items) => $items->first());

        $rows = $alumni->values()->map(function ($a, $idx) use ($latestSurveys, $wibNow) {
            $survey = $latestSurveys->get($a->id);
            $tanggalWib = null;
            $surveyLabelMap = [
                'bekerja' => 'Bekerja',
                'wirausaha' => 'Wirausaha',
                'menganggur' => 'Menganggur',
                'magang' => 'Magang',
                'kuliah' => 'Kuliah',
            ];

            if ($survey?->tgl_dibuat) {
                try {
                    $tanggalWib = Carbon::parse($survey->tgl_dibuat, 'Asia/Jakarta')
                        ->setTimezone('Asia/Jakarta')
                        ->locale('id');
                } catch (\Throwable $e) {
                    $tanggalWib = null;
                }
            }

            $surveyMasihBerlaku = $tanggalWib
                ? $tanggalWib->copy()->addMonths(6)->greaterThanOrEqualTo($wibNow)
                : false;

            return [
                'no' => $idx + 1,
                'id_alumni' => $a->id,
                'nama' => $a->nama,
                'jurusan' => $a->jurusan?->jurusan ?? '-',
                'status_survey' => $surveyMasihBerlaku ? 'Sudah Mengisi' : 'Belum Mengisi',
                'status_color' => $surveyMasihBerlaku ? 'success' : 'danger',
                'tanggal_survey' => ($tanggalWib && $surveyMasihBerlaku)
                    ? $tanggalWib->translatedFormat('d M Y, H:i') . ' WIB'
                    : '-',
                'tanggal_survey_relative' => ($tanggalWib && $surveyMasihBerlaku)
                    ? $tanggalWib->diffForHumans(Carbon::now('Asia/Jakarta'))
                    : null,
                'survey_detail' => ($survey && $surveyMasihBerlaku) ? [
                    'pilihan' => $surveyLabelMap[$survey->pilihan_survey] ?? ($survey->pilihan_survey ?: '-'),
                    'kritiksaran' => $survey->kritiksaran ?: '-',
                ] : null,
            ];
        });

        return Inertia::render('TracerStudy/Index', [
            'rows' => $rows,
            'jurusan' => $jurusan,
            'filters' => [
                'jurusan' => $selectedCode,
            ],
            'summary' => [
                'periode_label' => "{$periodStartYear}/{$periodEndYear}",
                'generated_at_wib' => $wibNow->translatedFormat('l, d F Y H:i:s') . ' WIB',
                'total_alumni' => $rows->count(),
                'sudah_mengisi' => $rows->where('status_survey', 'Sudah Mengisi')->count(),
                'belum_mengisi' => $rows->where('status_survey', 'Belum Mengisi')->count(),
            ],
        ]);
    }
}
