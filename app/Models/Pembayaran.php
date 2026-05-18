<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $table = 'pembayarans';
    protected $primaryKey = 'id_pembayaran';

    protected $fillable = [
        'id_booking', 'metode_pembayaran', 'bukti_pembayaran', 'status_pembayaran', 'tanggal_bayar'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'id_booking', 'id_booking');
    }
}