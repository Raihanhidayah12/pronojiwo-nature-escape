<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesans', function (Blueprint $table) {
            $table->id('id_pesan'); // Primary Key
            $table->string('nama_lengkap');
            $table->string('email');
            $table->string('subjek');
            $table->text('pesan');
            $table->text('balasan')->nullable();
            $table->enum('status', ['belum_dibalas', 'sudah_dibalas'])->default('belum_dibalas');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesans');
    }
};
