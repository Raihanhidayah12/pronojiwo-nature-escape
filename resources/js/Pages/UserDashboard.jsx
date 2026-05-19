import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Compass, Ticket, Star, LogOut, Calendar, User,
    CreditCard, Upload, QrCode, Check, X, Shield, MapPin,
    ChevronRight, Plus, Minus, Tag, Info, Camera, Clock, AlertCircle,
    ArrowRight, CheckCircle2, RefreshCw, Send, Image as ImageIcon
} from 'lucide-react';

export default function UserDashboard({ auth, initialDestinations = [], initialBookings = [], initialReviews = [], pesans = [], discounts = [] }) {
    // Active menu tab state: 'jelajahi' | 'tiket' | 'ulasan'
    const [activeTab, setActiveTab] = useState('jelajahi');

    // Core data states
    const [destinations, setDestinations] = useState(initialDestinations);
    const [bookings, setBookings] = useState(initialBookings);
    const [reviews, setReviews] = useState(initialReviews);
    const [messages, setMessages] = useState(pesans);

    // UI Notification Toast
    const [toast, setToast] = useState(null);

    // Modal States
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedDestForDetail, setSelectedDestForDetail] = useState(null);

    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [selectedDestForBooking, setSelectedDestForBooking] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingQty, setBookingQty] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Bank BCA');

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
    const [paymentProofFile, setPaymentProofFile] = useState(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState(null);

    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [selectedBookingForTicket, setSelectedBookingForTicket] = useState(null);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedDestForReview, setSelectedDestForReview] = useState(null);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewHoverRating, setReviewHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    // Send Message states
    const [newMessageSubject, setNewMessageSubject] = useState('');
    const [newMessageText, setNewMessageText] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    // Success Animation Checkout Modal
    const [bookingSuccessData, setBookingSuccessData] = useState(null);

    // Promo / Discount Code States
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState(null);

    // Fallback Mock Data if database is empty
    const fallbackDestinations = [
        {
            id_destinasi: 1,
            nama_wisata: "Air Terjun Tumpak Sewu",
            harga_tiket: 20000,
            deskripsi: "Air terjun terindah di Jawa Timur dengan formasi melingkar megah menyerupai tirai raksasa setinggi 120 meter.",
            lokasi_rute: "Desa Sidomulyo, Kecamatan Pronojiwo, Lumajang",
            gambar: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80",
            rating_asli: 4.9,
            category: "Air Terjun"
        },
        {
            id_destinasi: 2,
            nama_wisata: "Goa Tetes",
            harga_tiket: 15000,
            deskripsi: "Perpaduan tebing belerang keemasan, air terjun segar, dan gua alam eksotis yang sangat Instagramable.",
            lokasi_rute: "Desa Sidomulyo, Kecamatan Pronojiwo, Lumajang",
            gambar: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80",
            rating_asli: 4.7,
            category: "Gua / Tebing"
        },
        {
            id_destinasi: 3,
            nama_wisata: "Air Terjun Kapas Biru",
            harga_tiket: 15000,
            deskripsi: "Air terjun tersembunyi dengan tirai air yang gagah berlatar tebing merah vertikal dan kabut pelangi abadi.",
            lokasi_rute: "Dusun Mulyoarjo, Desa Pronojiwo, Lumajang",
            gambar: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop&q=80",
            rating_asli: 4.8,
            category: "Air Terjun"
        },
        {
            id_destinasi: 4,
            nama_wisata: "Hutan Pinus Pronojiwo",
            harga_tiket: 10000,
            deskripsi: "Hutan pinus asri yang sejuk berselimut kabut lembut, sangat ideal untuk rekreasi santai dan berkemah.",
            lokasi_rute: "Desa Pronojiwo, Lumajang",
            gambar: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80",
            rating_asli: 4.6,
            category: "Hutan Wisata"
        }
    ];
    // Load fallbacks if empty
    useEffect(() => {
        if (!initialDestinations || initialDestinations.length === 0) {
            setDestinations(fallbackDestinations);
        }
    }, [initialDestinations]);

    // Sync Inertia props to state when they change
    useEffect(() => {
        setBookings(initialBookings || []);
    }, [initialBookings]);

    useEffect(() => {
        setReviews(initialReviews || []);
    }, [initialReviews]);

    useEffect(() => {
        setMessages(pesans || []);
    }, [pesans]);

    // Toast Trigger Helper
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Helper to display Inertia validation errors
    const displayErrors = (errors) => {
        if (errors && Object.keys(errors).length > 0) {
            const firstKey = Object.keys(errors)[0];
            showToast(errors[firstKey], "error");
        } else {
            showToast("Terjadi kesalahan sistem, silakan coba lagi.", "error");
        }
    };

    // Logout handler
    const handleLogout = () => {
        router.post(route('logout'));
    };

    // TAB 1: Detail & Booking handlers
    const openDetailModal = (dest) => {
        setSelectedDestForDetail(dest);
        setDetailModalOpen(true);
    };

    const openBookingModal = (dest) => {
        setSelectedDestForBooking(dest);
        setBookingQty(1);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setBookingDate(tomorrow.toISOString().split('T')[0]);
        setBookingSuccessData(null);
        setPromoCode('');
        setAppliedPromo(null);
        setPromoError(null);
        setCheckoutModalOpen(true);
    };

    const handleApplyPromo = () => {
        setPromoError(null);
        if (!promoCode.trim()) {
            setPromoError("Masukkan kode promo terlebih dahulu!");
            return;
        }

        const found = discounts.find(
            d => d.kode_diskon.toUpperCase() === promoCode.toUpperCase() && d.status === 'aktif'
        );

        if (!found) {
            setAppliedPromo(null);
            setPromoError("Kode promo tidak ditemukan atau tidak aktif!");
            return;
        }

        if (found.id_destinasi && found.id_destinasi !== selectedDestForBooking.id_destinasi) {
            setAppliedPromo(null);
            setPromoError("Kode promo ini tidak berlaku untuk destinasi wisata ini!");
            return;
        }

        if (found.berlaku_sampai && new Date(found.berlaku_sampai) < new Date()) {
            setAppliedPromo(null);
            setPromoError("Kode promo ini sudah kadaluarsa!");
            return;
        }

        setAppliedPromo(found);
        showToast(`Kode promo ${found.kode_diskon} berhasil diterapkan!`, "success");
    };

    const handleConfirmBooking = (e) => {
        e.preventDefault();
        if (!bookingDate) {
            showToast("Harap pilih tanggal kunjungan Anda!", "error");
            return;
        }

        const ticketCost = selectedDestForBooking.harga_tiket * bookingQty;
        const discountAmount = appliedPromo ? Math.round(ticketCost * (appliedPromo.persentase / 100)) : 0;
        const serviceFee = Math.round(ticketCost * 0.05);
        const totalHarga = (ticketCost - discountAmount) + serviceFee;

        const bookingData = {
            id_destinasi: selectedDestForBooking.id_destinasi,
            tanggal_kunjungan: bookingDate,
            jumlah_tiket: bookingQty,
            total_harga: totalHarga,
            metode_pembayaran: paymentMethod,
            kode_diskon: appliedPromo ? appliedPromo.kode_diskon : null
        };

        // Attempt real Laravel submission if routing is ready, fallback to front-end simulator
        router.post('/booking', bookingData, {
            preserveScroll: true,
            onSuccess: () => {
                showToast("Pemesanan tiket berhasil dibuat!", "success");
                setCheckoutModalOpen(false);
                setActiveTab('tiket');
            },
            onError: (errors) => {
                displayErrors(errors);
            }
        });
    };

    const handleCancelBooking = (bookingId) => {
        if (!window.confirm("Apakah Anda yakin ingin membatalkan pemesanan tiket ini?")) {
            return;
        }

        router.post(`/booking/${bookingId}/batal`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                showToast("Pemesanan tiket berhasil dibatalkan.", "success");
            },
            onError: (errors) => {
                displayErrors(errors);
            }
        });
    };

    // TAB 2: Upload Payment Proof
    const openPaymentModal = (booking) => {
        setSelectedBookingForPayment(booking);
        setPaymentProofFile(null);
        setPaymentProofPreview(null);
        setPaymentModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentProofFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProofPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        if (!paymentProofFile) {
            showToast("Silakan unggah foto bukti transfer terlebih dahulu!", "error");
            return;
        }

        const formData = new FormData();
        formData.append('bukti_pembayaran', paymentProofFile);
        formData.append('id_booking', selectedBookingForPayment.id_booking);

        router.post(`/booking/${selectedBookingForPayment.id_booking}/bayar`, formData, {
            onSuccess: () => {
                showToast("Bukti pembayaran berhasil diunggah!", "success");
                setPaymentModalOpen(false);
            },
            onError: (errors) => {
                displayErrors(errors);
            }
        });
    };

    // Open simulated E-ticket
    const openTicketModal = (booking) => {
        setSelectedBookingForTicket(booking);
        setTicketModalOpen(true);
    };

    // TAB 3: Write Review Handlers
    const openReviewModal = (booking) => {
        setSelectedBookingForReview(booking);
        setSelectedDestForReview({
            id_destinasi: booking.id_destinasi,
            nama_wisata: booking.destinasi?.nama_wisata
        });
        setReviewRating(5);
        setReviewText('');
        setReviewModalOpen(true);
    };

    const handleConfirmReview = (e) => {
        e.preventDefault();
        if (!reviewText.trim()) {
            showToast("Silakan tulis ulasan pengalamannya terlebih dahulu!", "error");
            return;
        }

        const reviewData = {
            id_destinasi: selectedDestForReview.id_destinasi,
            id_booking: selectedBookingForReview?.id_booking || null,
            rating: reviewRating,
            ulasan: reviewText
        };

        router.post('/review', reviewData, {
            onSuccess: () => {
                showToast("Ulasan berhasil dikirimkan!", "success");
                setReviewModalOpen(false);
            },
            onError: (errors) => {
                displayErrors(errors);
            }
        });
    };

    // TAB 4: Contact/Message Handler
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessageSubject.trim() || !newMessageText.trim()) {
            showToast("Harap isi subjek dan pesan terlebih dahulu!", "error");
            return;
        }

        setIsSendingMessage(true);
        router.post('/kontak', {
            nama_lengkap: auth.user.nama_lengkap,
            email: auth.user.email,
            subjek: newMessageSubject,
            pesan: newMessageText
        }, {
            preserveScroll: true,
            onSuccess: () => {
                showToast("Pesan Anda berhasil terkirim ke pengelola!", "success");
                setNewMessageSubject('');
                setNewMessageText('');
                setIsSendingMessage(false);
            },
            onError: (errors) => {
                displayErrors(errors);
                setIsSendingMessage(false);
            }
        });
    };

    // Format currency (IDR)
    const formatIDR = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(num);
    };

    // Format Date ID
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('id-ID', options);
    };

    // Get Avatar Initials
    const getInitials = (name) => {
        if (!name) return 'US';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-stone-50 text-gray-800 font-sans antialiased flex flex-col pb-16">
            <Head title="Dashboard Pengunjung — Pronojiwo Nature Escape" />

            {/* Custom Google Fonts & Ambient styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
                
                body {
                    background-color: #f5f5f4 !important;
                    font-family: 'Outfit', sans-serif;
                }
                
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }

                .glassmorphism {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }

                .glass-card-dark {
                    background: rgba(4, 47, 31, 0.85);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>

            {/* TOAST NOTIFICATION POPUP */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 transform translate-y-0 ${toast.type === 'success'
                    ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/90 border-red-500/40 text-red-300'
                    }`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
                    <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
                </div>
            )}

            {/* ── TOP NAV BAR ── */}
            <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-stone-200/60 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">

                        {/* Left Brand Identity */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-emerald-500/10">
                                WAP
                            </div>
                            <div className="leading-tight">
                                <span className="block font-extrabold text-[9px] text-emerald-700 tracking-widest uppercase">Pronojiwo</span>
                                <span className="block font-serif font-bold text-lg text-stone-950">Nature Escape</span>
                            </div>
                        </div>

                        {/* Mid-Right Visitor Welcome & Logout Panel */}
                        <div className="flex items-center gap-6">

                            {/* Halo Visitor Profile info */}
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Selamat Datang</p>
                                    <p className="text-sm font-bold text-stone-900 leading-tight">
                                        {auth?.user?.nama_lengkap || 'Pengunjung Setia'}
                                    </p>
                                </div>

                                {/* Round Avatar Badge */}
                                <div className="relative group">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-sm border-2 border-emerald-100 shadow-md transform hover:rotate-6 transition-all duration-300 cursor-pointer">
                                        {getInitials(auth?.user?.nama_lengkap)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                            </div>

                            {/* Separator line */}
                            <div className="h-8 w-px bg-stone-200" />

                            {/* Logout Action Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-red-50 hover:border-red-200 text-stone-600 hover:text-red-600 font-bold text-xs tracking-wide transition-all duration-300 active:scale-95"
                                title="Log out dari sistem"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Logout</span>
                            </button>

                        </div>
                    </div>
                </div>
            </nav>

            {/* ── CENTRALIZED CONTENT GRID ── */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 flex-1">

                {/* ─ WELCOME HERO SUMMARY CARD ─ */}
                <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest mb-3">
                                🟢 Akun Pengunjung Aktif
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-white">
                                Jelajahi Pronojiwo, Temukan Surga Tersembunyi!
                            </h1>
                            <p className="text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
                                Pesan tiket air terjun kelas dunia, simpan e-tiket dengan aman untuk discan di gerbang fisik, serta berikan ulasan jujur pasca kunjungan alam Anda.
                            </p>
                        </div>
                        <div className="flex gap-4 self-stretch md:self-auto shrink-0">
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <span className="block text-2xl font-black text-white">{bookings.length}</span>
                                <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-wider mt-1">Total Booking</span>
                            </div>
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <span className="block text-2xl font-black text-amber-400">
                                    {bookings.filter(b => b.status_booking === 'dikonfirmasi' || b.status_booking === 'selesai').length}
                                </span>
                                <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-wider mt-1">Kunjungan Lunas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TAB SELECTION BAR ── */}
                <div className="flex bg-white/80 p-2 rounded-2xl border border-stone-200/60 shadow-sm gap-2 mb-8">

                    {/* Tab 1: Catalog */}
                    <button
                        onClick={() => setActiveTab('jelajahi')}
                        className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 ${activeTab === 'jelajahi'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                            }`}
                    >
                        <Compass className={`w-4 h-4 ${activeTab === 'jelajahi' ? 'text-white' : 'text-stone-400'}`} />
                        <span>Jelajahi & Pesan Tiket</span>
                    </button>

                    {/* Tab 2: My Tickets */}
                    <button
                        onClick={() => setActiveTab('tiket')}
                        className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 relative ${activeTab === 'tiket'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                            }`}
                    >
                        <Ticket className={`w-4 h-4 ${activeTab === 'tiket' ? 'text-white' : 'text-stone-400'}`} />
                        <span>Tiket Saya</span>
                        {bookings.filter(b => b.status_booking === 'pending' && !b.pembayaran).length > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white animate-ping"></span>
                        )}
                    </button>

                    {/* Tab 3: Reviews */}
                    <button
                        onClick={() => setActiveTab('ulasan')}
                        className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 ${activeTab === 'ulasan'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                            }`}
                    >
                        <Star className={`w-4 h-4 ${activeTab === 'ulasan' ? 'text-white' : 'text-stone-400'}`} />
                        <span>Ulasan Saya</span>
                    </button>
                </div>

                {/* ─── TAB CONTENTS ─── */}
                <div className="transition-all duration-500">

                    {/* ============================================================== */}
                    {/* TAB 1: JELAJAHI & PESAN TIKET                                  */}
                    {/* ============================================================== */}
                    {activeTab === 'jelajahi' && (
                        <div className="space-y-6">

                            {/* Grid catalog layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {destinations.map((dest) => (
                                    <div
                                        key={dest.id_destinasi}
                                        className="bg-white rounded-3xl border border-stone-200/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                                    >
                                        {/* Destination image with zoom effect */}
                                        <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                                            <img
                                                src={dest.gambar}
                                                alt={dest.nama_wisata}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Category Tag overlay */}
                                            <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold bg-stone-900/60 backdrop-blur-md text-white tracking-widest uppercase">
                                                {dest.category || "Wisata Alam"}
                                            </span>

                                            {/* Price Tag overlay */}
                                            <span className="absolute bottom-4 right-4 inline-flex items-center px-3.5 py-1.5 rounded-2xl text-xs font-black bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
                                                {formatIDR(dest.harga_tiket)}
                                            </span>
                                        </div>

                                        {/* Card info body */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs mb-2">
                                                <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                                                <span>{dest.rating_asli || "4.8"} (Rating)</span>
                                            </div>

                                            <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors mb-2">
                                                {dest.nama_wisata}
                                            </h3>

                                            <p className="text-xs text-stone-400 font-semibold flex items-center gap-1 mb-3">
                                                <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-300" />
                                                <span className="truncate">{dest.lokasi_rute}</span>
                                            </p>

                                            <p className="text-xs text-stone-500 leading-relaxed font-normal mb-5 flex-1 line-clamp-3">
                                                {dest.deskripsi}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2.5 mt-auto">
                                                <button
                                                    onClick={() => openBookingModal(dest)}
                                                    className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 group/btn transition-all duration-300 active:scale-98 shadow-sm hover:shadow-emerald-500/10"
                                                >
                                                    <span>Pesan Tiket Masuk</span>
                                                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => openDetailModal(dest)}
                                                    className="w-full py-3 rounded-2xl bg-transparent border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-xs tracking-wide transition-colors"
                                                >
                                                    Lihat Detail Lengkap
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* TAB 2: TIKET SAYA                                              */}
                    {/* ============================================================== */}
                    {activeTab === 'tiket' && (
                        <div className="space-y-6">

                            {bookings.length === 0 ? (
                                <div className="text-center p-12 bg-white rounded-3xl border border-stone-200/50 shadow-sm max-w-lg mx-auto">
                                    <Ticket className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-stone-900 mb-1">Belum Ada Riwayat Reservasi</h3>
                                    <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed mb-6">
                                        Anda belum memesan tiket destinasi Pronojiwo. Cari destinasi favorit Anda di tab Jelajahi untuk memesan.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('jelajahi')}
                                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs tracking-wide transition-all shadow-md shadow-emerald-500/10"
                                    >
                                        Cari Destinasi
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {bookings.map((booking) => {
                                        // Determine status style classes
                                        let statusConfig = {
                                            bg: 'bg-amber-100 border-amber-200 text-amber-800',
                                            label: 'Menunggu Pembayaran',
                                            desc: 'Segera bayar & unggah bukti transfer'
                                        };

                                        if (booking.pembayaran && booking.pembayaran.status_pembayaran === 'menunggu_verifikasi') {
                                            statusConfig = {
                                                bg: 'bg-amber-100 border-amber-200 text-amber-800',
                                                label: 'Menunggu Verifikasi',
                                                desc: 'Bukti pembayaran ditinjau admin'
                                            };
                                        } else if (booking.status_booking === 'dikonfirmasi') {
                                            statusConfig = {
                                                bg: 'bg-emerald-100 border-emerald-200 text-emerald-800',
                                                label: 'Lunas / Dikonfirmasi',
                                                desc: 'Gunakan E-Tiket untuk scan di loket'
                                            };
                                        } else if (booking.status_booking === 'selesai') {
                                            statusConfig = {
                                                bg: 'bg-stone-100 border-stone-200 text-stone-800',
                                                label: 'Selesai Dikunjungi',
                                                desc: 'Terima kasih atas petualangan Anda'
                                            };
                                        } else if (booking.status_booking === 'dibatalkan') {
                                            statusConfig = {
                                                bg: 'bg-rose-100 border-rose-200 text-rose-800',
                                                label: 'Dibatalkan / Gagal',
                                                desc: 'Pemesanan dibatalkan atau pembayaran ditolak'
                                            };
                                        }

                                        return (
                                            <div
                                                key={booking.id_booking}
                                                className="bg-white rounded-3xl border border-stone-200/50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:border-emerald-500/20 transition-all duration-300"
                                            >
                                                {/* Left details */}
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                                        <Ticket className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">
                                                                Kode: PRN-{booking.id_booking}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${statusConfig.bg}`}>
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-base font-bold text-stone-900 mb-1">
                                                            {booking.destinasi?.nama_wisata}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-xs text-stone-400 font-semibold flex-wrap">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3.5 h-3.5 text-stone-300" />
                                                                {formatDate(booking.tanggal_kunjungan)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-3.5 h-3.5 text-stone-300" />
                                                                {booking.jumlah_tiket} Tiket
                                                            </span>
                                                            <span className="font-bold text-stone-900">
                                                                Total: {formatIDR(booking.total_harga)}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-stone-400 italic mt-2">
                                                            * {statusConfig.desc}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right CTA Actions per booking status */}
                                                <div className="flex gap-3 w-full md:w-auto self-stretch md:self-auto justify-end shrink-0">
                                                    {/* If pending and no payment proof has been uploaded */}
                                                    {booking.status_booking === 'pending' && (!booking.pembayaran || booking.pembayaran.status_pembayaran === 'belum_bayar' || booking.pembayaran.status_pembayaran === 'gagal') && (
                                                        <button
                                                            onClick={() => openPaymentModal(booking)}
                                                            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-emerald-500/10 active:scale-97"
                                                        >
                                                            <CreditCard className="w-4 h-4" />
                                                            <span>Bayar Sekarang</span>
                                                        </button>
                                                    )}

                                                    {/* If pending, visitor can cancel their booking */}
                                                    {booking.status_booking === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id_booking)}
                                                            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs tracking-wide transition-all active:scale-97"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            <span>Batal Pesan</span>
                                                        </button>
                                                    )}

                                                    {/* If payment submitted, pending verification */}
                                                    {booking.status_booking === 'pending' && booking.pembayaran && booking.pembayaran.status_pembayaran === 'menunggu_verifikasi' && (
                                                        <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-100">
                                                            <Clock className="w-4 h-4 animate-spin" />
                                                            <span>Verifikasi Pembayaran</span>
                                                        </div>
                                                    )}

                                                    {/* If payment verified & confirmed */}
                                                    {booking.status_booking === 'dikonfirmasi' && (
                                                        <button
                                                            onClick={() => openTicketModal(booking)}
                                                            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wide transition-all active:scale-97 shadow-sm"
                                                        >
                                                            <QrCode className="w-4 h-4" />
                                                            <span>Lihat E-Tiket</span>
                                                        </button>
                                                    )}

                                                    {/* If completed trip */}
                                                    {booking.status_booking === 'selesai' && (
                                                        <button
                                                            onClick={() => openReviewModal(booking.id_destinasi, booking.destinasi?.nama_wisata)}
                                                            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold text-xs tracking-wide transition-all active:scale-97"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                            <span>Tulis Ulasan</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* TAB 3: ULASAN SAYA                                             */}
                    {/* ============================================================== */}
                    {activeTab === 'ulasan' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Write Review Section / Eligible visits */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                    Destinasi Siap Diulas
                                </h3>

                                {/* Filter completed trips or lunas to leave feedback */}
                                {bookings.filter(b => b.status_booking === 'selesai' || b.status_booking === 'dikonfirmasi').length === 0 ? (
                                    <div className="p-8 text-center bg-white rounded-3xl border border-stone-200/50 shadow-sm">
                                        <p className="text-xs text-stone-400 font-semibold leading-relaxed">
                                            Belum ada perjalanan Anda yang selesai dikunjungi untuk saat ini. Ulasan dapat ditulis setelah kunjungan alam Anda terkonfirmasi.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {bookings
                                            .filter(b => b.status_booking === 'selesai' || b.status_booking === 'dikonfirmasi')
                                            .map((booking) => {
                                                // Check if already reviewed in local or db reviews state for this specific booking
                                                const hasReviewed = reviews.some(r => r.id_booking === booking.id_booking);

                                                return (
                                                    <div
                                                        key={booking.id_booking}
                                                        className="p-5 rounded-3xl bg-white border border-stone-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
                                                    >
                                                        <div>
                                                            <h4 className="font-bold text-stone-900 text-sm mb-1">
                                                                {booking.destinasi?.nama_wisata}
                                                            </h4>
                                                            <p className="text-[11px] text-stone-400 font-semibold flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                Kunjungan: {formatDate(booking.tanggal_kunjungan)}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            {hasReviewed ? (
                                                                <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                    <Check className="w-3.5 h-3.5" />
                                                                    Sudah Diulas
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => openReviewModal(booking)}
                                                                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs tracking-wide transition-all active:scale-97"
                                                                >
                                                                    Berikan Rating & Ulasan
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Visitor's Submitted Reviews List */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    Daftar Ulasan Saya
                                </h3>

                                {reviews.length === 0 ? (
                                    <div className="p-6 text-center bg-white rounded-3xl border border-stone-200/50 text-stone-400 text-xs italic">
                                        Anda belum pernah mengirimkan ulasan ulasan.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((rev) => (
                                            <div
                                                key={rev.id_review}
                                                className="bg-white p-5 rounded-3xl border border-stone-200/50 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-stone-900 text-xs truncate max-w-[150px]">
                                                        {rev.destinasi?.nama_wisata || "Destinasi Wisata"}
                                                    </span>
                                                    {/* Star Display */}
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 stroke-amber-500' : 'text-stone-200'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-stone-500 leading-relaxed italic">
                                                    "{rev.ulasan}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>

                {/* ── SECTION: PESAN & BALASAN KAMI ── */}
                <div className="mt-12 pt-10 border-t border-stone-200/80">
                    <h3 className="text-xl font-bold font-serif text-stone-900 mb-6 flex items-center gap-2.5">
                        <Send className="w-5 h-5 text-emerald-600 animate-pulse" />
                        <span>Pesan & Balasan Admin</span>
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column: Kirim Pesan Form */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200/50 shadow-sm h-fit">
                            <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase tracking-wider">Kirim Pesan ke Admin</h4>
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                                        Subjek Pertanyaan / Laporan
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newMessageSubject}
                                        onChange={e => setNewMessageSubject(e.target.value)}
                                        placeholder="Contoh: Info Rute Goa Tetes"
                                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 text-stone-850"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                                        Isi Pesan
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={newMessageText}
                                        onChange={e => setNewMessageText(e.target.value)}
                                        placeholder="Tuliskan pertanyaan, keluhan, atau saran Anda ke pengelola di sini..."
                                        className="w-full p-4 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 text-stone-850"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSendingMessage}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    {isSendingMessage ? "Mengirim..." : "Kirim Pesan"}
                                </button>
                            </form>
                        </div>

                        {/* Right column: List of messages */}
                        <div className="lg:col-span-2 space-y-4">
                            <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase tracking-wider">Kotak Masuk & Balasan</h4>
                            {(!messages || messages.length === 0) ? (
                                <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/50 shadow-sm h-full flex flex-col justify-center items-center">
                                    <p className="text-xs text-stone-400 font-semibold leading-relaxed">
                                        Belum ada riwayat pesan terkirim. Gunakan formulir di sebelah kiri untuk mulai bertanya atau menyampaikan keluhan Anda ke pengelola wisata.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id_pesan}
                                            className="p-5 rounded-3xl bg-white border border-stone-200/50 shadow-sm relative overflow-hidden flex flex-col justify-between"
                                        >
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-stone-100 mb-2.5">
                                                    <div>
                                                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Subjek</span>
                                                        <h4 className="font-extrabold text-xs text-stone-900 truncate max-w-[130px]">{msg.subjek}</h4>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold border uppercase tracking-wider ${msg.status === 'sudah_dibalas'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                                        }`}>
                                                        {msg.status === 'sudah_dibalas' ? 'Dibalas' : 'Pending'}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
                                                    "{msg.pesan}"
                                                </p>
                                            </div>

                                            {msg.status === 'sudah_dibalas' && msg.balasan ? (
                                                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100/60 mt-1">
                                                    <span className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-wider flex items-center gap-1 mb-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                        Tanggapan Pengelola:
                                                    </span>
                                                    <p className="text-[11px] text-emerald-950 font-medium leading-relaxed italic">
                                                        "{msg.balasan}"
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-1 bg-amber-50/50 border border-amber-100/40 p-2.5 rounded-xl">
                                                    <Clock className="w-3 h-3 animate-pulse text-amber-500" />
                                                    <span>Menunggu tanggapan</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* ============================================================== */}
            {/* MODAL 0: DETAIL DESTINASI LENGKAP                              */}
            {/* ============================================================== */}
            {detailModalOpen && selectedDestForDetail && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm py-12 px-4 flex">
                    <div className="m-auto bg-white rounded-[2rem] w-full max-w-2xl border border-stone-200 shadow-2xl relative overflow-hidden transform scale-100 transition-all animate-[modalFadeIn_0.2s_ease-out]">
                        
                        {/* Tombol Tutup Floating */}
                        <button
                            onClick={() => setDetailModalOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black text-white backdrop-blur-md transition-all active:scale-95"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        
                        {/* Header Image Full Width */}
                        <div className="h-64 sm:h-80 w-full relative">
                            <img 
                                src={selectedDestForDetail.gambar} 
                                alt={selectedDestForDetail.nama_wisata}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                            
                            {/* Text & Tags di atas gambar */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-3 py-1.5 mb-3 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white tracking-widest uppercase shadow-lg border border-emerald-400">
                                    {selectedDestForDetail.category || "Wisata Alam"}
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-2 tracking-tight">
                                    {selectedDestForDetail.nama_wisata}
                                </h2>
                                <p className="text-sm text-stone-300 flex items-center gap-1.5 font-medium">
                                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                                    {selectedDestForDetail.lokasi_rute}
                                </p>
                            </div>
                        </div>

                        {/* Konten Detail */}
                        <div className="p-6 sm:p-8">
                            
                            {/* 4 Quick Info Boxes */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                <div className="bg-stone-50 rounded-2xl p-4 text-center border border-stone-200">
                                    <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                                    <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-1">Jam Buka</span>
                                    <span className="block text-sm font-bold text-stone-800">07:00 - 16:00</span>
                                </div>
                                <div className="bg-stone-50 rounded-2xl p-4 text-center border border-stone-200">
                                    <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                                    <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-1">Rating</span>
                                    <span className="block text-sm font-bold text-stone-800">{selectedDestForDetail.rating_asli || "4.8"} / 5.0</span>
                                </div>
                                <div className="bg-stone-50 rounded-2xl p-4 text-center border border-stone-200">
                                    <Info className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                    <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-1">Fasilitas</span>
                                    <span className="block text-sm font-bold text-stone-800">Lengkap</span>
                                </div>
                                <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-200">
                                    <Ticket className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                                    <span className="block text-[9px] text-emerald-600/80 font-bold uppercase tracking-widest mb-1">Harga Tiket</span>
                                    <span className="block text-sm font-black text-emerald-800">{formatIDR(selectedDestForDetail.harga_tiket)}</span>
                                </div>
                            </div>

                            {/* Deskripsi Lengkap */}
                            <div className="mb-8 bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                                    <Compass className="w-5 h-5 text-emerald-600" />
                                    Tentang Destinasi
                                </h3>
                                <p className="text-sm text-stone-600 leading-relaxed font-medium">
                                    {selectedDestForDetail.deskripsi}
                                    <br /><br />
                                    <span className="text-stone-500">Destinasi wisata alam di Pronojiwo ini menawarkan pengalaman petualangan epik yang tidak terlupakan. Dengan bentang alam yang memukau, Anda dapat menikmati udara segar dan mengabadikan momen terbaik Anda di sini. Harga tiket yang tertera sudah termasuk asuransi mitigasi bencana dan akses ke semua fasilitas umum dasar seperti toilet bersih, area istirahat, dan spot foto utama.</span>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDetailModalOpen(false)}
                                    className="flex-1 py-4 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-sm transition-colors active:scale-95"
                                >
                                    Kembali
                                </button>
                                <button
                                    onClick={() => {
                                        setDetailModalOpen(false);
                                        openBookingModal(selectedDestForDetail);
                                    }}
                                    className="flex-[2] py-4 rounded-2xl bg-stone-900 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-700/20 transition-all active:scale-98 flex justify-center items-center gap-2 group"
                                >
                                    <span>Lanjut Pesan Tiket</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 1: CHECKOUT / PESAN TIKET                                */}
            {/* ============================================================== */}
            {checkoutModalOpen && selectedDestForBooking && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm py-12 px-4 flex">
                    <div className="m-auto bg-white rounded-[2rem] w-full max-w-lg border border-gray-100 shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8 sm:p-10 relative transform scale-100 transition-all duration-300 animate-[modalFadeIn_0.25s_ease-out]">

                        {/* Close button */}
                        <button
                            onClick={() => setCheckoutModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-all active:scale-95"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {!bookingSuccessData ? (
                            <>
                                <h3 className="text-2xl font-bold text-black tracking-tight mb-2">
                                    Checkout Tiket Wisata
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mb-8 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                    {selectedDestForBooking.nama_wisata}
                                </p>

                                <form onSubmit={handleConfirmBooking} className="space-y-6">

                                    {/* Dest Info Card */}
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex justify-between items-center text-xs">
                                        <div>
                                            <span className="block font-bold text-black uppercase tracking-widest text-[10px]">Harga Tiket Masuk</span>
                                            <span className="text-[10px] text-gray-500 font-medium mt-1 block">* Sudah termasuk asuransi mitigasi</span>
                                        </div>
                                        <span className="text-lg font-black text-black">
                                            {formatIDR(selectedDestForBooking.harga_tiket)} <span className="text-xs text-gray-400 font-medium">/ orang</span>
                                        </span>
                                    </div>

                                    {/* Date selection input */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                            Pilih Tanggal Kunjungan
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                required
                                                value={bookingDate}
                                                onChange={e => setBookingDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black font-semibold transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Quantity and Calculator row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                                Jumlah Tiket
                                            </label>
                                            <div className="flex items-center border border-gray-200 bg-gray-50/50 rounded-xl overflow-hidden py-2 px-3">
                                                <button
                                                    type="button"
                                                    disabled={bookingQty <= 1}
                                                    onClick={() => setBookingQty(prev => prev - 1)}
                                                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 disabled:opacity-30 transition-colors"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="flex-1 text-center font-bold text-sm text-black">
                                                    {bookingQty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setBookingQty(prev => prev + 1)}
                                                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Dropdown payment method */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                                Metode Pembayaran
                                            </label>
                                            <select
                                                value={paymentMethod}
                                                onChange={e => setPaymentMethod(e.target.value)}
                                                className="w-full px-3.5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black font-semibold appearance-none cursor-pointer transition-all"
                                            >
                                                <option value="Bank BCA">Transfer BCA</option>
                                                <option value="Bank Mandiri">Transfer Mandiri</option>
                                                <option value="Bank BRI">Transfer BRI</option>
                                                <option value="Gopay">GoPay E-Wallet</option>
                                                <option value="Qris">QRIS Instan</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Promo Code Input */}
                                    <div className="border-t border-gray-100 pt-6">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                            Punya Kode Promo / Voucher?
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="CONTOH: PRONO20"
                                                    value={promoCode}
                                                    onChange={e => setPromoCode(e.target.value.toUpperCase())}
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black font-bold uppercase tracking-wider transition-all"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleApplyPromo}
                                                className="px-6 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition-all active:scale-[0.98]"
                                            >
                                                Gunakan
                                            </button>
                                        </div>
                                        {promoError && (
                                            <p className="text-red-500 text-[11px] mt-2 font-semibold">
                                                * {promoError}
                                            </p>
                                        )}
                                        {appliedPromo && (
                                            <p className="text-emerald-600 text-[11px] mt-2 font-bold flex items-center gap-1">
                                                <Check className="w-3 h-3" />
                                                Promo diterapkan: Potongan {appliedPromo.persentase}%
                                            </p>
                                        )}
                                    </div>

                                    {/* Auto Total Calculation Display */}
                                    <div className="border-t border-gray-100 pt-6 space-y-2.5">
                                        <div className="flex justify-between text-xs text-gray-500 font-medium">
                                            <span>Tiket Kunjungan ({selectedDestForBooking.nama_wisata}):</span>
                                            <span className="text-black font-semibold">{formatIDR(selectedDestForBooking.harga_tiket)} × {bookingQty}</span>
                                        </div>
                                        {appliedPromo && (
                                            <div className="flex justify-between text-xs text-emerald-600 font-bold">
                                                <span>Diskon ({appliedPromo.kode_diskon} - {appliedPromo.persentase}%):</span>
                                                <span>-{formatIDR(Math.round(selectedDestForBooking.harga_tiket * bookingQty * (appliedPromo.persentase / 100)))}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xs text-gray-500 font-medium">
                                            <span>Biaya Layanan Daring (5%):</span>
                                            <span className="text-black font-semibold">{formatIDR(Math.round(selectedDestForBooking.harga_tiket * bookingQty * 0.05))}</span>
                                        </div>
                                        <div className="border-t border-dashed border-gray-200 mt-2 pt-4 flex items-center justify-between">
                                            <div>
                                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">TOTAL BAYAR</span>
                                                <span className="text-[9px] text-gray-400 font-medium mt-0.5 block">Sudah termasuk pajak & layanan</span>
                                            </div>
                                            <span className="text-2xl font-black text-black tracking-tight">
                                                {formatIDR(
                                                    Math.round(
                                                        (selectedDestForBooking.harga_tiket * bookingQty) -
                                                        (appliedPromo ? Math.round(selectedDestForBooking.harga_tiket * bookingQty * (appliedPromo.persentase / 100)) : 0) +
                                                        (selectedDestForBooking.harga_tiket * bookingQty * 0.05)
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTAs */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setCheckoutModalOpen(false)}
                                            className="flex-1 py-4 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-bold text-xs tracking-wide rounded-xl text-gray-600 transition-all"
                                        >
                                            Batalkan
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-4 bg-black hover:bg-gray-900 text-white font-bold text-xs tracking-wide rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                        >
                                            Konfirmasi Pemesanan
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            /* SUCCESS SCREEN (Minimalist) */
                            <div className="text-center py-8 animate-[modalFadeIn_0.35s_ease-out]">
                                <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white mx-auto mb-6 shadow-xl animate-[bounce_1s_infinite]">
                                    <Check className="w-10 h-10 stroke-[3]" />
                                </div>
                                <h3 className="text-3xl font-bold text-black tracking-tight mb-3">
                                    Pemesanan Berhasil!
                                </h3>
                                <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed mb-8">
                                    Tiket Anda ke <strong className="text-black">{bookingSuccessData.destinasi?.nama_wisata}</strong> untuk tanggal <strong className="text-black">{formatDate(bookingSuccessData.tanggal_kunjungan)}</strong> telah diterbitkan dengan status <strong className="text-emerald-500">Menunggu Pembayaran</strong>.
                                </p>

                                {/* Ticket Details Summary Box */}
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 text-left space-y-3">
                                    <div className="flex justify-between"><span className="text-gray-400 text-xs">Kode Booking:</span><span className="font-bold text-black text-xs">PRN-{bookingSuccessData.id_booking}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-400 text-xs">Jumlah Tiket:</span><span className="font-bold text-black text-xs">{bookingSuccessData.jumlah_tiket} Tiket</span></div>
                                    <div className="flex justify-between"><span className="text-gray-400 text-xs">Metode Bayar:</span><span className="font-bold text-black text-xs">{paymentMethod}</span></div>
                                    <div className="pt-4 border-t border-gray-200 mt-2 flex justify-between items-center">
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Tagihan:</span>
                                        <span className="text-2xl font-black text-black tracking-tight">{formatIDR(bookingSuccessData.total_harga)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setCheckoutModalOpen(false);
                                        setActiveTab('tiket');
                                    }}
                                    className="w-full py-4 bg-black hover:bg-gray-900 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    Lihat Riwayat & Unggah Pembayaran
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 2: UPLOAD BUKTI PEMBAYARAN                               */}
            {/* ============================================================== */}
            {paymentModalOpen && selectedBookingForPayment && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md border border-stone-200 shadow-2xl p-8 relative animate-[modalFadeIn_0.25s_ease-out]">

                        <button
                            onClick={() => setPaymentModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">
                            Kirim Bukti Transfer
                        </h3>
                        <p className="text-xs text-stone-400 mb-6">
                            Unggah bukti pembayaran Anda untuk diverifikasi oleh administrator.
                        </p>

                        {/* Payment Target Instructions */}
                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-stone-800 text-xs mb-6 space-y-2">
                            <div className="font-bold text-emerald-950 uppercase tracking-wide text-[10px] mb-1">🏦 Rekening Tujuan Transfer</div>
                            <div className="flex justify-between"><span>Bank Mandiri:</span><span className="font-bold">143-002-234-8991</span></div>
                            <div className="flex justify-between"><span>Bank BCA:</span><span className="font-bold">011-238-1294</span></div>
                            <div className="flex justify-between"><span>Atas Nama:</span><span className="font-bold">Pronojiwo Nature Escape</span></div>
                            <div className="flex justify-between border-t border-emerald-200/50 pt-2 font-bold text-emerald-900">
                                <span>Total Tagihan:</span>
                                <span>{formatIDR(selectedBookingForPayment.total_harga)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitPayment} className="space-y-6">

                            {/* File Upload Box */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide">
                                    Unggah Bukti Gambar (.jpg, .png)
                                </label>

                                {!paymentProofPreview ? (
                                    <div className="border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center bg-stone-50 hover:bg-stone-100/50 hover:border-emerald-500/50 transition-colors cursor-pointer relative group">
                                        <input
                                            type="file"
                                            required
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                        />
                                        <Camera className="w-8 h-8 text-stone-300 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
                                        <span className="block text-xs font-bold text-stone-700">Pilih Bukti Pembayaran</span>
                                        <span className="block text-[10px] text-stone-400 mt-1">Ukuran maksimal file 2 MB</span>
                                    </div>
                                ) : (
                                    <div className="relative rounded-2xl overflow-hidden border border-stone-200 h-48 bg-stone-100 flex items-center justify-center">
                                        <img
                                            src={paymentProofPreview}
                                            alt="Preview Bukti"
                                            className="w-full h-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setPaymentProofFile(null); setPaymentProofPreview(null); }}
                                            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide rounded-2xl shadow-lg shadow-emerald-500/10 transition-colors"
                            >
                                Kirim Bukti Pembayaran
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 3: VIEW EXCLUSIVE E-TICKET                               */}
            {/* ============================================================== */}
            {/* ============================================================== */}
            {/* MODAL 3: VIEW EXCLUSIVE E-TICKET                               */}
            {/* ============================================================== */}
            {ticketModalOpen && selectedBookingForTicket && (() => {
                const visitDate = new Date(selectedBookingForTicket.tanggal_kunjungan);
                visitDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isExpired = visitDate < today;

                return (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="bg-transparent w-full max-w-sm relative animate-[modalFadeIn_0.25s_ease-out]">

                            {/* E-Ticket layout design */}
                            <div className="rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-white">

                                {/* Ticket header with travel theme */}
                                <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-white text-center relative">
                                    <div className="absolute top-4 left-4 text-[10px] font-black uppercase text-emerald-400 tracking-wider">Pronojiwo Escape</div>
                                    <div className="absolute top-4 right-4 text-[10px] font-black uppercase text-emerald-400 tracking-wider">E-TICKET</div>

                                    <Ticket className="w-10 h-10 text-emerald-400 mx-auto mt-4 mb-2 opacity-90" />
                                    <h3 className="text-xl font-bold font-serif">{selectedBookingForTicket.destinasi?.nama_wisata}</h3>
                                    <p className="text-[10px] text-emerald-300 font-semibold tracking-wider mt-1 uppercase">Official Entrance Voucher</p>
                                </div>

                                {/* Ticket body details */}
                                <div className="p-6 space-y-4 text-xs border-b-2 border-dashed border-stone-200 relative bg-stone-50/50">
                                    {/* Left/Right notch decorations */}
                                    <div className="absolute -left-3 -bottom-3 w-6 h-6 rounded-full bg-black/50" />
                                    <div className="absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-black/50" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-[10px] text-stone-400 font-bold uppercase">Nama Pengunjung</span>
                                            <span className="font-bold text-stone-900 text-sm">{auth?.user?.nama_lengkap || "Pengunjung"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-stone-400 font-bold uppercase">Kode Booking</span>
                                            <span className="font-bold text-emerald-800 text-sm">PRN-{selectedBookingForTicket.id_booking}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-stone-400 font-bold uppercase">Tanggal Kunjungan</span>
                                            <span className="font-bold text-stone-900">{formatDate(selectedBookingForTicket.tanggal_kunjungan)}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-stone-400 font-bold uppercase">Jumlah Tiket</span>
                                            <span className="font-bold text-stone-900">{selectedBookingForTicket.jumlah_tiket} Orang</span>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code and barcode ticket stub */}
                                <div className="p-6 bg-white text-center space-y-4">
                                    {/* Simulated QR code vector illustration */}
                                    {isExpired ? (
                                        <div className="w-40 h-40 mx-auto bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                                            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-2">
                                                <AlertCircle className="w-5 h-5" />
                                            </div>
                                            <span className="block text-xs font-black text-rose-700 uppercase tracking-wider">Tiket Kadaluarsa</span>
                                            <span className="block text-[9px] text-rose-400 font-semibold mt-1">Tanggal kunjungan telah lewat</span>
                                        </div>
                                    ) : (
                                        <div className="w-40 h-40 mx-auto bg-stone-100 p-3 rounded-2xl border border-stone-200/60 flex items-center justify-center relative group">
                                            <svg className="w-full h-full text-stone-900" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                {/* Outer corners */}
                                                <path d="M10 10h20v20H10zM70 10h20v20H70zM10 70h20v20H10z" fill="currentColor" />
                                                <path d="M15 15h10v10H15zM75 15h10v10H75zM15 75h10v10H15z" fill="white" />

                                                {/* Randomized barcode grids to simulate real QR */}
                                                <path d="M40 10h10v10H40zM55 10h10v5H55zM45 25h15v5H45zM35 35h5v15h-5zM50 35h10v10H50zM65 35h5v5h-5zM75 40h15v5H75z" fill="currentColor" />
                                                <path d="M10 40h15v5H10zM15 50h5v10H15zM30 55h20v5H30zM55 55h10v15H55zM70 50h10v10H70zM85 55h5v20H85z" fill="currentColor" />
                                                <path d="M35 70h15v5H35zM45 80h20v10H45zM70 70h10v15H70zM75 90h10v5H75zM30 85h10v5H30z" fill="currentColor" />
                                            </svg>
                                            <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-[1px]">
                                                <span className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase py-1 px-3.5 rounded-full shadow-md">SCAN AT GATE</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-[10px] text-stone-400 font-medium">
                                        {isExpired ? (
                                            <span className="text-rose-500 font-bold">* E-Tiket ini sudah tidak berlaku untuk masuk area wisata.</span>
                                        ) : (
                                            <span>* Tunjukkan QR Code ini kepada petugas loket Pronojiwo untuk verifikasi fisik masuk area wisata.</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setTicketModalOpen(false)}
                                        className="w-full py-3 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs tracking-wide rounded-2xl transition-colors"
                                    >
                                        Tutup Tiket
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ============================================================== */}
            {/* MODAL 4: WRITE REVIEW                                          */}
            {/* ============================================================== */}
            {reviewModalOpen && selectedDestForReview && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md border border-stone-200 shadow-2xl p-8 relative animate-[modalFadeIn_0.25s_ease-out]">

                        <button
                            onClick={() => setReviewModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-xl font-bold font-serif text-stone-900 mb-1">
                            Ulas Destinasi Anda
                        </h3>
                        <p className="text-xs text-stone-400 font-semibold mb-6 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            {selectedDestForReview.nama_wisata}
                        </p>

                        <form onSubmit={handleConfirmReview} className="space-y-6">

                            {/* Star Rating select row */}
                            <div className="text-center space-y-2">
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                                    Berikan Rating Bintang
                                </label>

                                <div className="flex justify-center items-center gap-2">
                                    {[...Array(5)].map((_, i) => {
                                        const ratingValue = i + 1;
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setReviewRating(ratingValue)}
                                                onMouseEnter={() => setReviewHoverRating(ratingValue)}
                                                onMouseLeave={() => setReviewHoverRating(0)}
                                                className="transition-transform duration-100 hover:scale-125 focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-9 h-9 ${ratingValue <= (reviewHoverRating || reviewRating)
                                                        ? 'fill-amber-400 stroke-amber-400 text-amber-400'
                                                        : 'text-stone-200'
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className="block text-[11px] font-bold text-amber-600 uppercase tracking-widest mt-1">
                                    {reviewRating === 5 && "Sangat Puas / Sempurna"}
                                    {reviewRating === 4 && "Puas / Bagus"}
                                    {reviewRating === 3 && "Cukup Bagus / Standar"}
                                    {reviewRating === 2 && "Kurang Puas / Buruk"}
                                    {reviewRating === 1 && "Sangat Buruk / Kecewa"}
                                </span>
                            </div>

                            {/* Review Textarea */}
                            <div>
                                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-2">
                                    Tulis Pengalaman Anda
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    placeholder="Ceritakan pengalaman menantang Anda saat menyusuri keindahan alam Pronojiwo di sini..."
                                    className="w-full p-4 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-stone-900"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide rounded-2xl shadow-lg shadow-emerald-500/10 transition-colors"
                            >
                                Kirim Ulasan feedback
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
