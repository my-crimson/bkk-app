<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jurusan extends Model
{
    protected $table = 'jurusan';
    protected $primaryKey = 'id_jurusan';
    public $timestamps = false;

    protected $fillable = ['jurusan'];

    public function alumni()
    {
        return $this->hasMany(Alumni::class, 'id_jurusan', 'id_jurusan');
    }

    public function lowker()
    {
        return $this->hasMany(Lowker::class, 'id_jurusan', 'id_jurusan');
    }
}
