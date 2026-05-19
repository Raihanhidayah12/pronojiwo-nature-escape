<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Pembayaran;
use App\Models\Galeri;
use App\Models\Pesan;
use App\Mail\BalasanPesanMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Tampilkan Dashboard (Admin / Pengunjung)
     */
    public function index()
    {
        $user = auth()->user();

        $destinasis = [];
        $bookings  = [];
        $reviews   = [];
        $pesans    = [];

        $users = [];
        $logs = [];

        if ($user->isAdmin()) {
            // Load all destinations with galeris
            $destinasis = Destinasi::with('galeris')->latest()->get()->map(function ($d) {
                // ... same map
                return [
                    'id_destinasi'      => $d->id_destinasi,
                    'nama_wisata'       => $d->nama_wisata,
                    'kategori'          => $d->kategori,
                    'deskripsi'         => $d->deskripsi,
                    'lokasi_rute'       => $d->lokasi_rute,
                    'harga_tiket'       => $d->harga_tiket,
                    'kapasitas_harian'  => $d->kapasitas_harian,
                    'status'            => $d->status,
                    'fasilitas'         => $d->fasilitas,
                    'rating_asli'       => $d->rating_asli,
                    'gambar'            => $d->galeris->first()?->url_foto ?? 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop&q=80',
                ];
            });

            // Load all bookings with relationships
            $bookings = Booking::with(['user', 'destinasi', 'pembayaran'])->latest()->get()->map(function ($b) {
                return [
                    'id_booking'        => $b->id_booking,
                    'id_user'           => $b->id_user,
                    'user'              => [
                        'nama_lengkap' => $b->user?->nama_lengkap ?? 'User Terhapus',
                        'email'        => $b->user?->email ?? '-',
                    ],
                    'id_destinasi'      => $b->id_destinasi,
                    'destinasi'         => [
                        'nama_wisata' => $b->destinasi?->nama_wisata ?? 'Destinasi Terhapus',
                    ],
                    'tanggal_kunjungan' => $b->tanggal_kunjungan,
                    'jumlah_tiket'      => $b->jumlah_tiket,
                    'total_harga'       => $b->total_harga,
                    'status_booking'    => $b->status_booking,
                    'pembayaran'        => $b->pembayaran ? [
                        'id_pembayaran'     => $b->pembayaran->id_pembayaran,
                        'metode_pembayaran' => $b->pembayaran->metode_pembayaran,
                        'bukti_pembayaran'  => $b->pembayaran->bukti_pembayaran,
                        'status_pembayaran' => $b->pembayaran->status_pembayaran,
                    ] : null,
                ];
            });

            // Load all reviews with relationships
            $reviews = Review::with(['user', 'destinasi'])->latest()->get()->map(function ($r) {
                return [
                    'id_review'    => $r->id_review,
                    'id_user'      => $r->id_user,
                    'user'         => [
                        'nama_lengkap' => $r->user?->nama_lengkap ?? 'Anonim',
                    ],
                    'id_destinasi' => $r->id_destinasi,
                    'destinasi'    => [
                        'nama_wisata' => $r->destinasi?->nama_wisata ?? 'Destinasi Terhapus',
                    ],
                    'rating'       => $r->rating,
                    'ulasan'       => $r->ulasan,
                ];
            });

            // Load all instant messages
            $pesans = \App\Models\Pesan::latest()->get()->map(function ($p) {
                return [
                    'id_pesan'     => $p->id_pesan,
                    'nama_lengkap' => $p->nama_lengkap,
                    'email'        => $p->email,
                    'subjek'       => $p->subjek,
                    'pesan'        => $p->pesan,
                    'balasan'      => $p->balasan,
                    'status'       => $p->status,
                    'created_at'   => optional($p->created_at)->diffForHumans(),
                ];
            });

            if ($user->role === 'super_admin') {
                $users = \App\Models\User::latest()->get()->map(function ($u) {
                    return [
                        'id_user'      => $u->id_user,
                        'nama_lengkap' => $u->nama_lengkap,
                        'email'        => $u->email,
                        'no_telepon'   => $u->no_telepon,
                        'role'         => $u->role,
                    ];
                });

                $logs = \App\Models\LogAktivitas::latest()->get()->map(function ($l) {
                    return [
                        'id'         => $l->id_log,
                        'deskripsi'  => $l->deskripsi,
                        'tipe'       => $l->tipe,
                        'waktu'      => optional($l->created_at)->diffForHumans(),
                    ];
                });
            }
        } else {
            // Load all active destinations for the visitor
            $destinasis = Destinasi::with('galeris')->latest()->get()->map(function ($d) {
                return [
                    'id_destinasi'      => $d->id_destinasi,
                    'nama_wisata'       => $d->nama_wisata,
                    'kategori'          => $d->kategori,
                    'deskripsi'         => $d->deskripsi,
                    'lokasi_rute'       => $d->lokasi_rute,
                    'harga_tiket'       => $d->harga_tiket,
                    'kapasitas_harian'  => $d->kapasitas_harian,
                    'status'            => $d->status,
                    'fasilitas'         => $d->fasilitas,
                    'rating_asli'       => $d->rating_asli,
                    'gambar'            => $d->galeris->first()?->url_foto ?? 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop&q=80',
                ];
            });

            // Load visitor's bookings
            $bookings = Booking::with(['destinasi', 'pembayaran'])
                ->where('id_user', $user->id_user)
                ->latest()
                ->get()
                ->map(function ($b) {
                    return [
                        'id_booking'        => $b->id_booking,
                        'id_user'           => $b->id_user,
                        'id_destinasi'      => $b->id_destinasi,
                        'destinasi'         => [
                            'nama_wisata' => $b->destinasi?->nama_wisata ?? 'Destinasi Terhapus',
                        ],
                        'tanggal_kunjungan' => $b->tanggal_kunjungan,
                        'jumlah_tiket'      => $b->jumlah_tiket,
                        'total_harga'       => $b->total_harga,
                        'status_booking'    => $b->status_booking,
                        'pembayaran'        => $b->pembayaran ? [
                            'id_pembayaran'     => $b->pembayaran->id_pembayaran,
                            'metode_pembayaran' => $b->pembayaran->metode_pembayaran,
                            'bukti_pembayaran'  => $b->pembayaran->bukti_pembayaran,
                            'status_pembayaran' => $b->pembayaran->status_pembayaran,
                        ] : null,
                    ];
                });

            // Load all reviews so the visitor can view comments on destinasis
            $reviews = Review::with(['user', 'destinasi'])->latest()->get()->map(function ($r) {
                return [
                    'id_review'    => $r->id_review,
                    'id_user'      => $r->id_user,
                    'user'         => [
                        'nama_lengkap' => $r->user?->nama_lengkap ?? 'Anonim',
                    ],
                    'id_destinasi' => $r->id_destinasi,
                    'id_booking'   => $r->id_booking,
                    'destinasi'    => [
                        'nama_wisata' => $r->destinasi?->nama_wisata ?? 'Destinasi Terhapus',
                    ],
                    'rating'       => $r->rating,
                    'ulasan'       => $r->ulasan,
                ];
            });

            // Load visitor's messages based on their email
            $pesans = \App\Models\Pesan::where('email', $user->email)->latest()->get()->map(function ($p) {
                return [
                    'id_pesan'     => $p->id_pesan,
                    'nama_lengkap' => $p->nama_lengkap,
                    'email'        => $p->email,
                    'subjek'       => $p->subjek,
                    'pesan'        => $p->pesan,
                    'balasan'      => $p->balasan,
                    'status'       => $p->status,
                    'created_at'   => optional($p->created_at)->diffForHumans(),
                ];
            });
        }

        $discounts = \App\Models\Discount::latest()->get()->map(function ($d) {
            return [
                'id_diskon'      => $d->id_diskon,
                'kode_diskon'    => $d->kode_diskon,
                'persentase'     => $d->persentase,
                'status'         => $d->status,
                'id_destinasi'   => $d->id_destinasi,
                'berlaku_sampai' => $d->berlaku_sampai ? $d->berlaku_sampai : null,
            ];
        });

        return Inertia::render('Dashboard', [
            'destinasis' => $destinasis,
            'bookings'   => $bookings,
            'reviews'    => $reviews,
            'pesans'     => $pesans,
            'users'      => $users,
            'logs'       => $logs,
            'discounts'  => $discounts,
        ]);
    }

    /**
     * Tambah Destinasi Baru
     */
    public function storeDestinasi(Request $request)
    {
        $request->validate([
            'nama_wisata'       => 'required|string|max:255',
            'kategori'          => 'required|string|max:100',
            'deskripsi'         => 'required|string',
            'lokasi_rute'       => 'required|string',
            'harga_tiket'       => 'required|numeric|min:0',
            'kapasitas_harian'  => 'required|numeric|min:0',
            'status'            => 'required|in:aktif,non-aktif',
            'fasilitas'         => 'nullable|string',
            'rating_asli'       => 'nullable|numeric|min:0|max:5',
            'gambar_file'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'gambar'            => 'nullable|string'
        ]);

        DB::beginTransaction();
        try {
            // 1. Create Destination
            $destinasi = Destinasi::create([
                'nama_wisata'      => $request->nama_wisata,
                'kategori'         => $request->kategori,
                'deskripsi'        => $request->deskripsi,
                'lokasi_rute'      => $request->lokasi_rute,
                'harga_tiket'      => $request->harga_tiket,
                'kapasitas_harian' => $request->kapasitas_harian,
                'status'           => $request->status,
                'fasilitas'        => $request->fasilitas,
                'rating_asli'      => $request->rating_asli ?? 4.8,
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);

            // 2. Handle Image Upload
            $urlFoto = $request->gambar ?? 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop&q=80';

            if ($request->hasFile('gambar_file')) {
                $file = $request->file('gambar_file');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                // Ensure directory exists
                if (!file_exists(public_path('uploads/destinasis'))) {
                    mkdir(public_path('uploads/destinasis'), 0777, true);
                }

                $file->move(public_path('uploads/destinasis'), $filename);
                $urlFoto = '/uploads/destinasis/' . $filename;
            }

            // Save to Galeri
            Galeri::create([
                'id_destinasi' => $destinasi->id_destinasi,
                'url_foto'     => $urlFoto,
                'keterangan'   => 'Foto Utama ' . $destinasi->nama_wisata
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Destinasi pariwisata berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menambahkan destinasi: ' . $e->getMessage()]);
        }
    }

    /**
     * Update Destinasi
     */
    public function updateDestinasi(Request $request, $id_destinasi)
    {
        $destinasi = Destinasi::findOrFail($id_destinasi);

        $request->validate([
            'nama_wisata'       => 'required|string|max:255',
            'kategori'          => 'required|string|max:100',
            'deskripsi'         => 'required|string',
            'lokasi_rute'       => 'required|string',
            'harga_tiket'       => 'required|numeric|min:0',
            'kapasitas_harian'  => 'required|numeric|min:0',
            'status'            => 'required|in:aktif,non-aktif',
            'fasilitas'         => 'nullable|string',
            'rating_asli'       => 'nullable|numeric|min:0|max:5',
            'gambar_file'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'gambar'            => 'nullable|string'
        ]);

        DB::beginTransaction();
        try {
            // Update Destination
            $destinasi->update([
                'nama_wisata'      => $request->nama_wisata,
                'kategori'         => $request->kategori,
                'deskripsi'        => $request->deskripsi,
                'lokasi_rute'      => $request->lokasi_rute,
                'harga_tiket'      => $request->harga_tiket,
                'kapasitas_harian' => $request->kapasitas_harian,
                'status'           => $request->status,
                'fasilitas'        => $request->fasilitas,
                'rating_asli'      => $request->rating_asli ?? 4.8,
            ]);

            // Handle Image Upload
            if ($request->hasFile('gambar_file')) {
                $file = $request->file('gambar_file');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                // Ensure directory exists
                if (!file_exists(public_path('uploads/destinasis'))) {
                    mkdir(public_path('uploads/destinasis'), 0777, true);
                }

                $file->move(public_path('uploads/destinasis'), $filename);
                $urlFoto = '/uploads/destinasis/' . $filename;

                // Update or Create first Galeri
                $galeri = Galeri::where('id_destinasi', $destinasi->id_destinasi)->first();
                if ($galeri) {
                    // Delete old local file if present
                    if ($galeri->url_foto && str_starts_with($galeri->url_foto, '/uploads/')) {
                        $oldPath = public_path($galeri->url_foto);
                        if (file_exists($oldPath)) {
                            unlink($oldPath);
                        }
                    }
                    $galeri->update(['url_foto' => $urlFoto]);
                } else {
                    Galeri::create([
                        'id_destinasi' => $destinasi->id_destinasi,
                        'url_foto'     => $urlFoto,
                        'keterangan'   => 'Foto Utama ' . $destinasi->nama_wisata
                    ]);
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Destinasi pariwisata berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui destinasi: ' . $e->getMessage()]);
        }
    }

    /**
     * Hapus Destinasi
     */
    public function destroyDestinasi($id_destinasi)
    {
        $destinasi = Destinasi::findOrFail($id_destinasi);

        DB::beginTransaction();
        try {
            //Delete orphaned bookings that reference this destination
            Booking::where('id_destinasi', $destinasi->id_destinasi)->delete();

            // Get all galeris to delete local photo files
            $galeris = Galeri::where('id_destinasi', $destinasi->id_destinasi)->get();
            foreach ($galeris as $galeri) {
                if ($galeri->url_foto && str_starts_with($galeri->url_foto, '/uploads/')) {
                    $oldPath = public_path($galeri->url_foto);
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }
                }
            }

            $destinasi->delete(); // Cascades on DB level to galeris, bookings, reviews
            DB::commit();
            return redirect()->back()->with('success', 'Destinasi pariwisata berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus destinasi: ' . $e->getMessage()]);
        }
    }

    /**
     * Verifikasi Pembayaran
     */
    public function verifikasiPembayaran(Request $request, $id_booking)
    {
        $request->validate([
            'status' => 'required|in:terima,tolak'
        ]);

        $booking = Booking::with('pembayaran')->findOrFail($id_booking);

        DB::transaction(function () use ($request, $booking) {
            $isApproved = $request->status === 'terima';

            $booking->update([
                'status_booking' => $isApproved ? 'dikonfirmasi' : 'dibatalkan',
            ]);

            $payment = $booking->pembayaran
                ?? Pembayaran::create([
                    'id_booking'        => $booking->id_booking,
                    'metode_pembayaran' => 'Transfer Bank (Verifikasi)',
                ]);

            $payment->update(Arr::only([
                'status_pembayaran' => $isApproved ? 'lunas' : 'gagal',
                'tanggal_bayar'     => now(),
            ], $isApproved
                ? ['status_pembayaran', 'tanggal_bayar']
                : ['status_pembayaran']
            ));
        });

        $message = $request->status === 'terima'
            ? 'Pembayaran berhasil dikonfirmasi! Tiket pariwisata aktif.'
            : 'Pembayaran ditolak. Booking dibatalkan.';

        return redirect()->back()->with('success', $message);
}

    /**
     * Balas Pesan Instan
     */
    public function balasPesan(Request $request, $id_pesan)
    {
        $request->validate([
            'balasan' => ['required', 'string', 'max:5000'],
        ]);

        DB::transaction(function () use ($request, $id_pesan): void {
            $pesan = Pesan::lockForUpdate()->findOrFail($id_pesan);

            $pesan->update([
                'balasan' => $request->input('balasan'),
                'status'  => 'sudah_dibalas',
            ]);
        });

        $pesan = Pesan::findOrFail($id_pesan);

        try {
            Mail::to($pesan->email)->send(new BalasanPesanMail($pesan));
        } catch (Throwable $e) {
            Log::error('Gagal mengirim balasan pesan ke :email', [
                'email'  => $pesan->email,
                'id_pesan' => $pesan->id_pesan,
                'error'  => $e->getMessage(),
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Balasan berhasil disimpan.');
    }


    /**
     * Hapus Pesan Instan
     */
    public function destroyPesan($id_pesan)
    {
        try {
            $pesan = Pesan::findOrFail($id_pesan);
            $pesan->delete();
        } catch (\Throwable $e) {
            Log::error('Gagal menghapus pesan :id_pesan', [
                'id_pesan' => $id_pesan,
                'error'    => $e->getMessage(),
            ]);

            return redirect()
                ->back()
                ->withErrors(['error' => 'Gagal menghapus pesan. Silakan coba lagi.']);
        }

        return redirect()
            ->back()
            ->with('success', 'Pesan instan berhasil dihapus!');
    }

    // ==========================================
    // USER CRUD (SUPER ADMIN)
    // ==========================================

    public function storeUser(Request $request)
    {
        abort_if(auth()->user()->role !== 'super_admin', 403);
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'no_telepon' => 'nullable|string|max:20',
            'role' => 'required|in:pengunjung,admin,super_admin',
        ]);

        \App\Models\User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'no_telepon' => $request->no_telepon,
            'role' => $request->role,
        ]);

        \App\Models\LogAktivitas::create([
            'deskripsi' => 'Super Admin menambahkan akun baru (' . $request->nama_lengkap . ').',
            'tipe' => 'update'
        ]);

        return redirect()->back()->with('success', 'Akun berhasil ditambahkan!');
    }

    public function updateUser(Request $request, $id_user)
    {
        abort_if(auth()->user()->role !== 'super_admin', 403);
        $user = \App\Models\User::findOrFail($id_user);
        
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id_user.',id_user',
            'no_telepon' => 'nullable|string|max:20',
            'role' => 'required|in:pengunjung,admin,super_admin',
        ]);

        $data = $request->only(['nama_lengkap', 'email', 'no_telepon', 'role']);
        
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        \App\Models\LogAktivitas::create([
            'deskripsi' => 'Super Admin memperbarui role/akun (' . $user->nama_lengkap . ').',
            'tipe' => 'update'
        ]);

        return redirect()->back()->with('success', 'Akun berhasil diperbarui!');
    }

    public function destroyUser($id_user)
    {
        abort_if(auth()->user()->role !== 'super_admin', 403);
        $user = \App\Models\User::findOrFail($id_user);
        
        if ($user->id_user === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
        }

        $nama = $user->nama_lengkap;
        $user->delete();

        \App\Models\LogAktivitas::create([
            'deskripsi' => 'Super Admin menghapus akun (' . $nama . ').',
            'tipe' => 'peringatan'
        ]);

        return redirect()->back()->with('success', 'Akun berhasil dihapus!');
    }

    // ==========================================
    // VISITOR ACTIONS (BOOKING, PAYMENT, REVIEW)
    // ==========================================

    /**
     * Simpan Pemesanan Tiket Baru (Visitor)
     */
    public function storeBooking(Request $request)
    {
        $request->validate([
            'id_destinasi'      => 'required|exists:destinasis,id_destinasi',
            'tanggal_kunjungan' => 'required|date|after_or_equal:today',
            'jumlah_tiket'      => 'required|integer|min:1',
            'total_harga'       => 'required|numeric|min:0',
            'metode_pembayaran' => 'required|string',
            'kode_diskon'       => 'nullable|string|max:50',
        ]);

        $destinasi = Destinasi::findOrFail($request->id_destinasi);

        // Calculate booked tickets for this destination on the selected date
        $bookedTickets = Booking::where('id_destinasi', $request->id_destinasi)
            ->where('tanggal_kunjungan', $request->tanggal_kunjungan)
            ->where('status_booking', '!=', 'dibatalkan')
            ->sum('jumlah_tiket');

        $remainingQuota = $destinasi->kapasitas_harian - $bookedTickets;

        if ($remainingQuota < $request->jumlah_tiket) {
            return redirect()->back()->withErrors([
                'tanggal_kunjungan' => 'Sisa kuota destinasi pada tanggal tersebut tinggal ' . max(0, $remainingQuota) . ' tiket. Pemesanan Anda (' . $request->jumlah_tiket . ' tiket) melebihi batas kuota!'
            ]);
        }

        // Discount validation and calculation
        $id_diskon = null;
        $potongan_diskon = 0;
        $ticketCost = $destinasi->harga_tiket * $request->jumlah_tiket;
        $serviceFee = round($ticketCost * 0.05);

        if ($request->filled('kode_diskon')) {
            $discount = \App\Models\Discount::where('kode_diskon', strtoupper($request->kode_diskon))
                ->where('status', 'aktif')
                ->where(function ($query) use ($request) {
                    $query->whereNull('id_destinasi')
                          ->orWhere('id_destinasi', $request->id_destinasi);
                })
                ->where(function ($query) {
                    $query->whereNull('berlaku_sampai')
                          ->orWhere('berlaku_sampai', '>=', now());
                })
                ->first();

            if ($discount) {
                $id_diskon = $discount->id_diskon;
                $potongan_diskon = round($ticketCost * ($discount->persentase / 100));
            }
        }

        // Expected total calculation
        $expectedTotal = ($ticketCost - $potongan_diskon) + $serviceFee;

        $booking = Booking::create([
            'id_user'           => auth()->id(),
            'id_destinasi'      => $request->id_destinasi,
            'id_diskon'         => $id_diskon,
            'tanggal_kunjungan' => $request->tanggal_kunjungan,
            'jumlah_tiket'      => $request->jumlah_tiket,
            'total_harga'       => $expectedTotal,
            'potongan_diskon'   => $potongan_diskon,
            'status_booking'    => 'pending',
        ]);

        // Create a pending payment log associated with this booking
        Pembayaran::create([
            'id_booking'        => $booking->id_booking,
            'metode_pembayaran' => $request->metode_pembayaran,
            'status_pembayaran' => 'belum_bayar',
        ]);

        return redirect()->back()->with('success', 'Pemesanan tiket berhasil dibuat! Silakan unggah bukti transfer.');
    }

    /**
     * Batalkan Pemesanan oleh Pengunjung (Visitor)
     */
    public function cancelBooking($id_booking)
    {
        $booking = Booking::findOrFail($id_booking);

        // Verify ownership
        if ($booking->id_user !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Only allow cancellation if booking is still pending
        if ($booking->status_booking !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Pemesanan ini tidak dapat dibatalkan karena sudah diproses.']);
        }

        DB::transaction(function () use ($booking) {
            $booking->update([
                'status_booking' => 'dibatalkan'
            ]);

            if ($booking->pembayaran) {
                $booking->pembayaran->update([
                    'status_pembayaran' => 'gagal'
                ]);
            }
        });

        return redirect()->back()->with('success', 'Pemesanan berhasil dibatalkan.');
    }

    /**
     * Unggah Bukti Pembayaran (Visitor)
     */
    public function uploadPembayaran(Request $request, $id_booking)
    {
        $request->validate([
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $booking = Booking::findOrFail($id_booking);

        // Verify ownership
        if ($booking->id_user !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $urlBukti = null;
        if ($request->hasFile('bukti_pembayaran')) {
            $file = $request->file('bukti_pembayaran');
            $filename = time() . '_bukti_' . $id_booking . '.' . $file->getClientOriginalExtension();

            // Ensure directory exists
            if (!file_exists(public_path('uploads/bukti_pembayaran'))) {
                mkdir(public_path('uploads/bukti_pembayaran'), 0777, true);
            }

            $file->move(public_path('uploads/bukti_pembayaran'), $filename);
            $urlBukti = '/uploads/bukti_pembayaran/' . $filename;
        }

        // Update or create pembayaran record
        $pembayaran = Pembayaran::updateOrCreate(
            ['id_booking' => $id_booking],
            [
                'bukti_pembayaran'  => $urlBukti,
                'status_pembayaran' => 'menunggu_verifikasi',
                'tanggal_bayar'     => now(),
            ]
        );

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil diunggah! Mohon tunggu konfirmasi admin.');
    }

    /**
     * Simpan Ulasan Baru (Visitor)
     */
    public function storeReview(Request $request)
    {
        $request->validate([
            'id_destinasi' => 'required|exists:destinasis,id_destinasi',
            'id_booking'   => 'nullable|exists:bookings,id_booking',
            'rating'       => 'required|integer|min:1|max:5',
            'ulasan'       => 'required|string',
        ]);

        if ($request->id_booking) {
            $existing = Review::where('id_booking', $request->id_booking)->exists();
            if ($existing) {
                return redirect()->back()->withErrors([
                    'id_booking' => 'Anda sudah memberikan ulasan untuk pesanan/tiket ini.'
                ]);
            }
        } else {
            $existing = Review::where('id_user', auth()->id())
                ->where('id_destinasi', $request->id_destinasi)
                ->whereNull('id_booking')
                ->exists();

            if ($existing) {
                return redirect()->back()->withErrors([
                    'id_destinasi' => 'Anda sudah memberikan ulasan untuk destinasi ini.'
                ]);
            }
        }

        Review::create([
            'id_user'      => auth()->id(),
            'id_destinasi' => $request->id_destinasi,
            'id_booking'   => $request->id_booking,
            'rating'       => $request->rating,
            'ulasan'       => $request->ulasan,
        ]);

        return redirect()->back()->with('success', 'Ulasan Anda berhasil disimpan. Terima kasih atas feedback Anda!');
    }

    // ==========================================
    // DISCOUNT CRUD (SUPER ADMIN)
    // ==========================================

    public function storeDiscount(Request $request)
    {
        abort_if(auth()->user()->role !== 'super_admin', 403);
        $request->validate([
            'kode_diskon'    => 'required|string|max:50|unique:discounts,kode_diskon',
            'persentase'     => 'required|integer|min:1|max:100',
            'status'         => 'required|in:aktif,tidak_aktif',
            'id_destinasi'   => 'nullable|exists:destinasis,id_destinasi',
            'berlaku_sampai' => 'nullable|date',
        ]);

        \App\Models\Discount::create([
            'kode_diskon'    => strtoupper($request->kode_diskon),
            'persentase'     => $request->persentase,
            'status'         => $request->status,
            'id_destinasi'   => $request->id_destinasi,
            'berlaku_sampai' => $request->berlaku_sampai,
        ]);

        \App\Models\LogAktivitas::create([
            'deskripsi' => 'Super Admin menambahkan kode promo baru (' . strtoupper($request->kode_diskon) . ' - ' . $request->persentase . '%).',
            'tipe' => 'update'
        ]);

        return redirect()->back()->with('success', 'Kode diskon berhasil ditambahkan!');
    }

    public function updateDiscount(Request $request, $id_diskon)
    {
        abort_if(auth()->user()->role !== 'super_admin', 403);
        $discount = \App\Models\Discount::findOrFail($id_diskon);

        $request->validate([
            'kode_diskon'    => 'required|string|max:50|unique:discounts,kode_diskon,' . $discount->id_diskon . ',id_diskon',
            'persentase'     => 'required|integer|min:1|max:100',
            'status'         => 'required|in:aktif,tidak_aktif',
            'id_destinasi'   => 'nullable|exists:destinasis,id_destinasi',
            'berlaku_sampai' => 'nullable|date',
        ]);

        $discount->update([
            'kode_diskon'    => strtoupper($request->kode_diskon),
            'persentase'     => $request->persentase,
            'status'         => $request->status,
            'id_destinasi'   => $request->id_destinasi,
            'berlaku_sampai' => $request->berlaku_sampai,
        ]);

        \App\Models\LogAktivitas::create([
            'deskripsi' => 'Super Admin memperbarui kode promo (' . strtoupper($request->kode_diskon) . ').',
            'tipe' => 'update'
        ]);

        return redirect()->back()->with('success', 'Kode diskon berhasil diperbarui!');
    }

    public function destroyDiscount($id_diskon)
    {
        abort_if(auth()->user()->role !== 'super_admin', 403);
        $discount = \App\Models\Discount::findOrFail($id_diskon);
        $code = $discount->kode_diskon;
        $discount->delete();

        \App\Models\LogAktivitas::create([
            'deskripsi' => 'Super Admin menghapus kode promo (' . $code . ').',
            'tipe' => 'peringatan'
        ]);

        return redirect()->back()->with('success', 'Kode diskon berhasil dihapus!');
    }
}
