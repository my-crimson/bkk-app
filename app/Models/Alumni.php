<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    protected $table = 'alumni';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nama', 'jenis_kelamin', 'nisn', 'tempat_lahir', 'tanggal_lahir',
        'nik', 'agama', 'alamat', 'rt', 'rw', 'dusun', 'kelurahan',
        'kecamatan', 'kode_pos', 'email', 'no_wa', 'id_jurusan',
        'password', 'gambar',
    ];

    protected $hidden = ['password'];

    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class, 'id_jurusan', 'id_jurusan');
    }

    public function lamaran()
    {
        return $this->hasMany(Lamaran::class, 'id_alumni', 'id');
    }

    public function survey()
    {
        return $this->hasMany(Survey::class, 'id_alumni', 'id');
    }
}
