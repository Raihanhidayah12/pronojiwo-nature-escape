<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DestinasiController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [DestinasiController::class, 'index'])->name('home');
Route::post('/kontak', [DestinasiController::class, 'storeMessage'])->name('contact.store');

use App\Http\Controllers\AdminDashboardController;

Route::get('/dashboard', [AdminDashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes for Destinations, Bookings & Verification
    Route::post('/admin/destinasi', [AdminDashboardController::class, 'storeDestinasi'])->name('admin.destinasi.store');
    Route::post('/admin/destinasi/{id_destinasi}', [AdminDashboardController::class, 'updateDestinasi'])->name('admin.destinasi.update');
    Route::delete('/admin/destinasi/{id_destinasi}', [AdminDashboardController::class, 'destroyDestinasi'])->name('admin.destinasi.destroy');
    Route::post('/admin/booking/{id_booking}/verifikasi', [AdminDashboardController::class, 'verifikasiPembayaran'])->name('admin.booking.verifikasi');

    // Admin Routes for managing Instant Messages (Pesan Masuk)
    Route::post('/admin/pesan/{id_pesan}/balas', [AdminDashboardController::class, 'balasPesan'])->name('admin.pesan.balas');
    Route::delete('/admin/pesan/{id_pesan}', [AdminDashboardController::class, 'destroyPesan'])->name('admin.pesan.destroy');

    // Super Admin Routes for managing Users
    Route::post('/superadmin/users', [AdminDashboardController::class, 'storeUser'])->name('superadmin.users.store');
    Route::put('/superadmin/users/{id_user}', [AdminDashboardController::class, 'updateUser'])->name('superadmin.users.update');
    Route::delete('/superadmin/users/{id_user}', [AdminDashboardController::class, 'destroyUser'])->name('superadmin.users.destroy');

    // Super Admin Routes for managing Discounts
    Route::post('/superadmin/discounts', [AdminDashboardController::class, 'storeDiscount'])->name('superadmin.discounts.store');
    Route::put('/superadmin/discounts/{id_diskon}', [AdminDashboardController::class, 'updateDiscount'])->name('superadmin.discounts.update');
    Route::delete('/superadmin/discounts/{id_diskon}', [AdminDashboardController::class, 'destroyDiscount'])->name('superadmin.discounts.destroy');

    // Visitor Actions (Booking, Payment Proof & Review)
    Route::post('/booking', [AdminDashboardController::class, 'storeBooking'])->name('booking.store');
    Route::post('/booking/{id_booking}/bayar', [AdminDashboardController::class, 'uploadPembayaran'])->name('booking.bayar');
    Route::post('/booking/{id_booking}/batal', [AdminDashboardController::class, 'cancelBooking'])->name('booking.cancel');
    Route::post('/review', [AdminDashboardController::class, 'storeReview'])->name('review.store');
});

require __DIR__.'/auth.php';
