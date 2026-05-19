<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DestinasiController extends Controller
{
    public function index()
    {
        $destinasis = Destinasi::where('status', 'aktif')
            ->with(['galeris' => function ($q) {
                $q->limit(1);
            }])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->latest()
            ->get()
            ->map(function ($d) {
                return [
                    'id'          => $d->id_destinasi,
                    'nama_wisata' => $d->nama_wisata,
                    'kategori'    => $d->kategori,
                    'deskripsi'   => $d->deskripsi,
                    'lokasi_rute' => $d->lokasi_rute,
                    'harga_tiket' => $d->harga_tiket,
                    'kapasitas'   => $d->kapasitas_harian,
                    'foto'        => $d->galeris->first()?->url_foto ?? null,
                    'rating'      => round($d->reviews_avg_rating ?? $d->rating_asli ?? 4.8, 1),
                    'total_review'=> $d->reviews_count,
                    'fasilitas'   => $d->fasilitas,
                    'rating_asli' => $d->rating_asli,
                ];
            });

        $reviews = Review::with('user', 'destinasi')
            ->where('rating', '>=', 4)
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($r) {
                return [
                    'id'           => $r->id_review,
                    'nama'         => $r->user->nama_lengkap ?? 'Pengunjung',
                    'ulasan'       => $r->ulasan,
                    'rating'       => $r->rating,
                    'destinasi'    => $r->destinasi->nama_wisata,
                    'created_at'   => $r->created_at->diffForHumans(),
                ];
            });

        $stats = [
            'total_destinasi'  => Destinasi::where('status', 'aktif')->count(),
            'total_review'     => Review::count(),
            'avg_rating'       => round(Review::avg('rating') ?? 4.8, 1),
        ];

        return Inertia::render('index', [
            'destinasis' => $destinasis,
            'reviews'    => $reviews,
            'stats'      => $stats,
            'canLogin'   => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister'=> \Illuminate\Support\Facades\Route::has('register'),
        ]);
    }

    /**
     * Kirim Pesan Instan dari Pengunjung
     */
    public function storeMessage(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'subjek'       => 'required|string|max:255',
            'pesan'        => 'required|string',
        ]);

        \App\Models\Pesan::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email'        => $request->email,
            'subjek'       => $request->subjek,
            'pesan'        => $request->pesan,
            'status'       => 'belum_dibalas',
        ]);

        return redirect()->back()->with('success', 'Pesan instan Anda berhasil dikirim! Tim kami akan segera merespon.');
    }
}
