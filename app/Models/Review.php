<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    protected $primaryKey = 'id_review';

    protected $fillable = [
        'id_user', 'id_destinasi', 'rating', 'ulasan'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function destinasi()
    {
        return $this->belongsTo(Destinasi::class, 'id_destinasi', 'id_destinasi');
    }
}