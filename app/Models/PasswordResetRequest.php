<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetRequest extends Model
{
    protected $table = 'password_reset_requests';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['id_alumni', 'status', 'created_at', 'resolved_at', 'resolved_by'];

    protected $casts = [
        'created_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'id_alumni', 'id');
    }
}
