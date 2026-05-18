<?php

namespace Database\Seeders;

use App\Models\Destinasi;
use App\Models\Galeri;
use Illuminate\Database\Seeder;

class DestinasiSeeder extends Seeder
{
    public function run(): void
    {
        $destinasis = [
            [
                'nama_wisata'      => 'Air Terjun Tumpak Sewu',
                'deskripsi'        => 'Air terjun spektakuler setinggi 120 meter dengan pemandangan menakjubkan, dijuluki "Niagara-nya Indonesia". Dikelilingi tebing hijau yang dramatis.',
                'lokasi_rute'      => 'Desa Sidomulyo, Pronojiwo, Lumajang, Jawa Timur',
                'harga_tiket'      => 20000,
                'kapasitas_harian' => 200,
                'status'           => 'aktif',
                'foto'             => '/build/assets/sewu.jpg',
            ],
            [
                'nama_wisata'      => 'Panorama Kapas Biru',
                'deskripsi'        => 'Pemandangan bukit hijau dengan kabut pagi yang memesona. Spot foto terbaik untuk menikmati sunrise di atas awan.',
                'lokasi_rute'      => 'Pronojiwo, Lumajang, Jawa Timur',
                'harga_tiket'      => 15000,
                'kapasitas_harian' => 150,
                'status'           => 'aktif',
                'foto'             => '/build/assets/panoramakapasbiru.jpg',
            ],
            [
                'nama_wisata'      => 'Air Terjun Kapas Biru',
                'deskripsi'        => 'Air terjun tersembunyi dengan kolam alami yang jernih dan segar. Cocok untuk berenang dan menikmati alam liar.',
                'lokasi_rute'      => 'Desa Tumpak Sewu, Pronojiwo, Lumajang',
                'harga_tiket'      => 15000,
                'kapasitas_harian' => 100,
                'status'           => 'aktif',
                'foto'             => '/build/assets/kapasbiru.jpg',
            ],
            [
                'nama_wisata'      => 'Kabut Pelangi',
                'deskripsi'        => 'Fenomena pelangi di tengah kabut air terjun yang magis. Terjadi setiap pagi saat sinar matahari menyinari percikan air.',
                'lokasi_rute'      => 'Pronojiwo, Lumajang, Jawa Timur',
                'harga_tiket'      => 10000,
                'kapasitas_harian' => 120,
                'status'           => 'aktif',
                'foto'             => '/build/assets/kabutpelangi.jpg',
            ],
            [
                'nama_wisata'      => 'Hutan Pinus Pronojiwo',
                'deskripsi'        => 'Hutan pinus yang rindang dengan udara sejuk dan segar. Tempat ideal untuk camping, hiking, dan menikmati ketenangan alam.',
                'lokasi_rute'      => 'Pronojiwo, Lumajang, Jawa Timur',
                'harga_tiket'      => 10000,
                'kapasitas_harian' => 300,
                'status'           => 'aktif',
                'foto'             => null,
            ],
            [
                'nama_wisata'      => 'Bukit Sriti',
                'deskripsi'        => 'Bukit dengan pemandangan 360 derajat yang memukau. Dari sini Anda bisa melihat Gunung Semeru, Bromo, dan lautan awan.',
                'lokasi_rute'      => 'Pronojiwo, Lumajang, Jawa Timur',
                'harga_tiket'      => 15000,
                'kapasitas_harian' => 100,
                'status'           => 'aktif',
                'foto'             => null,
            ],
        ];

        foreach ($destinasis as $data) {
            $foto = $data['foto'];
            unset($data['foto']);

            $destinasi = Destinasi::create($data);

            if ($foto) {
                Galeri::create([
                    'id_destinasi' => $destinasi->id_destinasi,
                    'url_foto'     => $foto,
                    'keterangan'   => 'Foto utama ' . $destinasi->nama_wisata,
                ]);
            }
        }
    }
}
