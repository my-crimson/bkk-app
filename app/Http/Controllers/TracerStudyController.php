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

        $selectedJurusan = $request->query('jurusan');

        $alumniQuery = Alumni::with('jurusan');
        if ($selectedJurusan) {
            $alumniQuery->whereHas('jurusan', function ($q) use ($selectedJurusan) {
                $q->where('jurusan', $selectedJurusan);
            });
        }

        $alumni = $alumniQuery->orderBy('nama')->get();
        $jurusan = Jurusan::orderBy('jurusan')->get();

        $latestSurveys = Survey::whereIn('id_alumni', $alumni->pluck('id'))
            ->orderBy('tgl_dibuat', 'desc')
            ->get()
            ->groupBy('id_alumni')
            ->map(fn ($items) => $items->first());

        $rows = $alumni->values()->map(function ($a, $idx) use ($latestSurveys) {
            $survey = $latestSurveys->get($a->id);
            $tanggalWib = null;

            if ($survey?->tgl_dibuat) {
                try {
                    $tanggalWib = Carbon::parse($survey->tgl_dibuat, 'Asia/Jakarta')
                        ->setTimezone('Asia/Jakarta')
                        ->locale('id');
                } catch (\Throwable $e) {
                    $tanggalWib = null;
                }
            }

            return [
                'no' => $idx + 1,
                'id_alumni' => $a->id,
                'nama' => $a->nama,
                'jurusan' => $a->jurusan?->jurusan ?? '-',
                'status_survey' => $survey ? 'Sudah Mengisi' : 'Belum Mengisi',
                'status_color' => $survey ? 'success' : 'danger',
                'tanggal_survey' => $tanggalWib
                    ? $tanggalWib->translatedFormat('d M Y, H:i') . ' WIB'
                    : '-',
                'tanggal_survey_relative' => $tanggalWib
                    ? $tanggalWib->diffForHumans(Carbon::now('Asia/Jakarta'))
                    : null,
            ];
        });

        return Inertia::render('TracerStudy/Index', [
            'rows' => $rows,
            'jurusan' => $jurusan,
            'filters' => [
                'jurusan' => $selectedJurusan,
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
