<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lamaran extends Model
{
    protected $table = 'lamaran';
    protected $primaryKey = 'id_lamaran';
    public $timestamps = false;

    protected $fillable = ['id_alumni', 'id_lowker', 'tanggal_lamar', 'status', 'file_lamaran'];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'id_alumni', 'id');
    }

    public function lowker()
    {
        return $this->belongsTo(Lowker::class, 'id_lowker', 'id_lowker');
    }
}
