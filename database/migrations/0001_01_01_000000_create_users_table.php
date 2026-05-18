<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('id_user'); // Primary Key
            $table->string('nama_lengkap');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('no_telepon')->nullable();
            $table->enum('role', ['pengunjung', 'admin', 'super_admin'])->default('pengunjung');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};