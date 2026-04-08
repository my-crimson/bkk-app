<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Perusahaan extends Model
{
    protected $table = 'perusahaan';
    protected $primaryKey = 'id_perusahaan';
    public $timestamps = false;

    protected $hidden = [
        'logo', 'gambar',
    ];

    protected $fillable = [
        'nama_perusahaan', 'alamat', 'deskripsi', 'logo', 'website',
        'email', 'telepon', 'jenis_perusahaan', 'skala', 'jumlah_karyawan',
    ];

    public function lowker()
    {
        return $this->hasMany(Lowker::class, 'id_perusahaan', 'id_perusahaan');
    }
}
