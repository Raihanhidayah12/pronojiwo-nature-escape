<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $table = 'discounts';
    protected $primaryKey = 'id_diskon';

    protected $fillable = [
        'kode_diskon',
        'persentase',
        'status',
        'id_destinasi',
        'berlaku_sampai',
    ];

    public function destinasi()
    {
        return $this->belongsTo(Destinasi::class, 'id_destinasi', 'id_destinasi');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'id_diskon', 'id_diskon');
    }
}
