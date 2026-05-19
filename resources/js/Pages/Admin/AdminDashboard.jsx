import { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Map,
    FileCheck,
    MessageSquare,
    LogOut,
    Plus,
    Search,
    Edit3,
    Trash2,
    Check,
    X,
    TrendingUp,
    Ticket,
    Star,
    MapPin,
    Users,
    DollarSign,
    Calendar,
    ShieldAlert,
    Eye,
    CheckCircle2,
    XCircle,
    Info,
    ChevronRight,
    Sparkles,
    Tag,
    Mail
} from 'lucide-react';

export default function AdminDashboard({ auth, initialDestinations = [], initialBookings = [], initialReviews = [], initialMessages = [], flash = {}, discounts = [] }) {
    // Current active menu tab state: 'dashboard' | 'destinasi' | 'verifikasi' | 'ulasan' | 'pesan'
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Core Database-driven Props
    const destinations = initialDestinations;
    const bookings = initialBookings;
    const reviews = initialReviews;
    const [messages, setMessages] = useState(initialMessages);

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    // Pesan Reply Modal States
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [currentPesan, setCurrentPesan] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Sidebar inner content generator to prevent code duplication
    const sidebarContent = (isMobile = false) => (
        <div className="flex flex-col justify-between h-full">
            {/* Upper sidebar content */}
            <div className="flex flex-col">
                {/* Header Logo */}
                <div className="p-6 border-b border-emerald-950/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-emerald-900/30">
                            WAP
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase">WISATA ALAM</div>
                            <h1 className="font-playfair text-xl font-bold text-white leading-none">Pronojiwo</h1>
                        </div>
                    </div>
                    {isMobile && (
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 hover:text-white lg:hidden"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Admin User Profile info card */}
                <div className="m-4 p-4 rounded-2xl glass-card border border-emerald-800/20 flex items-center gap-3 glow-emerald">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-lg">
                            {auth?.user?.nama_lengkap ? auth.user.nama_lengkap.charAt(0) : 'A'}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#01120b] rounded-full"></span>
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="text-xs font-bold text-white truncate">{auth?.user?.nama_lengkap || 'Administrator'}</h3>
                        <p className="text-[10px] text-emerald-500/80 font-medium truncate mb-1">{auth?.user?.email || 'admin@pronojiwo.com'}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                            {auth?.user?.role || 'SUPER_ADMIN'}
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="px-4 py-2 space-y-1">
                    <p className="px-3 text-[10px] font-bold text-emerald-700 tracking-widest uppercase mb-2">MENU UTAMA</p>
                    
                    {/* Tab Dashboard Button */}
                    <button
                        onClick={() => { setActiveTab('dashboard'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'dashboard'
                            ? 'bg-gradient-to-r from-emerald-600/15 to-transparent border-l-4 border-emerald-400 text-emerald-300'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Ringkasan Dashboard</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'dashboard' ? 'rotate-90 text-emerald-400' : 'text-gray-600'}`} />
                    </button>

                    {/* Tab Kelola Destinasi */}
                    <button
                        onClick={() => { setActiveTab('destinasi'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'destinasi'
                            ? 'bg-gradient-to-r from-emerald-600/15 to-transparent border-l-4 border-emerald-400 text-emerald-300'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Map className="w-4 h-4" />
                            <span>Kelola Destinasi</span>
                        </div>
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                            {destinations.length}
                        </span>
                    </button>

                    {/* Tab Verifikasi Booking */}
                    <button
                        onClick={() => { setActiveTab('verifikasi'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'verifikasi'
                            ? 'bg-gradient-to-r from-emerald-600/15 to-transparent border-l-4 border-emerald-400 text-emerald-300'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <FileCheck className="w-4 h-4" />
                            <span>Verifikasi Pembayaran</span>
                        </div>
                        {pendingBookings.length > 0 && (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-500 text-amber-950 rounded-full animate-pulse">
                                {pendingBookings.length}
                            </span>
                        )}
                    </button>

                    {/* Tab Ulasan & Feedback */}
                    <button
                        onClick={() => { setActiveTab('ulasan'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'ulasan'
                            ? 'bg-gradient-to-r from-emerald-600/15 to-transparent border-l-4 border-emerald-400 text-emerald-300'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-4 h-4" />
                            <span>Ulasan & Feedback</span>
                        </div>
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg">
                            {reviews.length}
                        </span>
                    </button>

                    {/* Tab Pesan Masuk (Inbox) */}
                    <button
                        onClick={() => { setActiveTab('pesan'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'pesan'
                            ? 'bg-gradient-to-r from-emerald-600/15 to-transparent border-l-4 border-emerald-400 text-emerald-300'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4" />
                            <span>Pesan Masuk (Inbox)</span>
                        </div>
                        {unreadMessagesCount > 0 ? (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-red-500 text-white rounded-full animate-pulse">
                                {unreadMessagesCount}
                            </span>
                        ) : (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                                {messages.length}
                            </span>
                        )}
                    </button>

                    {/* Tab Daftar Kode Promo */}
                    <button
                        onClick={() => { setActiveTab('diskon'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'diskon'
                            ? 'bg-gradient-to-r from-emerald-600/15 to-transparent border-l-4 border-emerald-400 text-emerald-300'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Tag className="w-4 h-4" />
                            <span>Daftar Kode Promo</span>
                        </div>
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                            {discounts.length}
                        </span>
                    </button>
                </nav>
            </div>

            {/* Lower sidebar logout footer */}
            <div className="p-4 border-t border-emerald-950/20">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all duration-300"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Akun (Logout)</span>
                </button>
                <div className="mt-4 text-[10px] text-emerald-700/60 text-center font-medium">
                    © 2026 Pronojiwo Nature Escape
                </div>
            </div>
        </div>
    );
    
    // Destinasi Form Modal States
    const [destModalOpen, setDestModalOpen] = useState(false);
    const [destModalMode, setDestModalMode] = useState('create'); // 'create' | 'edit'
    const [currentDest, setCurrentDest] = useState(null);
    const [destFormData, setDestFormData] = useState({
        nama_wisata: '',
        deskripsi: '',
        kategori: 'Air Terjun',
        lokasi_rute: '',
        harga_tiket: '',
        kapasitas_harian: '',
        status: 'aktif',
        gambar: '',
        gambar_file: null,
        fasilitas: '',
        rating_asli: '4.8'
    });

    // Verification Modal States
    const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Filter status for Tab Verifikasi: 'semua' | 'pending' | 'lunas' | 'gagal'
    const [verifFilter, setVerifFilter] = useState('semua');
    
    // Destinasi Search query
    const [destSearch, setDestSearch] = useState('');

    // Notification toast state
    const [toast, setToast] = useState(null);

    // Trigger Toast Helper
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    // Trigger flash message toast on backend prop change
    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success, 'success');
        } else if (flash?.error) {
            showToast(flash.error, 'error');
        }
    }, [flash]);

    // LOGOUT ACTION
    const handleLogout = () => {
        router.post(route('logout'));
    };

    // DYNAMIC METRIC CALCULATIONS
    const metrics = useMemo(() => {
        // Total Pendapatan Bulan Ini (Sum of total_harga for Lunas payments)
        const revenue = bookings
            .filter(b => b.pembayaran?.status_pembayaran === 'lunas')
            .reduce((sum, b) => sum + b.total_harga, 0);

        // Jumlah Tiket Terjual (Sum of jumlah_tiket for Lunas/Dikonfirmasi bookings)
        const ticketsSold = bookings
            .filter(b => b.pembayaran?.status_pembayaran === 'lunas' || b.status_booking === 'dikonfirmasi')
            .reduce((sum, b) => sum + b.jumlah_tiket, 0);

        // Destinasi Terpopuler (highest sum of jumlah_tiket booked, excluding cancelled)
        const popularityMap = {};
        bookings.forEach(b => {
            if (b.status_booking !== 'dibatalkan') {
                const destId = b.id_destinasi;
                const destName = b.destinasi?.nama_wisata || 'Wisata Alam';
                popularityMap[destName] = (popularityMap[destName] || 0) + b.jumlah_tiket;
            }
        });
        
        let mostPopular = "Air Terjun Tumpak Sewu"; // default fallback
        let maxTickets = 0;
        Object.entries(popularityMap).forEach(([name, count]) => {
            if (count > maxTickets) {
                maxTickets = count;
                mostPopular = name;
            }
        });

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        // Sisa Kuota Hari Ini (Standard capacity - booked tickets today)
        const totalCapacity = destinations
            .filter(d => d.status === 'aktif')
            .reduce((sum, d) => sum + d.kapasitas_harian, 0);
        
        const ticketsReservedToday = bookings
            .filter(b => b.tanggal_kunjungan === todayStr && b.status_booking !== 'dibatalkan')
            .reduce((sum, b) => sum + b.jumlah_tiket, 0);

        const remainingQuota = Math.max(0, totalCapacity - ticketsReservedToday);

        return {
            revenue,
            ticketsSold,
            mostPopular,
            remainingQuota,
            totalCapacity
        };
    }, [bookings, destinations]);

    // Pending verification list (For quick view and badge)
    const pendingBookings = useMemo(() => {
        return bookings.filter(b => b.pembayaran?.status_pembayaran === 'menunggu_verifikasi');
    }, [bookings]);

    // Count unread instant messages
    const unreadMessagesCount = useMemo(() => {
        return messages.filter(m => m.status === 'belum_dibalas').length;
    }, [messages]);

    // FILTERED TRANSACTIONS (TAB VERIFIKASI)
    const filteredBookings = useMemo(() => {
        if (verifFilter === 'semua') return bookings;
        if (verifFilter === 'pending') return bookings.filter(b => b.pembayaran?.status_pembayaran === 'menunggu_verifikasi');
        if (verifFilter === 'lunas') return bookings.filter(b => b.pembayaran?.status_pembayaran === 'lunas');
        if (verifFilter === 'gagal') return bookings.filter(b => b.pembayaran?.status_pembayaran === 'gagal');
        return bookings;
    }, [bookings, verifFilter]);

    // FILTERED DESTINATIONS (TAB KELOLA DESTINASI)
    const filteredDestinations = useMemo(() => {
        if (!destSearch.trim()) return destinations;
        return destinations.filter(d => 
            d.nama_wisata.toLowerCase().includes(destSearch.toLowerCase()) ||
            d.lokasi_rute.toLowerCase().includes(destSearch.toLowerCase())
        );
    }, [destinations, destSearch]);

    // VERIFICATION ACTION: APPROVE
    const handleApprovePayment = (idBooking) => {
        router.post(route('admin.booking.verifikasi', idBooking), { status: 'terima' }, {
            onSuccess: () => {
                setVerificationModalOpen(false);
            },
            onError: () => {
                showToast("Gagal memverifikasi pembayaran!", "error");
            }
        });
    };

    // VERIFICATION ACTION: REJECT
    const handleRejectPayment = (idBooking) => {
        router.post(route('admin.booking.verifikasi', idBooking), { status: 'tolak' }, {
            onSuccess: () => {
                setVerificationModalOpen(false);
            },
            onError: () => {
                showToast("Gagal menolak pembayaran!", "error");
            }
        });
    };

    // DESTINASI CRUD: OPEN CREATE MODAL
    const openCreateDestModal = () => {
        setDestModalMode('create');
        setDestFormData({
            nama_wisata: '',
            deskripsi: '',
            kategori: 'Air Terjun',
            lokasi_rute: '',
            harga_tiket: '',
            kapasitas_harian: '',
            status: 'aktif',
            gambar: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop&q=80',
            gambar_file: null,
            fasilitas: '',
            rating_asli: '4.8'
        });
        setDestModalOpen(true);
    };

    // DESTINASI CRUD: OPEN EDIT MODAL
    const openEditDestModal = (destinasi) => {
        setDestModalMode('edit');
        setCurrentDest(destinasi);
        setDestFormData({
            nama_wisata: destinasi.nama_wisata,
            deskripsi: destinasi.deskripsi,
            kategori: destinasi.kategori || 'Air Terjun',
            lokasi_rute: destinasi.lokasi_rute,
            harga_tiket: destinasi.harga_tiket,
            kapasitas_harian: destinasi.kapasitas_harian,
            status: destinasi.status,
            gambar: destinasi.gambar || 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop&q=80',
            gambar_file: null,
            fasilitas: destinasi.fasilitas || '',
            rating_asli: destinasi.rating_asli || '4.8'
        });
        setDestModalOpen(true);
    };

    // DESTINASI CRUD: SUBMIT FORM
    const handleDestSubmit = (e) => {
        e.preventDefault();
        
        const price = parseInt(destFormData.harga_tiket);
        const capacity = parseInt(destFormData.kapasitas_harian);

        if (!destFormData.nama_wisata || !price || !capacity || !destFormData.lokasi_rute) {
            showToast("Harap isi semua form dengan benar!", "error");
            return;
        }

        const data = new FormData();
        data.append('nama_wisata', destFormData.nama_wisata);
        data.append('deskripsi', destFormData.deskripsi);
        data.append('kategori', destFormData.kategori);
        data.append('lokasi_rute', destFormData.lokasi_rute);
        data.append('harga_tiket', price);
        data.append('kapasitas_harian', capacity);
        data.append('status', destFormData.status);
        data.append('fasilitas', destFormData.fasilitas || '');
        data.append('rating_asli', destFormData.rating_asli || '4.8');
        
        if (destFormData.gambar_file) {
            data.append('gambar_file', destFormData.gambar_file);
        } else if (destFormData.gambar) {
            data.append('gambar', destFormData.gambar);
        }

        if (destModalMode === 'create') {
            router.post(route('admin.destinasi.store'), data, {
                onSuccess: () => {
                    setDestModalOpen(false);
                },
                onError: (errs) => {
                    const firstErr = Object.values(errs)[0];
                    showToast(firstErr || "Gagal menambahkan destinasi!", "error");
                }
            });
        } else {
            router.post(route('admin.destinasi.update', currentDest.id_destinasi), data, {
                onSuccess: () => {
                    setDestModalOpen(false);
                },
                onError: (errs) => {
                    const firstErr = Object.values(errs)[0];
                    showToast(firstErr || "Gagal memperbarui destinasi!", "error");
                }
            });
        }
    };

    // DESTINASI CRUD: DELETE ACTION
    const handleDeleteDest = (idDestinasi, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus destinasi "${name}"?`)) {
            router.delete(route('admin.destinasi.destroy', idDestinasi), {
                onError: (errs) => {
                    showToast("Gagal menghapus destinasi!", "error");
                }
            });
        }
    };

    // FILE UPLOAD HANDLER
    const handleMockUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setDestFormData(prev => ({ 
                ...prev, 
                gambar: tempUrl,
                gambar_file: file
            }));
            showToast("Visual gambar terpilih!", "success");
        }
    };

    return (
        <div className="min-h-screen bg-[#021a10] text-gray-100 flex font-sans overflow-x-hidden antialiased">
            <Head title="Admin Dashboard — Pronojiwo Nature Escape" />
            
            {/* IN-APP TRANSITIONS / CSS OVERRIDES */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&display=swap');
                
                body {
                    background-color: #021a10 !important;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                
                .font-playfair {
                    font-family: 'Playfair Display', serif;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(2, 26, 16, 0.5);
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.2);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.4);
                }

                /* Glowing gradients */
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(16px);
                }

                .glow-emerald {
                    box-shadow: 0 0 40px -10px rgba(16, 185, 129, 0.15);
                }
                
                /* Modal animation */
                .modal-fade-in {
                    animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            {/* TOAST SYSTEM POPUP */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 transform translate-y-0 animate-bounce ${
                    toast.type === 'success' 
                    ? 'bg-emerald-950/85 border-emerald-500/40 text-emerald-300' 
                    : 'bg-red-950/85 border-red-500/40 text-red-300'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
                </div>
            )}

            {/* Mobile Sidebar Overlay Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Drawer Aside */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-[#01120b] border-r border-emerald-950/40 flex flex-col justify-between h-screen z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {sidebarContent(true)}
            </aside>

            {/* ─── SIDEBAR NAVIGATION (LEFT - DESKTOP) ─── */}
            <aside className="w-72 bg-[#01120b] border-r border-emerald-950/40 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 lg:flex hidden">
                {sidebarContent(false)}
            </aside>

            {/* ─── MAIN CONTENT AREA (RIGHT) ─── */}
            <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
                
                {/* Ambient Decorative Blurs */}
                <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />
                <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-teal-500/5 rounded-full filter blur-[80px] pointer-events-none -z-10" />

                {/* ─ HEADER BAR ─ */}
                <header className="px-4 sm:px-8 py-5 border-b border-emerald-950/30 flex items-center justify-between sticky top-0 bg-[#021a10]/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-3">
                        {/* Hamburger toggle button for mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 hover:text-white lg:hidden transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500/80 mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Sistem Admin Pariwisata Pronojiwo</span>
                            </div>
                            <h2 className="text-base sm:text-xl font-bold font-playfair text-white tracking-wide">
                                {activeTab === 'dashboard' && 'Ringkasan Dashboard'}
                                {activeTab === 'destinasi' && 'Kelola Destinasi Pariwisata'}
                                {activeTab === 'verifikasi' && 'Verifikasi Booking & Pembayaran'}
                                {activeTab === 'ulasan' && 'Ulasan & Feedback Pengunjung'}
                                {activeTab === 'pesan' && 'Pesan Masuk (Inbox)'}
                                {activeTab === 'diskon' && 'Daftar Kode Promo & Diskon'}
                            </h2>
                        </div>
                    </div>

                    {/* Header Widgets */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="px-3 py-2 rounded-xl bg-[#01120b] border border-emerald-950/40 text-[10px] sm:text-xs font-semibold text-emerald-400 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="md:hidden">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        
                        {/* Status Role Indicator */}
                        <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/25 text-[10px] sm:text-xs font-extrabold text-white flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="hidden sm:inline">DATABASE MODE ACTIVE</span>
                            <span className="sm:hidden text-[9px]">DB ACTIVE</span>
                        </div>
                    </div>
                </header>

                {/* ─ CONTENT CONTAINER ─ */}
                <div className="flex-1 p-8">
                    
                    {/* ============================================================== */}
                    {/* TAB 1: DASHBOARD RINGKASAN DATA                                */}
                    {/* ============================================================== */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-fade-in-up">
                            
                            {/* 4 KPI CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                
                                {/* CARD 1: TOTAL PENDAPATAN */}
                                <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 hover:border-emerald-500/35 transition-all duration-300 relative group glow-emerald overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl group-hover:bg-emerald-500/15 transition-all duration-500" />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">PENDAPATAN BULAN INI</span>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-1">
                                        Rp {metrics.revenue.toLocaleString('id-ID')}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold mt-2">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span>+18.4% dari target target Laravel</span>
                                    </div>
                                </div>

                                {/* CARD 2: TIKET TERJUAL */}
                                <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 hover:border-emerald-500/35 transition-all duration-300 relative group glow-emerald overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full filter blur-xl group-hover:bg-teal-500/15 transition-all duration-500" />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">TIKET TERJUAL</span>
                                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                            <Ticket className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-1">
                                        {metrics.ticketsSold} <span className="text-xs font-medium text-gray-400">Tiket</span>
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-teal-400 font-semibold mt-2">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span>Aktif & Terverifikasi</span>
                                    </div>
                                </div>

                                {/* CARD 3: DESTINASI TERPOPULER */}
                                <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 hover:border-emerald-500/35 transition-all duration-300 relative group glow-emerald overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl group-hover:bg-amber-500/10 transition-all duration-500" />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">TERPOPULER</span>
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                            <Star className="w-5 h-5 fill-amber-500/20" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-white truncate mb-1">
                                        {metrics.mostPopular}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold mt-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>Kecamatan Pronojiwo</span>
                                    </div>
                                </div>

                                {/* CARD 4: SISA KUOTA HARI INI */}
                                <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 hover:border-emerald-500/35 transition-all duration-300 relative group glow-emerald overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl group-hover:bg-emerald-500/15 transition-all duration-500" />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">SISA KUOTA HARI INI</span>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <Users className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-1">
                                        {metrics.remainingQuota} <span className="text-xs font-medium text-gray-500">/ {metrics.totalCapacity}</span>
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold mt-2">
                                        <Info className="w-3.5 h-3.5" />
                                        <span>Kuota Destinasi Aktif</span>
                                    </div>
                                </div>

                            </div>

                            {/* PENDING TRANSACTIONS TABLE SECTION */}
                            <div className="p-6 rounded-3xl glass-card border border-emerald-950/40 glow-emerald">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-base font-bold text-white flex items-center gap-2.5">
                                            <ShieldAlert className="w-5 h-5 text-amber-400" />
                                            <span>Butuh Verifikasi Segera ({pendingBookings.length})</span>
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Booking baru dari pengunjung yang telah mengunggah bukti transfer bank. Harap periksa keabsahan transfer.
                                        </p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setActiveTab('verifikasi')}
                                        className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-xs font-bold text-emerald-300 transition-all duration-300"
                                    >
                                        Semua Transaksi →
                                    </button>
                                </div>

                                {pendingBookings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-emerald-950/60 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                    <th className="py-3.5 px-4">Pengunjung</th>
                                                    <th className="py-3.5 px-4">Wisata</th>
                                                    <th className="py-3.5 px-4">Kunjungan</th>
                                                    <th className="py-3.5 px-4">Jumlah Tiket</th>
                                                    <th className="py-3.5 px-4">Total Bayar</th>
                                                    <th className="py-3.5 px-4 text-center">Aksi Cepat</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-emerald-950/30 text-xs">
                                                {pendingBookings.map((b) => (
                                                    <tr key={b.id_booking} className="hover:bg-white/[0.01] transition-all">
                                                        <td className="py-4 px-4">
                                                            <div className="font-bold text-white">{b.user.nama_lengkap}</div>
                                                            <div className="text-[10px] text-gray-400">{b.user.email}</div>
                                                        </td>
                                                        <td className="py-4 px-4 font-semibold text-emerald-300">
                                                            {b.destinasi.nama_wisata}
                                                        </td>
                                                        <td className="py-4 px-4 text-gray-300">
                                                            {new Date(b.tanggal_kunjungan).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                                        </td>
                                                        <td className="py-4 px-4 font-bold text-center text-white">
                                                            {b.jumlah_tiket} Pcs
                                                        </td>
                                                        <td className="py-4 px-4 font-black text-emerald-400">
                                                            Rp {b.total_harga.toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedBooking(b);
                                                                        setVerificationModalOpen(true);
                                                                    }}
                                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1 transition-all"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                    <span>Cek Bukti</span>
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => handleApprovePayment(b.id_booking)}
                                                                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/45"
                                                                    title="Terima Pembayaran"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" />
                                                                </button>

                                                                <button
                                                                    onClick={() => handleRejectPayment(b.id_booking)}
                                                                    className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-500/20 transition-all"
                                                                    title="Tolak Pembayaran"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-10 text-center bg-white/[0.01] rounded-2xl border border-dashed border-emerald-950 flex flex-col items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mb-3" />
                                        <p className="text-sm font-bold text-emerald-400">Kerja Bagus!</p>
                                        <p className="text-xs text-gray-500 mt-1">Tidak ada transaksi tertunda yang butuh verifikasi.</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* TAB 2: KELOLA DESTINASI                                        */}
                    {/* ============================================================== */}
                    {activeTab === 'destinasi' && (
                        <div className="space-y-6 animate-fade-in-up">
                            
                            {/* SEARCH BAR & BUTTON ADD */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="relative w-full sm:w-80">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Search className="w-4 h-4" />
                                    </span>
                                    <input 
                                        type="text"
                                        placeholder="Cari nama wisata/lokasi..."
                                        value={destSearch}
                                        onChange={(e) => setDestSearch(e.target.value)}
                                        className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-[#01120b] border border-emerald-950/60 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>

                                <button
                                    onClick={openCreateDestModal}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Tambah Destinasi Baru</span>
                                </button>
                            </div>

                            {/* DESTINASIS TABLE */}
                            <div className="p-6 rounded-3xl glass-card border border-emerald-950/40 glow-emerald">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-emerald-950/60 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                <th className="py-3.5 px-4 w-32">Visual</th>
                                                <th className="py-3.5 px-4">Destinasi</th>
                                                <th className="py-3.5 px-4">Harga Tiket</th>
                                                <th className="py-3.5 px-4 text-center">Kuota Harian</th>
                                                <th className="py-3.5 px-4 text-center">Status</th>
                                                <th className="py-3.5 px-4 text-center">Aksi Kelola</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-950/30 text-xs">
                                            {filteredDestinations.length > 0 ? (
                                                filteredDestinations.map((d) => (
                                                    <tr key={d.id_destinasi} className="hover:bg-white/[0.01] transition-all">
                                                        <td className="py-4 px-4">
                                                            <div className="w-24 h-16 rounded-xl overflow-hidden border border-emerald-950/60 shadow-md">
                                                                <img 
                                                                    src={d.gambar} 
                                                                    alt={d.nama_wisata} 
                                                                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="font-extrabold text-sm text-white">{d.nama_wisata}</div>
                                                            <div className="text-[10px] text-gray-400 truncate max-w-sm mt-0.5">{d.deskripsi}</div>
                                                            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                                                                <MapPin className="w-3 h-3 text-emerald-500" />
                                                                <span>{d.lokasi_rute}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 font-black text-emerald-400">
                                                            Rp {d.harga_tiket.toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="py-4 px-4 font-extrabold text-center text-white">
                                                            {d.kapasitas_harian} orang/hari
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                                                                d.status === 'aktif'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                            }`}>
                                                                ● {d.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => openEditDestModal(d)}
                                                                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1 transition-all"
                                                                    title="Edit Destinasi"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => handleDeleteDest(d.id_destinasi, d.nama_wisata)}
                                                                    className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-500/20 transition-all"
                                                                    title="Hapus Destinasi"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="py-8 text-center text-gray-500 bg-white/[0.005]">
                                                        Tidak ada destinasi ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* TAB 3: VERIFIKASI BOOKING & PEMBAYARAN                         */}
                    {/* ============================================================== */}
                    {activeTab === 'verifikasi' && (
                        <div className="space-y-6 animate-fade-in-up">
                            
                            {/* FILTER CATEGORY SEGMENTS */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-1.5 bg-[#01120b] p-1.5 rounded-2xl border border-emerald-950/60">
                                    {[
                                        { key: 'semua', label: 'Semua Transaksi' },
                                        { key: 'pending', label: 'Pending Verifikasi' },
                                        { key: 'lunas', label: 'Lunas / Sukses' },
                                        { key: 'gagal', label: 'Gagal / Ditolak' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setVerifFilter(tab.key)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                verifFilter === tab.key
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                                : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="text-xs font-semibold text-gray-400">
                                    Menampilkan {filteredBookings.length} transaksi
                                </div>
                            </div>

                            {/* TRANSACTIONS LIST */}
                            <div className="p-6 rounded-3xl glass-card border border-emerald-950/40 glow-emerald">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-emerald-950/60 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                <th className="py-3.5 px-4">Invoice ID</th>
                                                <th className="py-3.5 px-4">Pengunjung</th>
                                                <th className="py-3.5 px-4">Destinasi</th>
                                                <th className="py-3.5 px-4">Metode Bayar</th>
                                                <th className="py-3.5 px-4 text-center">Jumlah Tiket</th>
                                                <th className="py-3.5 px-4">Total Tagihan</th>
                                                <th className="py-3.5 px-4 text-center">Status Pembayaran</th>
                                                <th className="py-3.5 px-4 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-950/30 text-xs">
                                            {filteredBookings.length > 0 ? (
                                                filteredBookings.map((b) => (
                                                    <tr key={b.id_booking} className="hover:bg-white/[0.01] transition-all">
                                                        <td className="py-4 px-4 font-bold text-gray-400 tracking-wide">
                                                            #WAP-IN-{1000 + b.id_booking}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="font-bold text-white">{b.user.nama_lengkap}</div>
                                                            <div className="text-[10px] text-gray-400">{b.user.email}</div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="font-semibold text-white">{b.destinasi.nama_wisata}</div>
                                                            <div className="text-[10px] text-emerald-500/80 flex items-center gap-1 mt-0.5 font-medium">
                                                                <Calendar className="w-3 h-3 text-emerald-500" />
                                                                <span>Kunjungan: {b.tanggal_kunjungan}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="font-bold text-gray-300 text-[10px] uppercase">{b.pembayaran?.metode_pembayaran || 'Belum Bayar'}</div>
                                                            <div className="text-[9px] text-gray-400 mt-0.5">VA Online / Transfer</div>
                                                        </td>
                                                        <td className="py-4 px-4 font-extrabold text-center text-white">
                                                            {b.jumlah_tiket} Tiket
                                                        </td>
                                                        <td className="py-4 px-4 font-black text-emerald-400">
                                                            Rp {b.total_harga.toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                                                                b.pembayaran?.status_pembayaran === 'lunas' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                b.pembayaran?.status_pembayaran === 'menunggu_verifikasi' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                b.pembayaran?.status_pembayaran === 'belum_bayar' || !b.pembayaran?.status_pembayaran ? 'bg-stone-500/10 text-stone-400 border-stone-500/20' :
                                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                                            }`}>
                                                                {b.pembayaran?.status_pembayaran === 'lunas' ? 'LUNAS / SUKSES' :
                                                                 b.pembayaran?.status_pembayaran === 'menunggu_verifikasi' ? 'WAITING VERIFY' :
                                                                 b.pembayaran?.status_pembayaran === 'belum_bayar' || !b.pembayaran?.status_pembayaran ? 'BELUM BAYAR' :
                                                                 'GAGAL / BATAL'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {b.pembayaran?.status_pembayaran === 'menunggu_verifikasi' ? (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedBooking(b);
                                                                            setVerificationModalOpen(true);
                                                                        }}
                                                                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1 transition-all"
                                                                    >
                                                                        <Eye className="w-3.5 h-3.5" />
                                                                        <span>Cek Bukti</span>
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-500 font-medium italic">
                                                                        Selesai ditinjau
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="py-8 text-center text-gray-500 bg-white/[0.005]">
                                                        Tidak ada transaksi di tab ini.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* TAB 4: ULASAN & FEEDBACK                                       */}
                    {/* ============================================================== */}
                    {activeTab === 'ulasan' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reviews.map((r) => (
                                    <div key={r.id_review} className="p-6 rounded-2xl glass-card border border-emerald-950/40 hover:border-emerald-500/25 transition-all duration-300 flex flex-col justify-between glow-emerald relative">
                                        
                                        {/* Review Header card info */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="font-extrabold text-sm text-white">{r.user.nama_lengkap}</h4>
                                                    <span className="text-[10px] text-emerald-500/80 font-bold flex items-center gap-1.5 mt-0.5">
                                                        <MapPin className="w-3 h-3 text-emerald-500" />
                                                        <span>{r.destinasi.nama_wisata}</span>
                                                    </span>
                                                </div>
                                                
                                                {/* Stars */}
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`w-3.5 h-3.5 ${
                                                                i < r.rating 
                                                                ? 'text-amber-400 fill-amber-400' 
                                                                : 'text-gray-700'
                                                            }`} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-300 leading-relaxed italic">
                                                "{r.ulasan}"
                                            </p>
                                        </div>

                                        {/* Meta date footer card */}
                                        <div className="mt-6 pt-4 border-t border-emerald-950/30 flex items-center justify-between text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                                            <span>Akun Pengunjung</span>
                                            <span>Terverifikasi</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* TAB 5: PESAN MASUK (INBOX MESSAGES)                            */}
                    {/* ============================================================== */}
                    {activeTab === 'pesan' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-white font-playfair">Pesan Instan Pengunjung</h3>
                                    <p className="text-xs text-gray-400">Daftar pertanyaan dan keluhan yang dikirimkan oleh pengunjung melalui formulir kontak.</p>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold w-fit">
                                    Total Pesan: {messages.length} ({unreadMessagesCount} Belum Dibalas)
                                </div>
                            </div>

                            {messages.length === 0 ? (
                                <div className="p-12 text-center rounded-3xl glass-card border border-emerald-800/10 flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center text-emerald-400">
                                        <Mail className="w-6 h-6 opacity-60" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Tidak ada pesan masuk</h4>
                                        <p className="text-xs text-gray-500 mt-1">Belum ada pengunjung yang mengirimkan pesan instan lewat landing page.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {messages.map((p) => {
                                        return (
                                            <div key={p.id_pesan} className="p-6 rounded-2xl glass-card border border-emerald-950/40 hover:border-emerald-500/25 transition-all duration-300 flex flex-col gap-4 glow-emerald relative">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950/20 pb-4">
                                                    <div>
                                                        <h4 className="font-extrabold text-sm text-white">{p.nama_lengkap}</h4>
                                                        <span className="text-[10px] text-gray-400 mt-0.5 block">{p.email}</span>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                                                        p.status === 'sudah_dibalas'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                    }`}>
                                                        {p.status === 'sudah_dibalas' ? 'Sudah Dibalas' : 'Belum Dibalas'}
                                                    </span>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Subjek: {p.subjek}</span>
                                                    <p className="text-xs text-gray-300 leading-relaxed font-light">{p.pesan}</p>
                                                </div>

                                                {p.balasan && (
                                                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/10 space-y-1">
                                                        <span className="text-[9px] text-emerald-500 font-extrabold uppercase tracking-wider block">Balasan Admin:</span>
                                                        <p className="text-xs text-emerald-300 leading-relaxed font-light italic">"{p.balasan}"</p>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 pt-2 justify-end">
                                                    <button
                                                        onClick={() => {
                                                            setCurrentPesan(p);
                                                            setReplyText(p.balasan || '');
                                                            setReplyModalOpen(true);
                                                        }}
                                                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all duration-300"
                                                    >
                                                        {p.status === 'sudah_dibalas' ? 'Edit Balasan' : 'Balas Pesan'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
                                                                router.post(route('admin.pesan.destroy', p.id_pesan), {}, {
                                                                    onSuccess: () => showToast('Pesan berhasil dihapus!'),
                                                                    onError: () => showToast('Gagal menghapus pesan!', 'error')
                                                                });
                                                            }
                                                        }}
                                                        className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-900/30 hover:border-red-500/30 text-red-400 text-xs font-bold transition-all duration-300"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* TAB: DAFTAR KODE PROMO & DISKON                                */}
                    {/* ============================================================== */}
                    {activeTab === 'diskon' && (
                        <div className="space-y-6 animate-fade-in-up">
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold font-playfair text-white">Daftar Kode Promo Pariwisata</h3>
                                    <p className="text-xs text-gray-400 mt-1">Daftar kode diskon dan kupon promo aktif yang dapat digunakan oleh pengunjung saat memesan tiket.</p>
                                </div>
                                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                                    {discounts.length} Promo Terdaftar
                                </span>
                            </div>

                            <div className="p-6 rounded-3xl glass-card border border-emerald-950/40 glow-emerald overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-emerald-950/60 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                <th className="py-3.5 px-4">ID</th>
                                                <th className="py-3.5 px-4">Kode Diskon / Voucher</th>
                                                <th className="py-3.5 px-4">Persentase</th>
                                                <th className="py-3.5 px-4">Target Destinasi</th>
                                                <th className="py-3.5 px-4">Masa Berlaku</th>
                                                <th className="py-3.5 px-4 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-950/30 text-xs">
                                            {discounts.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="py-12 text-center text-gray-500">
                                                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-20 text-emerald-500" />
                                                        <p className="font-bold text-sm text-emerald-400">Belum Ada Kode Diskon</p>
                                                        <p className="text-xs text-gray-500 mt-1">Belum ada promo yang dibuat oleh Super Admin.</p>
                                                    </td>
                                                </tr>
                                            ) : discounts.map((d) => (
                                                <tr key={d.id_diskon} className="hover:bg-white/[0.01] transition-all">
                                                    <td className="py-4 px-4 font-bold text-gray-500">#{d.id_diskon}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="font-black text-emerald-400 text-sm tracking-wider uppercase bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                                                            {d.kode_diskon}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-black text-white text-sm">
                                                        {d.persentase}% OFF
                                                    </td>
                                                    <td className="py-4 px-4 font-semibold text-gray-300">
                                                        {d.id_destinasi ? (
                                                            <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] bg-emerald-950/40 text-emerald-300 border border-emerald-500/10">
                                                                {destinations.find(dest => dest.id_destinasi === d.id_destinasi)?.nama_wisata || `Destinasi #${d.id_destinasi}`}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] bg-gray-500/10 text-gray-400 border border-gray-500/10">
                                                                Semua Wisata
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 font-semibold text-gray-300">
                                                        {d.berlaku_sampai ? (
                                                            (() => {
                                                                const isExpired = new Date(d.berlaku_sampai) < new Date();
                                                                return (
                                                                    <div className="space-y-1">
                                                                        <div className="text-gray-300">
                                                                            {new Date(d.berlaku_sampai).toLocaleString('id-ID', {
                                                                                dateStyle: 'medium',
                                                                                timeStyle: 'short'
                                                                            })}
                                                                        </div>
                                                                        {isExpired && (
                                                                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-400 uppercase border border-rose-500/30">
                                                                                Expired / Kadaluarsa
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()
                                                        ) : (
                                                            <span className="text-gray-500 italic font-normal">Selamanya</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        {d.status === 'aktif' ? (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                                                                Tidak Aktif
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* ============================================================== */}
            {/* MODAL WINDOWS                                                  */}
            {/* ============================================================== */}

            {/* 1. DESTINASI CREATE & EDIT MODAL */}
            {destModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[#01120b]/80 backdrop-blur-md transition-opacity" 
                        onClick={() => setDestModalOpen(false)}
                    />

                    {/* Modal Body Container */}
                    <div className="relative bg-[#021d12] border border-emerald-500/20 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 modal-fade-in max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-emerald-950/30 flex items-center justify-between">
                            <h3 className="text-base font-bold font-playfair text-white">
                                {destModalMode === 'create' ? 'Tambah Destinasi Baru' : 'Edit Destinasi Pariwisata'}
                            </h3>
                            <button 
                                onClick={() => setDestModalOpen(false)}
                                className="p-2 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Form Scrollable */}
                        <form onSubmit={handleDestSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                            
                            {/* Input Nama Wisata */}
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Nama Wisata *</label>
                                <input 
                                    type="text"
                                    required
                                    value={destFormData.nama_wisata}
                                    onChange={(e) => setDestFormData(prev => ({ ...prev, nama_wisata: e.target.value }))}
                                    placeholder="Contoh: Air Terjun Kapas Biru"
                                    className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Select Kategori Wisata */}
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Kategori Wisata *</label>
                                <select
                                    required
                                    value={destFormData.kategori}
                                    onChange={(e) => setDestFormData(prev => ({ ...prev, kategori: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none"
                                >
                                    <option value="Air Terjun">Air Terjun</option>
                                    <option value="Panorama">Panorama / Viewpoint</option>
                                    <option value="Hutan">Hutan Pinus / Alam</option>
                                    <option value="Gunung">Pegunungan / Vulkanik</option>
                                    <option value="Edukasi">Wisata Edukasi / Budaya</option>
                                </select>
                            </div>

                            {/* Input Deskripsi Wisata */}
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Deskripsi *</label>
                                <textarea 
                                    rows="3"
                                    required
                                    value={destFormData.deskripsi}
                                    onChange={(e) => setDestFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                                    placeholder="Jelaskan daya tarik, keindahan, dan keunikan wisata ini..."
                                    className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>

                            {/* Input Lokasi Rute */}
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Lokasi / Rute Jalan *</label>
                                <input 
                                    type="text"
                                    required
                                    value={destFormData.lokasi_rute}
                                    onChange={(e) => setDestFormData(prev => ({ ...prev, lokasi_rute: e.target.value }))}
                                    placeholder="Contoh: Dusun Mulyoarjo, Desa Pronojiwo, Lumajang"
                                    className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Two-column Input (Price & capacity) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                {/* Input Harga Tiket */}
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Harga Tiket (Rp) *</label>
                                    <input 
                                        type="number"
                                        required
                                        value={destFormData.harga_tiket}
                                        onChange={(e) => setDestFormData(prev => ({ ...prev, harga_tiket: e.target.value }))}
                                        placeholder="Contoh: 15000"
                                        className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Input Kapasitas Harian */}
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Kuota / Kapasitas Harian *</label>
                                    <input 
                                        type="number"
                                        required
                                        value={destFormData.kapasitas_harian}
                                        onChange={(e) => setDestFormData(prev => ({ ...prev, kapasitas_harian: e.target.value }))}
                                        placeholder="Contoh: 100"
                                        className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                            </div>

                            {/* Two-column Input (Fasilitas & Rating Asli) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                {/* Input Fasilitas */}
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Fasilitas (Pisahkan Koma) *</label>
                                    <input 
                                        type="text"
                                        required
                                        value={destFormData.fasilitas || ''}
                                        onChange={(e) => setDestFormData(prev => ({ ...prev, fasilitas: e.target.value }))}
                                        placeholder="cth: Spot foto, Toilet, Warung, Parkir"
                                        className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Input Rating Asli */}
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Rating Asli Spot (1.0 - 5.0) *</label>
                                    <input 
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        required
                                        value={destFormData.rating_asli || ''}
                                        onChange={(e) => setDestFormData(prev => ({ ...prev, rating_asli: e.target.value }))}
                                        placeholder="Contoh: 4.8"
                                        className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                            </div>

                            {/* Select Status & File Upload */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                {/* Select Status */}
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Status Destinasi</label>
                                    <select 
                                        value={destFormData.status}
                                        onChange={(e) => setDestFormData(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="aktif" className="bg-[#021d12]">Aktif / Terbuka</option>
                                        <option value="non-aktif" className="bg-[#021d12]">Non-Aktif / Tutup</option>
                                    </select>
                                </div>

                                {/* Upload Visual Galeri */}
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Upload Visual Galeri</label>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMockUpload}
                                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-extrabold file:uppercase file:bg-emerald-500/10 file:text-emerald-300 hover:file:bg-emerald-500/20 file:cursor-pointer"
                                    />
                                </div>

                            </div>

                            {/* Form Image Preview */}
                            {destFormData.gambar && (
                                <div className="p-3 rounded-2xl border border-emerald-950/60 bg-white/[0.005]">
                                    <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Preview Gambar Dipilih</span>
                                    <div className="w-full h-32 rounded-xl overflow-hidden shadow-inner border border-emerald-950/60">
                                        <img src={destFormData.gambar} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}

                            {/* Modal Footer Submit buttons */}
                            <div className="pt-4 border-t border-emerald-950/30 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDestModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-emerald-950 text-xs font-bold text-gray-400 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-bold text-white shadow-lg transition"
                                >
                                    {destModalMode === 'create' ? 'Tambahkan Wisata' : 'Simpan Perubahan'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* 2. RECEIPT PROOF & TRANSACTION VERIFICATION MODAL */}
            {verificationModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[#01120b]/85 backdrop-blur-md transition-opacity" 
                        onClick={() => setVerificationModalOpen(false)}
                    />

                    {/* Modal Body */}
                    <div className="relative bg-[#021d12] border border-emerald-500/25 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10 modal-fade-in max-h-[95vh] flex flex-col glow-emerald">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-emerald-950/30 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold font-playfair text-white flex items-center gap-2">
                                    <FileCheck className="w-5 h-5 text-emerald-400" />
                                    <span>Tinjau Bukti Transfer Pembayaran</span>
                                </h3>
                                <p className="text-[10px] text-gray-400 tracking-wider font-semibold mt-1">INVOICE: #WAP-IN-{1000 + selectedBooking.id_booking}</p>
                            </div>
                            <button 
                                onClick={() => setVerificationModalOpen(false)}
                                className="p-2 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Content Split Screen */}
                        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2">
                            
                            {/* Left Side: Receipt Image Preview */}
                            <div className="p-6 bg-[#01120b]/60 flex flex-col justify-center border-b md:border-b-0 md:border-r border-emerald-950/40">
                                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80 mb-3">GAMBAR BUKTI TRANSFER BANK</span>
                                {selectedBooking.pembayaran?.bukti_pembayaran ? (
                                    <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl relative group cursor-zoom-in">
                                        <img 
                                            src={selectedBooking.pembayaran.bukti_pembayaran} 
                                            alt="Bukti Transfer BCA" 
                                            className="w-full h-full object-cover object-center"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-emerald-600 px-3 py-1.5 rounded-lg shadow-lg">Klik untuk Perbesar</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-red-500/20 flex flex-col items-center justify-center text-center p-4">
                                        <XCircle className="w-10 h-10 text-red-500/40 mb-2" />
                                        <p className="text-xs font-bold text-red-400">Bukti Transfer Kosong</p>
                                        <p className="text-[10px] text-gray-500 mt-1">Pengunjung belum mengunggah foto bukti pembayaran.</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Invoice & User Details */}
                            <div className="p-6 flex flex-col justify-between space-y-6">
                                
                                <div className="space-y-4">
                                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400">DETAIL INVOICE & ORDER</span>
                                    
                                    {/* User Profiling */}
                                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-emerald-950/60">
                                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Data Pemesan</div>
                                        <h4 className="text-xs font-bold text-white">{selectedBooking.user.nama_lengkap}</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{selectedBooking.user.email}</p>
                                    </div>

                                    {/* Destination & Date details */}
                                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-emerald-950/60 space-y-2.5">
                                        <div>
                                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Destinasi Terpilih</div>
                                            <h4 className="text-xs font-extrabold text-emerald-300">{selectedBooking.destinasi.nama_wisata}</h4>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tanggal Kunjungan</div>
                                            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                                <span>{selectedBooking.tanggal_kunjungan}</span>
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Price breakdown */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-transparent border border-emerald-500/20 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                                            <span>Metode Bayar:</span>
                                            <span className="font-extrabold text-white">{selectedBooking.pembayaran?.metode_pembayaran || 'MOCK'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                                            <span>Jumlah Tiket:</span>
                                            <span className="font-extrabold text-white">{selectedBooking.jumlah_tiket} Pcs</span>
                                        </div>
                                        <div className="border-t border-emerald-950 pt-2 flex items-center justify-between">
                                            <span className="text-xs font-bold text-emerald-400">Total Pembayaran:</span>
                                            <span className="text-base font-black text-emerald-400">Rp {selectedBooking.total_harga.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    {/* Simulated Laravel Eloquent Tip */}
                                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-2.5 text-[9px] text-amber-300">
                                        <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                                        <p className="leading-relaxed">
                                            <strong>Skema Sinkronisasi API Laravel:</strong> Tombol 'Terima' akan memperbarui status booking menjadi <code>dikonfirmasi</code> dan status pembayaran menjadi <code>lunas</code>.
                                        </p>
                                    </div>

                                </div>

                                {/* Modal Footer Quick Action Buttons */}
                                <div className="pt-4 border-t border-emerald-950/30 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleRejectPayment(selectedBooking.id_booking)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/20 text-xs font-bold text-red-400 hover:text-red-300 transition"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Tolak / Gagal</span>
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => handleApprovePayment(selectedBooking.id_booking)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-bold text-white shadow-lg transition"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Terima (Lunas)</span>
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* 3. PESAN REPLY MODAL */}
            {replyModalOpen && currentPesan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[#01120b]/80 backdrop-blur-md transition-opacity" 
                        onClick={() => setReplyModalOpen(false)}
                    />

                    {/* Modal Body Container */}
                    <div className="relative bg-[#021d12] border border-emerald-500/20 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 modal-fade-in max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-emerald-950/30 flex items-center justify-between">
                            <h3 className="text-base font-bold font-playfair text-white">
                                Balas Pesan: {currentPesan.nama_lengkap}
                            </h3>
                            <button 
                                onClick={() => setReplyModalOpen(false)}
                                className="p-2 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Form Scrollable */}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (!replyText.trim()) {
                                showToast('Harap tuliskan balasan!', 'error');
                                return;
                            }
                            router.post(route('admin.pesan.balas', currentPesan.id_pesan), {
                                balasan: replyText
                            }, {
                                onSuccess: () => {
                                    setReplyModalOpen(false);
                                    showToast('Balasan pesan berhasil dikirim!');
                                },
                                onError: () => {
                                    showToast('Gagal mengirim balasan!', 'error');
                                }
                            });
                        }} className="flex-1 overflow-y-auto p-6 space-y-4">
                            
                            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 space-y-2">
                                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Pesan Asli:</span>
                                <p className="text-xs text-gray-300 font-light italic">"{currentPesan.pesan}"</p>
                            </div>

                            {/* Input Balasan */}
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Teks Balasan Anda *</label>
                                <textarea 
                                    rows="6"
                                    required
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Tuliskan jawaban atau tanggapan resmi Anda di sini..."
                                    className="w-full px-4 py-3 rounded-xl bg-[#01120b] border border-emerald-950 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="pt-4 border-t border-emerald-950/30 flex items-center justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setReplyModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-xs font-bold text-gray-300 hover:text-white border border-emerald-950 hover:bg-emerald-950/20 transition-all duration-300"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg transition-all duration-300"
                                >
                                    Kirim Balasan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
