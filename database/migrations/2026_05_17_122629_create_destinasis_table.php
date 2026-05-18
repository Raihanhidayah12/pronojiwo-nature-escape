<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinasis', function (Blueprint $table) {
            $table->id('id_destinasi'); // Primary Key
            $table->string('nama_wisata');
            $table->text('deskripsi');
            $table->text('lokasi_rute');
            $table->integer('harga_tiket');
            $table->integer('kapasitas_harian');
            $table->enum('status', ['aktif', 'non-aktif'])->default('aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destinasis');
    }
};