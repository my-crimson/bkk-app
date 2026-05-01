<?php

namespace App\Imports;

use App\Models\Alumni;
use App\Models\Jurusan;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Illuminate\Support\Facades\Hash;

class AlumniImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError
{
    use SkipsErrors;

    private $jurusanMap;
    private $tahunLulus;
    private $imported = 0;
    private $skipped = 0;
    private $errors = [];

    public function __construct($tahunLulus)
    {
        $this->tahunLulus = $tahunLulus;
        // Build jurusan lookup map (nama -> id)
        $this->jurusanMap = Jurusan::pluck('id_jurusan', 'jurusan')->toArray();
    }

    public function model(array $row)
    {
        $nisn = trim($row['nisn'] ?? '');

        // Skip if NISN already exists
        if (Alumni::where('nisn', $nisn)->exists()) {
            $this->skipped++;
            return null;
        }

        // Lookup jurusan by name
        $jurusanNama = trim($row['jurusan'] ?? '');
        $idJurusan = null;
        foreach ($this->jurusanMap as $nama => $id) {
            if (strtolower($nama) === strtolower($jurusanNama)) {
                $idJurusan = $id;
                break;
            }
        }

        $this->imported++;

        return new Alumni([
            'nama'          => trim($row['nama'] ?? ''),
            'nisn'          => $nisn,
            'jenis_kelamin' => trim($row['jenis_kelamin'] ?? ''),
            'tempat_lahir'  => trim($row['tempat_lahir'] ?? ''),
            'tanggal_lahir' => $row['tanggal_lahir'] ?? null,
            'nik'           => trim($row['nik'] ?? ''),
            'agama'         => trim($row['agama'] ?? ''),
            'alamat'        => trim($row['alamat'] ?? ''),
            'tahun_lulus'   => $this->tahunLulus,
            'id_jurusan'    => $idJurusan,
            'rt'            => $row['rt'] ?? null,
            'rw'            => $row['rw'] ?? null,
            'dusun'         => $row['dusun'] ?? null,
            'kelurahan'     => $row['kelurahan'] ?? null,
            'kecamatan'     => $row['kecamatan'] ?? null,
            'kode_pos'      => $row['kode_pos'] ?? null,
            'email'         => $row['email'] ?? null,
            'no_wa'         => $row['no_wa'] ?? null,
            'password'      => $nisn, // Default password = NISN
            'password_changed' => false,
        ]);
    }

    public function rules(): array
    {
        return [
            'nama'          => 'required|string',
            'nisn'          => 'required|string',
            'jenis_kelamin' => 'required|string',
            'tempat_lahir'  => 'required|string',
            'tanggal_lahir' => 'required',
            'nik'           => 'required|string',
            'agama'         => 'required|string',
            'alamat'        => 'required|string',
            'jurusan'       => 'required',
            'rt'            => 'required',
            'rw'            => 'required',
            'dusun'         => 'required|string',
            'kelurahan'     => 'required|string',
            'kecamatan'     => 'required|string',
            'kode_pos'      => 'required',
            'email'         => 'required|email',
            'no_wa'         => 'required|string',
        ];
    }

    public function getImportedCount(): int
    {
        return $this->imported;
    }

    public function getSkippedCount(): int
    {
        return $this->skipped;
    }
}
