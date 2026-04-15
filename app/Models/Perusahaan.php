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

    /**
     * Sanitize UTF-8 characters before serialization
     */
    protected function sanitizeUtf8($data)
    {
        if (is_array($data)) {
            return array_map([$this, 'sanitizeUtf8'], $data);
        }

        if (is_string($data)) {
            // Remove invalid UTF-8 characters
            return mb_convert_encoding($data, 'UTF-8', 'UTF-8');
        }

        return $data;
    }

    public function toArray()
    {
        return $this->sanitizeUtf8(parent::toArray());
    }
}
