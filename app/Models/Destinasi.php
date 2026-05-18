<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destinasi extends Model
{
    protected $table = 'destinasis';
    protected $primaryKey = 'id_destinasi';

    protected $fillable = [
        'nama_wisata', 'deskripsi', 'lokasi_rute', 'harga_tiket', 'kapasitas_harian', 'status'
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'id_destinasi', 'id_destinasi');
    }

    public function galeris()
    {
        return $this->hasMany(Galeri::class, 'id_destinasi', 'id_destinasi');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'id_destinasi', 'id_destinasi');
    }
}