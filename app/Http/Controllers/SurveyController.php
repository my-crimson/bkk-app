<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Alumni;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyController extends Controller
{
    public function index()
    {
        $alumni = null;
        $alumniList = [];
        $surveyStatus = null;

        if (session('role') === 'alumni') {
            $alumni = Alumni::find(session('user_id'));
            if ($alumni) {
                $latestSurvey = Survey::where('id_alumni', $alumni->id)
                    ->orderByDesc('tgl_dibuat')
                    ->first();

                $canSubmit = true;
                $nextSubmitAt = null;

                if ($latestSurvey?->tgl_dibuat) {
                    $lastSurveyDate = Carbon::parse($latestSurvey->tgl_dibuat, 'Asia/Jakarta')->startOfDay();
                    $nextSubmitAt = $lastSurveyDate->copy()->addMonths(6);
                    $canSubmit = Carbon::now('Asia/Jakarta')->greaterThanOrEqualTo($nextSubmitAt);
                }

                $surveyStatus = [
                    'can_submit' => $canSubmit,
                    'next_submit_at' => $nextSubmitAt ? $nextSubmitAt->toDateString() : null,
                    'next_submit_label' => $nextSubmitAt ? $nextSubmitAt->translatedFormat('d F Y') : null,
                ];
            }
        } else {
            $alumniList = Alumni::orderBy('nama')->get(['id', 'nama']);
        }

        return Inertia::render('Survey/Index', [
            'alumni' => $alumni,
            'alumniList' => $alumniList,
            'surveyStatus' => $surveyStatus,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'survey_choice' => 'required|in:bekerja,wirausaha,menganggur,magang,kuliah',
        ]);

        $alumniId = session('role') === 'alumni'
            ? session('user_id')
            : $request->input('alumni_id');

        if (!$alumniId) {
            return back()->with('error', 'Alumni ID is required to save survey data.');
        }

        $latestSurvey = Survey::where('id_alumni', $alumniId)
            ->orderByDesc('tgl_dibuat')
            ->first();

        if ($latestSurvey?->tgl_dibuat) {
            $lastSurveyDate = Carbon::parse($latestSurvey->tgl_dibuat, 'Asia/Jakarta')->startOfDay();
            $nextSubmitAt = $lastSurveyDate->copy()->addMonths(6);

            if (Carbon::now('Asia/Jakarta')->lt($nextSubmitAt)) {
                return back()->with('error', 'Survey baru dapat dikirim lagi pada ' . $nextSubmitAt->translatedFormat('d F Y') . '.');
            }
        }

        Survey::create([
            'id_alumni' => $alumniId,
            'pilihan_survey' => $request->survey_choice,
            'kritiksaran' => $request->description,
            'tgl_dibuat' => now()->toDateString(),
        ]);

        return back()->with('success', 'Terima kasih atas tanggapan Anda!');
    }
}
