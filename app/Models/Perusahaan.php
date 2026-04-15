<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Perusahaan extends Model
{
    protected $table = 'perusahaan';
    protected $primaryKey = 'id_perusahaan';
    public $timestamps = false;

    protected $fillable = [
        'nama', 'alamat', 'kota', 'deskripsi_perusahaan', 'kontak',
        'email', 'logo', 'gambar', 'standar', 'kategori', 'kerja_sama',
    ];

    public function lowker()
    {
        return $this->hasMany(Lowker::class, 'id_perusahaan', 'id_perusahaan');
    }
}
