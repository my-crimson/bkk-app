<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyController extends Controller
{
    public function index()
    {
        $alumni = null;
        $alumniList = [];

        if (session('role') === 'alumni') {
            $alumni = Alumni::find(session('user_id'));
        } else {
            $alumniList = Alumni::orderBy('nama')->get(['id', 'nama']);
        }

        return Inertia::render('Survey/Index', [
            'alumni' => $alumni,
            'alumniList' => $alumniList,
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

        Survey::create([
            'id_alumni' => $alumniId,
            'pilihan_survey' => $request->survey_choice,
            'kritiksaran' => $request->description,
            'tgl_dibuat' => now()->toDateString(),
        ]);

        return back()->with('success', 'Terima kasih atas tanggapan Anda!');
    }
}
