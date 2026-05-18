<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id('id_review'); // Primary Key
            $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_destinasi')->constrained('destinasis', 'id_destinasi')->onDelete('cascade');
            $table->tinyInteger('rating'); // Nilai 1-5
            $table->text('ulasan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};