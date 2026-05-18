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
                    'deskripsi'   => $d->deskripsi,
                    'lokasi_rute' => $d->lokasi_rute,
                    'harga_tiket' => $d->harga_tiket,
                    'kapasitas'   => $d->kapasitas_harian,
                    'foto'        => $d->galeris->first()?->url_foto ?? null,
                    'rating'      => round($d->reviews_avg_rating ?? 0, 1),
                    'total_review'=> $d->reviews_count,
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
                    'nama'         => $r->user->name,
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
}
