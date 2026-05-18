<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

public function up(): void
{
    Schema::create('bookings', function (Blueprint $table) {
        $table->id('id_booking');
        // Relasi ke tabel users & destinasis dengan cascade delete
        $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
        $table->foreignId('id_destinasi')->constrained('destinasis', 'id_destinasi')->onDelete('cascade');
        $table->date('tanggal_kunjungan');
        $table->integer('jumlah_tiket');
        $table->integer('total_harga');
        $table->enum('status_booking', ['pending', 'dikonfirmasi', 'selesai', 'dibatalkan'])->default('pending');
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
