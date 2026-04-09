<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lowker extends Model
{
    protected $table = 'lowker';
    protected $primaryKey = 'id_lowker';
    public $timestamps = false;

    protected $fillable = [
        'judul_lowker', 'deskripsi_lowker', 'kualifikasi', 'gaji', 'lokasi',
        'tgl_posting', 'tgl_ditutup', 'id_perusahaan', 'id_jurusan',
        'email', 'pendidikan', 'tipe_pekerjaan', 'keahlian', 'waktu_bekerja', 'tunjangan', 'jumlah_pelamar',
    ];

    public function perusahaan()
    {
        return $this->belongsTo(Perusahaan::class, 'id_perusahaan', 'id_perusahaan');
    }

    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class, 'id_jurusan', 'id_jurusan');
    }

    public function lamaran()
    {
        return $this->hasMany(Lamaran::class, 'id_lowker', 'id_lowker');
    }
}
