<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id('id_pembayaran'); // Primary Key
            $table->foreignId('id_booking')->constrained('bookings', 'id_booking')->onDelete('cascade');
            $table->string('metode_pembayaran');
            $table->string('bukti_pembayaran')->nullable();
            $table->enum('status_pembayaran', ['belum_bayar', 'menunggu_verifikasi', 'lunas', 'gagal'])->default('belum_bayar');
            $table->timestamp('tanggal_bayar')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};