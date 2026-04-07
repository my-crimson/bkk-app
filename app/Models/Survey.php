<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $table = 'survey';
    protected $primaryKey = 'id_survey';
    public $timestamps = false;

    protected $fillable = ['id_alumni', 'pilihan_survey', 'kritiksaran', 'tgl_dibuat'];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'id_alumni', 'id');
    }
}
