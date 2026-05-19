<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\DestinasiSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'nama_lengkap' => 'Super Admin Pronojiwo',
            'email'        => 'admin@pronojiwo.com',
            'password'     => \Illuminate\Support\Facades\Hash::make('password'),
            'role'         => 'admin',
        ]);

        User::create([
            'nama_lengkap' => 'Rian Hidayat',
            'email'        => 'rian@gmail.com',
            'password'     => \Illuminate\Support\Facades\Hash::make('password'),
            'role'         => 'pengunjung',
        ]);

        $this->call([
            DestinasiSeeder::class,
        ]);
    }
}
