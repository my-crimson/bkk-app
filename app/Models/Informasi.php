<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Informasi extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'visi_misi',
        'proker',
        'tujuan',
        'pengantar',
        'pengantar_foto',
        'pengantar_nama',
        'pengantar_jabatan',
        'pengantar_nip',
        'level_options'
    ];

    protected $casts = [
        'level_options' => 'array',
    ];
}
