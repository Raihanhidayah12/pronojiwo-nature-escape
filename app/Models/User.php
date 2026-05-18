<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table      = 'users';
    protected $primaryKey = 'id_user';
    public    $incrementing = true;
    protected $keyType    = 'int';

    protected $fillable = [
        'nama_lengkap',
        'email',
        'password',
        'no_telepon',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    // Apakah user adalah admin
    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    // Apakah user adalah pengunjung
    public function isPengunjung(): bool
    {
        return $this->role === 'pengunjung';
    }

    // Relasi: User punya banyak Booking
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'id_user', 'id_user');
    }

    // Relasi: User punya banyak Review
    public function reviews()
    {
        return $this->hasMany(Review::class, 'id_user', 'id_user');
    }
}