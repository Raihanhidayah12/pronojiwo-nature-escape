<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = 'bookings';
    protected $primaryKey = 'id_booking';

    protected $fillable = [
        'id_user', 'id_destinasi', 'id_diskon', 'tanggal_kunjungan', 'jumlah_tiket', 'total_harga', 'potongan_diskon', 'status_booking'
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

    // Relasi ke Discount
    public function discount()
    {
        return $this->belongsTo(Discount::class, 'id_diskon', 'id_diskon');
    }

    // Relasi One-to-One ke Pembayaran
    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_booking', 'id_booking');
    }
}