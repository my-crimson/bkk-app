<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lamaran extends Model
{
    protected $table = 'lamaran';
    protected $primaryKey = 'id_lamaran';
    public $timestamps = false;

    protected $fillable = ['id_alumni', 'id_lowker', 'tanggal_lamaran', 'pass_foto', 'ijazah', 'portofolio', 'sertifikat', 'ktp_kk', 'cv', 'skck', 'surat_lamaran'];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'id_alumni', 'id');
    }

    public function lowker()
    {
        return $this->belongsTo(Lowker::class, 'id_lowker', 'id_lowker');
    }
}
