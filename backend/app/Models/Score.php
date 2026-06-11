<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $fillable = ['name', 'email', 'iq', 'time_seconds', 'time_display'];

    protected $hidden = ['id', 'email', 'updated_at'];
}
