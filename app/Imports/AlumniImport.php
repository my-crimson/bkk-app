<?php

namespace App\Imports;

use App\Models\Alumni;
use App\Models\Jurusan;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Log;

class AlumniImport implements ToArray, WithHeadingRow
{
    private $jurusanMap;
    private $tahunLulus;
    private $imported = 0;
    private $skipped = 0;
    private $failedRows = [];

    public function __construct($tahunLulus)
    {
        $this->tahunLulus = $tahunLulus;
        // Build jurusan lookup map (nama -> id)
        $this->jurusanMap = Jurusan::pluck('id_jurusan', 'jurusan')->toArray();
        Log::info("AlumniImport instantiated with tahunLulus: " . $tahunLulus);
    }

    private function findJurusanId($input)
    {
        $input = trim(strval($input));
        if (empty($input)) return null;

        $inputLower = strtolower($input);

        // 1. Exact match
        foreach ($this->jurusanMap as $nama => $id) {
            if (strtolower($nama) === $inputLower) {
                return $id;
            }
        }

        // 2. Substring match (e.g. "TKJ" is inside "Teknik Komputer dan Jaringan (TKJ)")
        foreach ($this->jurusanMap as $nama => $id) {
            if (strpos(strtolower($nama), $inputLower) !== false) {
                return $id;
            }
        }

        // 3. Keyword match (e.g. "Teknik Komputer" matches "Teknik Komputer dan Jaringan (TKJ)")
        $words = explode(' ', $inputLower);
        foreach ($this->jurusanMap as $nama => $id) {
            $namaLower = strtolower($nama);
            $matchCount = 0;
            foreach ($words as $word) {
                if (strlen($word) > 2 && strpos($namaLower, $word) !== false) {
                    $matchCount++;
                }
            }
            if ($matchCount > 0 && $matchCount >= count($words) / 2) {
                return $id;
            }
        }

        return null; // No match found
    }

    public function array(array $rows)
    {
        Log::info("AlumniImport array() called with " . count($rows) . " rows.");
        
        foreach ($rows as $index => $row) {
            try {
                Log::info("Processing row " . $index . ": " . json_encode($row));
                $nisn = trim(strval($row['nisn'] ?? ''));

                if (empty($nisn)) {
                    $this->failedRows[] = "Baris " . ($index + 2) . ": NISN kosong";
                    Log::warning("Row " . $index . " skipped: NISN empty.");
                    continue;
                }

                // Skip if NISN already exists
                if (Alumni::where('nisn', $nisn)->exists()) {
                    $this->skipped++;
                    Log::info("Row " . $index . " skipped: NISN $nisn exists.");
                    continue;
                }

                // Lookup jurusan using fuzzy matching
                $idJurusan = $this->findJurusanId($row['jurusan'] ?? '');

                $alumni = Alumni::create([
                    'nama'          => trim(strval($row['nama'] ?? '')),
                    'nisn'          => $nisn,
                    'jenis_kelamin' => trim(strval($row['jenis_kelamin'] ?? '')),
                    'tempat_lahir'  => trim(strval($row['tempat_lahir'] ?? '')),
                    'tanggal_lahir' => $row['tanggal_lahir'] ?? null,
                    'nik'           => trim(strval($row['nik'] ?? '')),
                    'agama'         => trim(strval($row['agama'] ?? '')),
                    'alamat'        => trim(strval($row['alamat'] ?? '')),
                    'tahun_lulus'   => $this->tahunLulus,
                    'id_jurusan'    => $idJurusan,
                    'rt'            => strval($row['rt'] ?? ''),
                    'rw'            => strval($row['rw'] ?? ''),
                    'dusun'         => trim(strval($row['dusun'] ?? '')),
                    'kelurahan'     => trim(strval($row['kelurahan'] ?? '')),
                    'kecamatan'     => trim(strval($row['kecamatan'] ?? '')),
                    'kode_pos'      => trim(strval($row['kode_pos'] ?? '')),
                    'email'         => trim(strval($row['email'] ?? '')),
                    'no_wa'         => trim(strval($row['no_wa'] ?? '')),
                    'password'      => $nisn, // Default password = NISN
                    'password_changed' => false,
                ]);

                Log::info("Row " . $index . " created. Alumni ID: " . $alumni->id);
                $this->imported++;
            } catch (\Exception $e) {
                $this->failedRows[] = "Baris " . ($index + 2) . ": " . $e->getMessage();
                Log::error("Import Alumni Row " . ($index + 2) . " Error: " . $e->getMessage());
            }
        }
        Log::info("Finished processing array. Imported: " . $this->imported . ", Skipped: " . $this->skipped);
    }

    public function getImportedCount(): int
    {
        return $this->imported;
    }

    public function getSkippedCount(): int
    {
        return $this->skipped;
    }

    public function getFailedRows(): array
    {
        return $this->failedRows;
    }
}

