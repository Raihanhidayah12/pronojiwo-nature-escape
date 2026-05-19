<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            $table->text('fasilitas')->nullable()->after('kapasitas_harian');
            $table->decimal('rating_asli', 3, 1)->default(4.8)->after('fasilitas');
        });
    }

    public function down(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            $table->dropColumn(['fasilitas', 'rating_asli']);
        });
    }
};
