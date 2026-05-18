<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = 'bookings';
    protected $primaryKey = 'id_booking';

    protected $fillable = [
        'id_user', 'id_destinasi', 'tanggal_kunjungan', 'jumlah_tiket', 'total_harga', 'status_booking'
    ];

    // Relasi balik ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    // Relasi balik ke Destinasi
    public function destinasi()
    {
        return $this->belongsTo(Destinasi::class, 'id_destinasi', 'id_destinasi');
    }

    // Relasi One-to-One ke Pembayaran
    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_booking', 'id_booking');
    }
}