<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\Lowker;
use App\Models\Lamaran;
use App\Models\Perusahaan;
use App\Models\Survey;
use Inertia\Inertia;

class ManagementController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_alumni' => Alumni::count(),
            'total_lowker' => Lowker::count(),
            'total_lamaran' => Lamaran::count(),
            'total_perusahaan' => Perusahaan::count(),
            'total_survey' => Survey::count(),
        ];

        return Inertia::render('Management/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
