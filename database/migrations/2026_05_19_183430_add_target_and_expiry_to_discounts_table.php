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
        Schema::table('discounts', function (Blueprint $table) {
            $table->unsignedBigInteger('id_destinasi')->nullable()->after('status');
            $table->dateTime('berlaku_sampai')->nullable()->after('id_destinasi');

            $table->foreign('id_destinasi')
                  ->references('id_destinasi')
                  ->on('destinasis')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discounts', function (Blueprint $table) {
            $table->dropForeign(['id_destinasi']);
            $table->dropColumn(['id_destinasi', 'berlaku_sampai']);
        });
    }
};
