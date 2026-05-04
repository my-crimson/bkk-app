<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\Alumni;
use App\Models\Jurusan;
use App\Models\PasswordResetRequest;
use App\Imports\AlumniImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class AlumniController extends Controller
{
    public function index(Request $request)
    {
        $query = Alumni::with('jurusan');

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        // Filter tahun lulus
        if ($tahunLulus = $request->input('tahun_lulus')) {
            $query->where('tahun_lulus', $tahunLulus);
        }

        // Filter jurusan
        if ($jurusan = $request->input('jurusan')) {
            $query->where('id_jurusan', $jurusan);
        }

        $alumni = $query->orderBy('nama', 'asc')->paginate(15)->withQueryString();
        $jurusanList = Jurusan::all();
        $management_users = \App\Models\User::whereIn('role', ['management', 'admin'])->get();

        return Inertia::render('Management/Alumni/Index', [
            'alumni' => $alumni,
            'jurusanList' => $jurusanList,
            'management_users' => $management_users,
            'filters' => $request->only(['search', 'tahun_lulus', 'jurusan']),
        ]);
    }

    public function create()
    {
        $jurusanList = Jurusan::all();
        return Inertia::render('Management/Alumni/Create', [
            'jurusanList' => $jurusanList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'          => 'required|string|max:100',
            'nisn'          => 'required|string|max:255|unique:alumni,nisn',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir'  => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'nik'           => 'required|string|max:255',
            'agama'         => 'required|string|max:11',
            'alamat'        => 'required|string',
            'tahun_lulus'   => 'required|string|max:4',
            'id_jurusan'    => 'required|exists:jurusan,id_jurusan',
            'rt'            => 'required|integer',
            'rw'            => 'required|integer',
            'dusun'         => 'required|string|max:100',
            'kelurahan'     => 'required|string|max:100',
            'kecamatan'     => 'required|string|max:100',
            'kode_pos'      => 'required|integer',
            'email'         => 'required|email|max:100',
            'no_wa'         => 'required|string|max:15',
        ]);

        $data = $request->all();
        $data['password'] = $data['nisn']; // Default password = NISN
        $data['password_changed'] = false;

        Alumni::create($data);

        return redirect()->route('management.alumni.index')->with('success', 'Siswa/Alumni berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $alumni = Alumni::findOrFail($id);
        $jurusanList = Jurusan::all();
        return Inertia::render('Management/Alumni/Edit', [
            'alumni' => $alumni,
            'jurusanList' => $jurusanList,
        ]);
    }

    public function update(Request $request, $id)
    {
        $alumni = Alumni::findOrFail($id);

        $request->validate([
            'nama'          => 'required|string|max:100',
            'nisn'          => 'required|string|max:255|unique:alumni,nisn,' . $id,
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir'  => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'nik'           => 'required|string|max:255',
            'agama'         => 'required|string|max:11',
            'alamat'        => 'required|string',
            'tahun_lulus'   => 'required|string|max:4',
            'id_jurusan'    => 'required|exists:jurusan,id_jurusan',
            'rt'            => 'required|integer',
            'rw'            => 'required|integer',
            'dusun'         => 'required|string|max:100',
            'kelurahan'     => 'required|string|max:100',
            'kecamatan'     => 'required|string|max:100',
            'kode_pos'      => 'required|integer',
            'email'         => 'required|email|max:100',
            'no_wa'         => 'required|string|max:15',
        ]);

        $alumni->update($request->only([
            'nama', 'nisn', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
            'nik', 'agama', 'alamat', 'tahun_lulus', 'id_jurusan',
            'rt', 'rw', 'dusun', 'kelurahan', 'kecamatan', 'kode_pos',
            'email', 'no_wa',
        ]));

        return redirect()->route('management.alumni.index')->with('success', 'Data siswa/alumni berhasil diperbarui.');
    }

    public function destroy($id)
    {
        // Delete related records first to avoid foreign key constraints
        \App\Models\Lamaran::where('id_alumni', $id)->delete();
        \App\Models\Survey::where('id_alumni', $id)->delete();
        \App\Models\PasswordResetRequest::where('id_alumni', $id)->delete();

        Alumni::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Siswa/Alumni berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:alumni,id',
        ]);

        // Delete related records first to avoid foreign key constraints
        \App\Models\Lamaran::whereIn('id_alumni', $request->ids)->delete();
        \App\Models\Survey::whereIn('id_alumni', $request->ids)->delete();
        \App\Models\PasswordResetRequest::whereIn('id_alumni', $request->ids)->delete();

        $count = Alumni::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', "{$count} data siswa/alumni berhasil dihapus.");
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
            'tahun_lulus' => 'required|string|max:4',
        ]);

        $file = $request->file('file');
        \Log::info("User uploaded file: " . $file->getClientOriginalName());
        
        $import = new AlumniImport($request->tahun_lulus);
        Excel::import($import, $file);

        $imported = $import->getImportedCount();
        $skipped = $import->getSkippedCount();
        $failedRows = $import->getFailedRows();

        if (count($failedRows) > 0) {
            $errorDetail = implode(' | ', array_slice($failedRows, 0, 3));
            $msg = "Berhasil mengimpor {$imported} data.";
            if ($skipped > 0) {
                $msg .= " {$skipped} dilewati (NISN sudah ada).";
            }
            $msg .= " " . count($failedRows) . " baris gagal: " . $errorDetail;
            return redirect()->back()->with('warning', $msg);
        }

        if ($imported == 0 && $skipped == 0) {
            return redirect()->back()->withErrors(['file' => 'Tidak ada data yang diimpor. Pastikan format kolom sesuai dengan template dan data tidak kosong.']);
        }

        $msg = "Berhasil mengimpor {$imported} data siswa/alumni.";
        if ($skipped > 0) {
            $msg .= " ({$skipped} data dilewati karena NISN sudah ada)";
        }

        return redirect()->back()->with('success', $msg);
    }

    public function downloadTemplate()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $headers = [
            'nama', 'nisn', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
            'nik', 'agama', 'alamat', 'jurusan',
            'rt', 'rw', 'dusun', 'kelurahan', 'kecamatan', 'kode_pos',
            'email', 'no_wa',
        ];

        foreach ($headers as $i => $header) {
            $col = chr(65 + $i); // A, B, C, ...
            $sheet->setCellValue("{$col}1", $header);
            $sheet->getColumnDimension($col)->setAutoSize(true);
            $sheet->getStyle("{$col}1")->getFont()->setBold(true);
        }

        // Sample row
        $randomNisn = rand(1000000000, 9999999999);
        $randomNik = rand(1000000000000000, 9999999999999999);
        $sample = [
            'Siswa Testing', (string)$randomNisn, 'L', 'Tulungagung', '2006-01-15',
            (string)$randomNik, 'Islam', 'Jl. Raya No 1', 'Teknik Komputer dan Jaringan (TKJ)',
            '1', '2', 'Dusun A', 'Kelurahan B', 'Boyolangu', '66234',
            'testing@email.com', '081234567890',
        ];

        foreach ($sample as $i => $val) {
            $col = chr(65 + $i);
            $sheet->setCellValue("{$col}2", $val);
        }

        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'template_alumni_');
        $writer->save($tempFile);

        return response()->download($tempFile, 'template_import_alumni.xlsx')->deleteFileAfterSend(true);
    }

    public function resetPassword($id)
    {
        $alumni = Alumni::findOrFail($id);
        $alumni->update([
            'password' => $alumni->nisn,
            'password_changed' => false,
        ]);

        // Resolve any pending reset requests for this alumni
        PasswordResetRequest::where('id_alumni', $id)
            ->where('status', 'pending')
            ->update([
                'status' => 'resolved',
                'resolved_at' => now(),
            ]);

        return redirect()->back()->with('success', "Password {$alumni->nama} berhasil direset ke NISN.");
    }

    // === Notification endpoints ===
    public function notifications()
    {
        // Auto-cleanup: hapus notifikasi yang sudah lebih dari 24 jam
        PasswordResetRequest::where('created_at', '<', now()->subHours(24))->delete();

        $notifs = PasswordResetRequest::with('alumni')
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json($notifs);
    }

    public function resolveNotification($id)
    {
        $request = PasswordResetRequest::with('alumni')->findOrFail($id);

        // Reset the alumni password
        $alumni = $request->alumni;
        $alumni->update([
            'password' => $alumni->nisn,
            'password_changed' => false,
        ]);

        $request->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => "Password {$alumni->nama} berhasil direset."]);
    }

    public function pendingCount()
    {
        $count = PasswordResetRequest::where('status', 'pending')->count();
        return response()->json(['count' => $count]);
    }
}
