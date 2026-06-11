<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WishlistEntry extends Model
{
    protected $fillable = ['name', 'email'];

    protected $hidden = ['id', 'created_at', 'updated_at'];
}
