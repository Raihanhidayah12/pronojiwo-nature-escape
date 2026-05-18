<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('galeris', function (Blueprint $table) {
            $table->id('id_galeri'); // Primary Key
            $table->foreignId('id_destinasi')->constrained('destinasis', 'id_destinasi')->onDelete('cascade');
            $table->string('url_foto');
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galeris');
    }
};