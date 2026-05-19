<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedBigInteger('id_diskon')->nullable()->after('id_destinasi');
            $table->integer('potongan_diskon')->default(0)->after('total_harga');

            $table->foreign('id_diskon')
                ->references('id_diskon')
                ->on('discounts')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['id_diskon']);
            $table->dropColumn(['id_diskon', 'potongan_diskon']);
        });
    }
};
