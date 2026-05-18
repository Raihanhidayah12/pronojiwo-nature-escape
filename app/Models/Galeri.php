<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galeri extends Model
{
    protected $table = 'galeris';
    protected $primaryKey = 'id_galeri';

    protected $fillable = [
        'id_destinasi', 'url_foto', 'keterangan'
    ];

    public function destinasi()
    {
        return $this->belongsTo(Destinasi::class, 'id_destinasi', 'id_destinasi');
    }
}