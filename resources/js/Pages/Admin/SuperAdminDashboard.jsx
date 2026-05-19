import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import { id } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    LogOut,
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    TrendingUp,
    DollarSign,
    Ticket,
    Download,
    X,
    Activity,
    Clock,
    ChevronRight,
    Sparkles,
    BarChart3,
    FileText,
    MapPin,
    CreditCard,
    Tag
} from 'lucide-react';



export default function SuperAdminDashboard({ auth, initialUsers = [], initialLogs = [], initialDestinations = [], initialBookings = [], initialDiscounts = [], flash = {} }) {
    // Current active menu tab state: 'ringkasan' | 'manajemen_user' | 'log_aktivitas'
    const [activeTab, setActiveTab] = useState('ringkasan');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
// Search Query for Users
    const [userSearch, setUserSearch] = useState('');
    
    // Date range filter for PDF export
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    // Modal States
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [userModalMode, setUserModalMode] = useState('create'); // 'create' | 'edit'
    const [currentUser, setCurrentUser] = useState(null);
    const [userFormData, setUserFormData] = useState({
        nama_lengkap: '',
        email: '',
        password: '',
        no_telepon: '',
        role: 'pengunjung' // default
    });

    // Toast Notification System
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Use Effect for Flash Messages from Backend
    React.useEffect(() => {
        if (flash?.success) {
            showToast(flash.success, 'success');
        }
        if (flash?.error) {
            showToast(flash.error, 'error');
        }
    }, [flash]);

    // Derived Metrics
    const metrics = useMemo(() => {
        const totalPendapatan = initialBookings
            .filter(b => b.pembayaran?.status_pembayaran === 'lunas')
            .reduce((sum, b) => sum + b.total_harga, 0);
            
        const totalTiket = initialBookings
            .filter(b => b.pembayaran?.status_pembayaran === 'lunas' || b.status_booking === 'dikonfirmasi')
            .reduce((sum, b) => sum + b.jumlah_tiket, 0);

        const totalPengguna = initialUsers.length;
        
        // Dynamic Trending Calculation (Bulan Ini vs Bulan Lalu)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let revenueThisMonth = 0;
        let revenueLastMonth = 0;

        initialBookings.forEach(b => {
            if (b.pembayaran?.status_pembayaran === 'lunas' && b.tanggal_kunjungan) {
                const date = new Date(b.tanggal_kunjungan);
                if (date.getFullYear() === currentYear) {
                    if (date.getMonth() === currentMonth) {
                        revenueThisMonth += b.total_harga;
                    } else if (date.getMonth() === currentMonth - 1) {
                        revenueLastMonth += b.total_harga;
                    }
                } else if (currentMonth === 0 && date.getFullYear() === currentYear - 1 && date.getMonth() === 11) {
                    // Handle January (current) vs December (last year)
                    revenueLastMonth += b.total_harga;
                }
            }
        });

        let trendingPercentage = 0;
        if (revenueLastMonth > 0) {
            trendingPercentage = ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;
        } else if (revenueThisMonth > 0) {
            trendingPercentage = 100; // If last month was 0 but this month has revenue
        }
        
        // Calculate revenue per destination
        const destinationStats = initialDestinations.map(dest => {
            const destRevenue = initialBookings
                .filter(b => b.id_destinasi === dest.id_destinasi && b.pembayaran?.status_pembayaran === 'lunas')
                .reduce((sum, b) => sum + b.total_harga, 0);
            return {
                id_destinasi: dest.id_destinasi,
                nama_wisata: dest.nama_wisata,
                pendapatan: destRevenue
            };
        });

        return { totalPendapatan, totalPengguna, totalTiket, destinationStats, trendingPercentage };
    }, [initialUsers, initialBookings, initialDestinations]);

// PDF Export Function
    const exportToPDF = async () => {
        try {
            const { jsPDF } = await import('jspdf');
            const autoTable = (await import('jspdf-autotable')).default;
            
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Laporan Pendapatan - Pronojiwo Nature Escape', 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            
            let dateRangeText = '';
            if (startDate || endDate) {
                const start = startDate ? startDate.toLocaleDateString('id-ID') : 'Awal';
                const end = endDate ? endDate.toLocaleDateString('id-ID') : 'Akhir';
                dateRangeText = `Periode: ${start} - ${end}`;
            }
            doc.text(`Dicetak oleh: ${auth?.user?.nama_lengkap || 'Super Admin'} pada ${new Date().toLocaleString('id-ID')}${dateRangeText ? ' | ' + dateRangeText : ''}`, 14, 30);
            
            const tableColumn = ["ID Destinasi", "Nama Wisata", "Pendapatan Bersih (Rp)"];
            const tableRows = [];
            
            // Filter bookings berdasarkan tanggal yang dipilih
            let filteredBookings = initialBookings.filter(b => b.pembayaran?.status_pembayaran === 'lunas');
            if (startDate || endDate) {
                filteredBookings = filteredBookings.filter(b => {
                    if (!b.tanggal_kunjungan) return false;
                    const visitDate = new Date(b.tanggal_kunjungan);
                    visitDate.setHours(0,0,0,0);
                    const start = startDate ? new Date(startDate) : null;
                    const end = endDate ? new Date(endDate) : null;
                    if (start) start.setHours(0,0,0,0);
                    if (end) end.setHours(0,0,0,0);
                    
                    if (start && end) {
                        return visitDate >= start && visitDate <= end;
                    } else if (start) {
                        return visitDate >= start;
                    } else if (end) {
                        return visitDate <= end;
                    }
                    return true;
                });
            }
            
            // Hitung pendapatan per destinasi dari data yang difilter
            const destinationRevenue = {};
            filteredBookings.forEach(b => {
                if (!destinationRevenue[b.id_destinasi]) {
                    destinationRevenue[b.id_destinasi] = 0;
                }
                destinationRevenue[b.id_destinasi] += b.total_harga;
            });
            
            let total = 0;
            initialDestinations.forEach(dest => {
                const pendapatan = destinationRevenue[dest.id_destinasi] || 0;
                if (pendapatan > 0) {
                    total += pendapatan;
                    const destData = [
                        dest.id_destinasi,
                        dest.nama_wisata,
                        pendapatan.toLocaleString('id-ID')
                    ];
                    tableRows.push(destData);
                }
            });
            
            if (total > 0) {
                tableRows.push(['', 'TOTAL PENDAPATAN', total.toLocaleString('id-ID')]);
            }

            if (tableRows.length > 0) {
                doc.autoTable({
                    head: [tableColumn],
                    body: tableRows,
                    startY: 40,
                    theme: 'grid',
                    headStyles: { fillColor: [79, 70, 229] },
                    styles: { fontSize: 10 }
                });
            } else {
                doc.text('Tidak ada data pendapatan untuk periode yang dipilih.', 14, 50);
            }
            
            const fileName = (startDate || endDate)
                ? `Laporan_Pendapatan_${startDate ? startDate.toISOString().slice(0,10).replace(/-/g, '') : 'awal'}_${endDate ? endDate.toISOString().slice(0,10).replace(/-/g, '') : 'akhir'}.pdf`
                : `Laporan_Pendapatan_Pronojiwo_${new Date().getTime()}.pdf`;
            doc.save(fileName);
            showToast('Laporan PDF berhasil di-download!', 'success');
        } catch (error) {
            console.error("PDF generation failed:", error);
            showToast('Gagal men-download PDF: ' + error.message, 'error');
        }
    };

    // Filtered Users
    const filteredUsers = useMemo(() => {
        if (!userSearch.trim()) return initialUsers;
        return initialUsers.filter(u => 
            u.nama_lengkap.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase())
        );
    }, [initialUsers, userSearch]);

    // Logout Action
    const handleLogout = () => {
        router.post(route('logout'));
    };

    // User CRUD Functions
    const openCreateUserModal = () => {
        setUserModalMode('create');
        setUserFormData({ nama_lengkap: '', email: '', password: '', no_telepon: '', role: 'admin' });
        setUserModalOpen(true);
    };

    const openEditUserModal = (user) => {
        setUserModalMode('edit');
        setCurrentUser(user);
        setUserFormData({ 
            nama_lengkap: user.nama_lengkap, 
            email: user.email, 
            password: '', 
            no_telepon: user.no_telepon || '', 
            role: user.role 
        });
        setUserModalOpen(true);
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();
        
        if (userModalMode === 'create') {
            router.post(route('superadmin.users.store'), userFormData, {
                onSuccess: () => {
                    setUserModalOpen(false);
                },
                onError: (errors) => {
                    const firstErr = Object.values(errors)[0];
                    showToast(firstErr || "Gagal menambahkan akun!", "error");
                }
            });
        } else {
            router.put(route('superadmin.users.update', currentUser.id_user), userFormData, {
                onSuccess: () => {
                    setUserModalOpen(false);
                },
                onError: (errors) => {
                    const firstErr = Object.values(errors)[0];
                    showToast(firstErr || "Gagal memperbarui akun!", "error");
                }
            });
        }
    };

    const handleDeleteUser = (idUser, nama) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('superadmin.users.destroy', idUser), {
                onError: () => {
                    showToast("Gagal menghapus akun!", "error");
                }
            });
        }
    };

    // ==============================================================
    // DISCOUNT MANAGEMENT STATE & HANDLERS
    // ==============================================================
    const [discountSearch, setDiscountSearch] = useState('');
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [discountModalMode, setDiscountModalMode] = useState('create');
    const [currentDiscount, setCurrentDiscount] = useState(null);
    const [discountFormData, setDiscountFormData] = useState({
        kode_diskon: '',
        persentase: '',
        status: 'aktif',
        id_destinasi: '',
        berlaku_sampai: ''
    });

    const filteredDiscounts = useMemo(() => {
        if (!discountSearch.trim()) return initialDiscounts;
        return initialDiscounts.filter(d => 
            d.kode_diskon.toLowerCase().includes(discountSearch.toLowerCase())
        );
    }, [initialDiscounts, discountSearch]);

    const openCreateDiscountModal = () => {
        setDiscountModalMode('create');
        setDiscountFormData({ 
            kode_diskon: '', 
            persentase: '', 
            status: 'aktif',
            id_destinasi: '',
            berlaku_sampai: ''
        });
        setDiscountModalOpen(true);
    };

    const openEditDiscountModal = (discount) => {
        setDiscountModalMode('edit');
        setCurrentDiscount(discount);
        
        let formattedDate = '';
        if (discount.berlaku_sampai) {
            const d = new Date(discount.berlaku_sampai);
            if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            }
        }

        setDiscountFormData({ 
            kode_diskon: discount.kode_diskon, 
            persentase: discount.persentase, 
            status: discount.status,
            id_destinasi: discount.id_destinasi || '',
            berlaku_sampai: formattedDate
        });
        setDiscountModalOpen(true);
    };

    const handleDiscountSubmit = (e) => {
        e.preventDefault();
        if (discountModalMode === 'create') {
            router.post(route('superadmin.discounts.store'), discountFormData, {
                onSuccess: () => {
                    setDiscountModalOpen(false);
                },
                onError: (errors) => {
                    const firstErr = Object.values(errors)[0];
                    showToast(firstErr || "Gagal menambahkan kode diskon!", "error");
                }
            });
        } else {
            router.put(route('superadmin.discounts.update', currentDiscount.id_diskon), discountFormData, {
                onSuccess: () => {
                    setDiscountModalOpen(false);
                },
                onError: (errors) => {
                    const firstErr = Object.values(errors)[0];
                    showToast(firstErr || "Gagal memperbarui kode diskon!", "error");
                }
            });
        }
    };

    const handleDeleteDiscount = (idDiskon, code) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kode diskon "${code}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('superadmin.discounts.destroy', idDiskon), {
                onError: () => {
                    showToast("Gagal menghapus kode diskon!", "error");
                }
            });
        }
    };

    // Sidebar generator
    const sidebarContent = (isMobile = false) => (
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col">
                {/* Header Logo */}
                <div className="p-6 border-b border-indigo-950/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-900/30">
                            WAP
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">SYSTEM CORE</div>
                            <h1 className="font-playfair text-xl font-bold text-white leading-none">Super Admin</h1>
                        </div>
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 hover:text-white lg:hidden">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Super Admin User Profile */}
                <div className="m-4 p-4 rounded-2xl glass-card border border-indigo-800/20 flex items-center gap-3 glow-indigo">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-extrabold text-lg">
                            {auth?.user?.nama_lengkap ? auth.user.nama_lengkap.charAt(0) : 'S'}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 border-2 border-[#030310] rounded-full"></span>
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="text-xs font-bold text-white truncate">{auth?.user?.nama_lengkap || 'Super Administrator'}</h3>
                        <p className="text-[10px] text-indigo-500/80 font-medium truncate mb-1">{auth?.user?.email || 'super@pronojiwo.com'}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-red-500/15 text-red-400 border border-red-500/30 uppercase tracking-widest">
                            {auth?.user?.role || 'SUPER_ADMIN'}
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="px-4 py-2 space-y-1">
                    <p className="px-3 text-[10px] font-bold text-indigo-700 tracking-widest uppercase mb-2">MENU SUPER ADMIN</p>
                    
                    <button
                        onClick={() => { setActiveTab('ringkasan'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'ringkasan' ? 'bg-gradient-to-r from-indigo-600/15 to-transparent border-l-4 border-indigo-400 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3"><Activity className="w-4 h-4" /><span>Ringkasan Eksekutif</span></div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'ringkasan' ? 'rotate-90 text-indigo-400' : 'text-gray-600'}`} />
                    </button>

                    <button
                        onClick={() => { setActiveTab('manajemen_user'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'manajemen_user' ? 'bg-gradient-to-r from-indigo-600/15 to-transparent border-l-4 border-indigo-400 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3"><Users className="w-4 h-4" /><span>Manajemen User & Staf</span></div>
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">{initialUsers.length}</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('manajemen_diskon'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'manajemen_diskon' ? 'bg-gradient-to-r from-indigo-600/15 to-transparent border-l-4 border-indigo-400 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3"><Tag className="w-4 h-4" /><span>Manajemen Diskon & Promo</span></div>
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">{initialDiscounts.length}</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('transaksi'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'transaksi' ? 'bg-gradient-to-r from-indigo-600/15 to-transparent border-l-4 border-indigo-400 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3"><CreditCard className="w-4 h-4" /><span>Transaksi Booking</span></div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'transaksi' ? 'rotate-90 text-indigo-400' : 'text-gray-600'}`} />
                    </button>

                    <button
                        onClick={() => { setActiveTab('data_wisata'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'data_wisata' ? 'bg-gradient-to-r from-indigo-600/15 to-transparent border-l-4 border-indigo-400 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /><span>Data Destinasi Wisata</span></div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'data_wisata' ? 'rotate-90 text-indigo-400' : 'text-gray-600'}`} />
                    </button>

                    <button
                        onClick={() => { setActiveTab('laporan'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'laporan' ? 'bg-gradient-to-r from-indigo-600/15 to-transparent border-l-4 border-indigo-400 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3"><FileText className="w-4 h-4" /><span>Laporan Pendapatan</span></div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'laporan' ? 'rotate-90 text-indigo-400' : 'text-gray-600'}`} />
                    </button>


                    <button
                        onClick={() => { setActiveTab('log_aktivitas'); if (isMobile) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                            activeTab === 'log_aktivitas' ? 'bg-gradient-to-r from-indigo-600/15 to-transparent border-l-4 border-indigo-400 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex items-center gap-3"><ShieldAlert className="w-4 h-4" /><span>Log Aktivitas Sistem</span></div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'log_aktivitas' ? 'rotate-90 text-indigo-400' : 'text-gray-600'}`} />
                    </button>
                </nav>
            </div>

            <div className="p-4 border-t border-indigo-950/20">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all duration-300">
                    <LogOut className="w-4 h-4" /><span>Keluar Akun (Logout)</span>
                </button>
                <div className="mt-4 text-[10px] text-indigo-700/60 text-center font-medium">© 2026 Pronojiwo Nature Escape</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030310] text-gray-100 flex font-sans overflow-x-hidden antialiased">
            <Head title="Super Admin — Pronojiwo Nature Escape" />
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&display=swap');
                body { background-color: #030310 !important; font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: rgba(3, 3, 16, 0.5); }
                ::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
                .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px); }
                .glow-indigo { box-shadow: 0 0 40px -10px rgba(99, 102, 241, 0.15); }
.modal-fade-in { animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .chart-bar:hover { filter: brightness(1.2); }
                .react-datepicker {
                    background: #030310;
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    border-radius: 0.75rem;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .react-datepicker__header {
                    background: #02020a;
                    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
                }
                .react-datepicker__day {
                    color: #d1d5db;
                }
                .react-datepicker__day--selected {
                    background: #4f46d5;
                }
                .react-datepicker__day--keyboard-selected {
                    background: #4f46d5;
                }
                .react-datepicker__day:hover {
                    background: rgba(99, 102, 241, 0.2);
                }
                .react-datepicker__day--disabled {
                    color: #6b7280;
                }
                .react-datepicker__navigation {
                    border: none;
                }
                .react-datepicker__navigation-icon::before {
                    border-color: #9ca3af;
                }
                .react-datepicker__current-month {
                    color: #ffffff;
                }
                .react-datepicker__day-names {
                    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
                }
                .react-datepicker__day-name {
                    color: #9ca3af;
                    width: 2rem;
                    margin: 0.2rem;
                }
            `}</style>

            {/* Toast System */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 animate-bounce ${
                    toast.type === 'success' ? 'bg-indigo-950/85 border-indigo-500/40 text-indigo-300' : 'bg-red-950/85 border-red-500/40 text-red-300'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-indigo-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
                </div>
            )}

            {/* Mobile Sidebar */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-[#02020a] border-r border-indigo-950/40 flex flex-col justify-between h-screen z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>{sidebarContent(true)}</aside>

            {/* Desktop Sidebar */}
            <aside className="w-72 bg-[#02020a] border-r border-indigo-950/40 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 lg:flex hidden">
                {sidebarContent(false)}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
                
                {/* Ambient Decorative Blurs */}
                <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />
                <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-violet-500/5 rounded-full filter blur-[80px] pointer-events-none -z-10" />

                {/* Header */}
                <header className="px-4 sm:px-8 py-5 border-b border-indigo-950/30 flex items-center justify-between sticky top-0 bg-[#030310]/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-800/30 text-indigo-400 hover:text-white lg:hidden">
                            <Activity className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500/80 mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Pusat Komando Sistem</span>
                            </div>
                            <h2 className="text-base sm:text-xl font-bold font-playfair text-white tracking-wide">
                                {activeTab === 'ringkasan' && 'Ringkasan Eksekutif'}
                                {activeTab === 'manajemen_user' && 'Manajemen User & Staf'}
                                {activeTab === 'manajemen_diskon' && 'Manajemen Diskon & Promo'}
                                {activeTab === 'log_aktivitas' && 'Log Aktivitas Sistem'}
                                {activeTab === 'transaksi' && 'Data Transaksi & Booking'}
                                {activeTab === 'data_wisata' && 'Database Destinasi Wisata'}
                                {activeTab === 'laporan' && 'Laporan Pendapatan (Exportable)'}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {(activeTab === 'ringkasan' || activeTab === 'laporan') && (
                            <button onClick={exportToPDF} className="hidden sm:flex px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold items-center gap-2 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-900/40">
                                <Download className="w-4 h-4" /> Export Laporan (.pdf)
                            </button>
                        )}
                        <div className="px-3 py-2 rounded-xl bg-red-900/20 border border-red-500/25 text-[10px] sm:text-xs font-extrabold text-red-400 flex items-center gap-2">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">HIGHEST CLEARANCE</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8">
                    
                    {/* TAB 1: RINGKASAN EKSEKUTIF */}
                    {activeTab === 'ringkasan' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* KPI CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-6 rounded-2xl glass-card border border-indigo-500/10 hover:border-indigo-500/35 transition-all duration-300 relative group glow-indigo overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl group-hover:bg-indigo-500/15" />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL PENDAPATAN GLOBAL</span>
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><DollarSign className="w-5 h-5" /></div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-1">Rp {metrics.totalPendapatan.toLocaleString('id-ID')}</h3>
                                </div>

                                <div className="p-6 rounded-2xl glass-card border border-indigo-500/10 hover:border-indigo-500/35 transition-all duration-300 relative group glow-indigo overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl group-hover:bg-blue-500/15" />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL AKUN PENGGUNA</span>
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><Users className="w-5 h-5" /></div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-1">{metrics.totalPengguna} Akun</h3>
                                </div>

                                <div className="p-6 rounded-2xl glass-card border border-indigo-500/10 hover:border-indigo-500/35 transition-all duration-300 relative group glow-indigo overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl group-hover:bg-emerald-500/15" />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL TIKET TERJUAL</span>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Ticket className="w-5 h-5" /></div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-1">{metrics.totalTiket.toLocaleString('id-ID')} Tiket</h3>
                                </div>

                                <div className="p-6 rounded-2xl glass-card border border-indigo-500/10 hover:border-indigo-500/35 transition-all duration-300 relative group glow-indigo overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full filter blur-xl group-hover:bg-rose-500/15" />
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">TREN NAIK BULANAN</span>
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400"><TrendingUp className="w-5 h-5" /></div>
                                    </div>
                                    <h3 className={`text-2xl font-black mb-1 ${metrics.trendingPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {metrics.trendingPercentage > 0 ? '+' : ''}{metrics.trendingPercentage.toFixed(1)}%
                                    </h3>
                                    <p className="text-[10px] text-gray-500 mt-1">Dibandingkan bulan sebelumnya</p>
                                </div>
                            </div>

                            {/* CHART AREA */}
                            <div className="p-6 rounded-3xl glass-card border border-indigo-500/10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-400" /> Perbandingan Pendapatan Antar Destinasi</h3>
                                        <p className="text-xs text-gray-400">Distribusi pendapatan global per wisata alam bulan ini</p>
                                    </div>
                                </div>
                                
                                {/* Simulated CSS Bar Chart */}
                                <div className="flex items-end gap-4 h-64 mt-4 relative border-b border-indigo-950/50 pb-4">
                                    {/* Y-Axis labels */}
                                    <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[10px] text-gray-500 font-medium">
                                        <span>20M</span>
                                        <span>15M</span>
                                        <span>10M</span>
                                        <span>5M</span>
                                        <span>0</span>
                                    </div>
                                    
                                    <div className="flex-1 flex items-end justify-around pl-8 h-full">
                                        {metrics.destinationStats.map((dest, idx) => {
                                            // Max height based on highest revenue or default to 20M for visuals
                                            const maxRev = Math.max(20000000, ...metrics.destinationStats.map(d => d.pendapatan));
                                            const heightPercentage = dest.pendapatan === 0 ? 2 : (dest.pendapatan / maxRev) * 100;
                                            const colors = [
                                                "from-indigo-500 to-indigo-700",
                                                "from-blue-500 to-blue-700",
                                                "from-emerald-500 to-emerald-700",
                                                "from-rose-500 to-rose-700"
                                            ];
                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-3 w-1/5 group">
                                                    <div className="w-full relative flex items-end justify-center h-full">
                                                        <div 
                                                            className={`w-full rounded-t-xl bg-gradient-to-t ${colors[idx % colors.length]} chart-bar transition-all duration-500 shadow-lg`}
                                                            style={{ height: `${heightPercentage}%` }}
                                                        >
                                                            {/* Tooltip on hover */}
                                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#030310] px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl pointer-events-none">
                                                                Rp {(dest.pendapatan / 1000000).toFixed(1)}M
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 text-center truncate w-full">{dest.nama_wisata}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: MANAJEMEN USER & STAF */}
                    {activeTab === 'manajemen_user' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari nama / email user..."
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className="pl-11 pr-4 py-2.5 bg-[#030310] border border-indigo-900/30 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 text-white w-full sm:w-80 transition-all placeholder-gray-600"
                                    />
                                </div>
                                <button onClick={openCreateUserModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-900/30">
                                    <Plus className="w-4 h-4" /> Tambah Akun Staf/Admin
                                </button>
                            </div>

                            <div className="rounded-2xl glass-card border border-indigo-500/10 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-300">
                                        <thead className="bg-indigo-950/20 text-xs uppercase text-indigo-400/80 font-extrabold tracking-wider border-b border-indigo-900/30">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Nama Lengkap</th>
                                                <th className="px-6 py-4">Email</th>
                                                <th className="px-6 py-4">No Telepon</th>
                                                <th className="px-6 py-4 text-center">Role</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-indigo-900/20">
                                            {filteredUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                        <p>Tidak ada pengguna yang ditemukan.</p>
                                                    </td>
                                                </tr>
                                            ) : filteredUsers.map((user) => (
                                                <tr key={user.id_user} className="hover:bg-white/[0.01] transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-500">#{user.id_user}</td>
                                                    <td className="px-6 py-4 font-semibold text-white">{user.nama_lengkap}</td>
                                                    <td className="px-6 py-4">{user.email}</td>
                                                    <td className="px-6 py-4">{user.no_telepon || '-'}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        {user.role === 'super_admin' && (
                                                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">Super Admin</span>
                                                        )}
                                                        {user.role === 'admin' && (
                                                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">Admin</span>
                                                        )}
                                                        {user.role === 'pengunjung' && (
                                                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Pengunjung</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => openEditUserModal(user)} className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors" title="Edit Role">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            {user.role !== 'super_admin' && (
                                                                <button onClick={() => handleDeleteUser(user.id_user, user.nama_lengkap)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Hapus Akun">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: MANAJEMEN DISKON & PROMO */}
                    {activeTab === 'manajemen_diskon' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari kode diskon..."
                                        value={discountSearch}
                                        onChange={(e) => setDiscountSearch(e.target.value)}
                                        className="pl-11 pr-4 py-2.5 bg-[#030310] border border-indigo-900/30 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 text-white w-full sm:w-80 transition-all placeholder-gray-600 animate-pulse-once"
                                    />
                                </div>
                                <button onClick={openCreateDiscountModal} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold tracking-wider transition-all duration-300 shadow-lg shadow-indigo-900/40 active:scale-97">
                                    <Plus className="w-4 h-4" /> TAMBAH KODE DISKON / PROMO
                                </button>
                            </div>

                            <div className="rounded-3xl glass-card border border-indigo-500/10 overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-300">
                                        <thead className="bg-indigo-950/20 text-xs uppercase text-indigo-400/80 font-extrabold tracking-wider border-b border-indigo-900/30">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Kode Diskon</th>
                                                <th className="px-6 py-4">Persentase</th>
                                                <th className="px-6 py-4">Target Destinasi</th>
                                                <th className="px-6 py-4">Masa Berlaku</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-indigo-900/20">
                                            {filteredDiscounts.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-16 text-center text-gray-500">
                                                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                        <p className="font-semibold text-sm">Tidak ada kode diskon yang ditemukan.</p>
                                                    </td>
                                                </tr>
                                            ) : filteredDiscounts.map((discount) => (
                                                <tr key={discount.id_diskon} className="hover:bg-white/[0.01] transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-500">#{discount.id_diskon}</td>
                                                    <td className="px-6 py-4 font-bold text-indigo-300 tracking-wider text-base">{discount.kode_diskon}</td>
                                                    <td className="px-6 py-4 font-semibold text-white">{discount.persentase}% OFF</td>
                                                    <td className="px-6 py-4 font-semibold text-gray-300">
                                                        {discount.id_destinasi ? (
                                                            <span className="inline-block px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                                                {initialDestinations.find(d => d.id_destinasi === discount.id_destinasi)?.nama_wisata || `Destinasi #${discount.id_destinasi}`}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block px-2.5 py-1 rounded-lg text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                                                Semua Wisata
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-semibold">
                                                        {discount.berlaku_sampai ? (
                                                            (() => {
                                                                const isExpired = new Date(discount.berlaku_sampai) < new Date();
                                                                return (
                                                                    <div className="space-y-1">
                                                                        <div className="text-gray-300">
                                                                            {new Date(discount.berlaku_sampai).toLocaleString('id-ID', {
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
                                                            <span className="text-gray-500 italic">Selamanya</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {discount.status === 'aktif' ? (
                                                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">Aktif</span>
                                                        ) : (
                                                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-500/15 text-red-400 border border-red-500/30 uppercase tracking-wider">Tidak Aktif</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => openEditDiscountModal(discount)} className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all" title="Edit Diskon">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteDiscount(discount.id_diskon, discount.kode_diskon)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Hapus Diskon">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: LOG AKTIVITAS SISTEM */}
                    {activeTab === 'log_aktivitas' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="p-8 rounded-3xl glass-card border border-indigo-500/10">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-400" /> Rekam Jejak Digital (Audit Trail)
                                </h3>
                                
                                <div className="relative border-l-2 border-indigo-900/30 ml-4 space-y-8 pb-4">
                                    {initialLogs.map((log) => (
                                        <div key={log.id} className="relative pl-6">
                                            {/* Timeline Node */}
                                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-[#030310] ${
                                                log.tipe === 'verifikasi' ? 'bg-emerald-400' :
                                                log.tipe === 'update' ? 'bg-blue-400' :
                                                log.tipe === 'peringatan' ? 'bg-red-400' :
                                                'bg-indigo-400'
                                            }`} />
                                            
                                            <div className="bg-[#030310]/50 border border-indigo-900/20 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">{log.waktu}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 leading-relaxed">{log.deskripsi}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: TRANSAKSI BOOKING */}
                    {activeTab === 'transaksi' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="rounded-2xl glass-card border border-indigo-500/10 overflow-hidden">
                                <div className="p-5 border-b border-indigo-900/30 flex items-center gap-2 bg-[#030310]/80">
                                    <CreditCard className="w-5 h-5 text-indigo-400" />
                                    <h3 className="text-white font-bold text-sm">Semua Transaksi Masuk</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-300">
                                        <thead className="bg-indigo-950/20 text-xs uppercase text-indigo-400/80 font-extrabold tracking-wider border-b border-indigo-900/30">
                                            <tr>
                                                <th className="px-6 py-4">ID Booking</th>
                                                <th className="px-6 py-4">User</th>
                                                <th className="px-6 py-4">Destinasi</th>
                                                <th className="px-6 py-4">Tiket</th>
                                                <th className="px-6 py-4">Total Harga</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-indigo-900/20">
                                            {initialBookings.map(booking => (
                                                <tr key={booking.id_booking} className="hover:bg-white/[0.01] transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-500">#{booking.id_booking}</td>
                                                    <td className="px-6 py-4 font-semibold text-white">{booking.user?.nama_lengkap || 'Unknown'}</td>
                                                    <td className="px-6 py-4 text-gray-400">{booking.destinasi?.nama_wisata}</td>
                                                    <td className="px-6 py-4 text-gray-400">{booking.jumlah_tiket} Tiket</td>
                                                    <td className="px-6 py-4 text-emerald-400 font-semibold">Rp {booking.total_harga.toLocaleString('id-ID')}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        {booking.pembayaran?.status_pembayaran === 'lunas' ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">Lunas</span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">{booking.pembayaran?.status_pembayaran || 'Pending'}</span>
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

                    {/* TAB: DATA WISATA */}
                    {activeTab === 'data_wisata' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {initialDestinations.map(dest => (
                                    <div key={dest.id_destinasi} className="rounded-2xl glass-card border border-indigo-500/10 overflow-hidden hover:border-indigo-500/30 transition-all group">
                                        <div className="h-40 overflow-hidden relative">
                                            <img src={dest.gambar} alt={dest.nama_wisata} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#030310] to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-lg font-bold text-white mb-1">{dest.nama_wisata}</h3>
                                            </div>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400 font-semibold">Harga Tiket:</span>
                                                <span className="text-emerald-400 font-bold">Rp {dest.harga_tiket.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400 font-semibold">Kapasitas:</span>
                                                <span className="text-indigo-400 font-bold">{dest.kapasitas_harian} Orang</span>
                                            </div>
                                            <div className="pt-4 border-t border-indigo-900/30">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${dest.status === 'Buka' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    Status: {dest.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

{/* TAB: LAPORAN PENDAPATAN */}
                    {activeTab === 'laporan' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="p-8 rounded-3xl glass-card border border-indigo-500/10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-indigo-400" /> Laporan Pendapatan Berdasarkan Wisata
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-400">Dari:</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                maxDate={new Date()}
                                                locale={id}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Pilih tanggal"
                                                className="px-3 py-1.5 bg-[#02020a] border border-indigo-900/30 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/50 w-32"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-400">Sampai:</label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate}
                                                maxDate={new Date()}
                                                locale={id}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Pilih tanggal"
                                                className="px-3 py-1.5 bg-[#02020a] border border-indigo-900/30 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/50 w-32"
                                            />
                                        </div>
                                        {(startDate || endDate) && (
                                            <button 
                                                onClick={() => { setStartDate(null); setEndDate(null); }}
                                                className="px-2 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-600/40 transition-all"
                                                title="Reset tanggal"
                                            >
                                                Reset
                                            </button>
                                        )}
                                        <button onClick={exportToPDF} className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/40 transition-all flex items-center gap-2">
                                            <Download className="w-4 h-4" /> Export PDF
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-300">
                                        <thead className="bg-indigo-950/40 text-xs uppercase text-indigo-300 font-extrabold tracking-wider border-b border-indigo-500/30">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Nama Destinasi Wisata</th>
                                                <th className="px-6 py-4 text-right">Pendapatan Bersih</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-indigo-900/20">
                                            {metrics.destinationStats.map((dest) => (
                                                <tr key={dest.id_destinasi} className="hover:bg-indigo-900/10 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-500">#{dest.id_destinasi}</td>
                                                    <td className="px-6 py-4 font-semibold text-white">{dest.nama_wisata}</td>
                                                    <td className="px-6 py-4 text-right text-emerald-400 font-bold">Rp {dest.pendapatan.toLocaleString('id-ID')}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-indigo-950/20">
                                                <td colSpan="2" className="px-6 py-5 text-right font-black text-indigo-300 uppercase tracking-widest">Total Pendapatan Sistem</td>
                                                <td className="px-6 py-5 text-right font-black text-emerald-400 text-lg">Rp {metrics.totalPendapatan.toLocaleString('id-ID')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* MODAL USER FORM */}
            {userModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setUserModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-[#030310] border border-indigo-500/20 rounded-3xl shadow-2xl overflow-hidden modal-fade-in flex flex-col">
                        <div className="px-6 py-5 border-b border-indigo-900/30 flex items-center justify-between bg-[#030310]/80">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {userModalMode === 'create' ? <Plus className="w-5 h-5 text-indigo-400" /> : <Edit3 className="w-5 h-5 text-indigo-400" />}
                                {userModalMode === 'create' ? 'Tambah Akun Pengguna' : 'Edit Akun Pengguna'}
                            </h3>
                            <button onClick={() => setUserModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUserSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Nama Lengkap</label>
                                    <input type="text" required value={userFormData.nama_lengkap} onChange={e => setUserFormData({...userFormData, nama_lengkap: e.target.value})} className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Alamat Email</label>
                                    <input type="email" required value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Password {userModalMode === 'edit' && '(Kosongkan jika tidak diubah)'}</label>
                                    <input type="password" required={userModalMode === 'create'} value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">No. Telepon (Opsional)</label>
                                    <input type="text" value={userFormData.no_telepon} onChange={e => setUserFormData({...userFormData, no_telepon: e.target.value})} className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Role Akses</label>
                                    <select value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value})} className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none">
                                        <option value="pengunjung">Pengunjung</option>
                                        <option value="admin">Admin Operasional</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-indigo-900/30">
                                <button type="button" onClick={() => setUserModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-indigo-900/50 text-gray-300 text-sm font-bold hover:bg-indigo-950/20 transition-all">
                                    Batal
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-900/30">
                                    Simpan Akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DISCOUNT FORM */}
            {discountModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setDiscountModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-[#030310] border border-indigo-500/20 rounded-3xl shadow-2xl overflow-hidden modal-fade-in flex flex-col">
                        <div className="px-6 py-5 border-b border-indigo-900/30 flex items-center justify-between bg-[#030310]/80">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Tag className="w-5 h-5 text-indigo-400" />
                                {discountModalMode === 'create' ? 'Tambah Kode Diskon' : 'Edit Kode Diskon'}
                            </h3>
                            <button onClick={() => setDiscountModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleDiscountSubmit} className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Kode Diskon / Promo</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="CONTOH: PRONOJIWO20"
                                        value={discountFormData.kode_diskon} 
                                        onChange={e => setDiscountFormData({...discountFormData, kode_diskon: e.target.value.toUpperCase()})} 
                                        className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 uppercase tracking-wider font-semibold" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Persentase Potongan (%)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        min="1"
                                        max="100"
                                        placeholder="Masukkan angka 1 - 100"
                                        value={discountFormData.persentase} 
                                        onChange={e => setDiscountFormData({...discountFormData, persentase: e.target.value})} 
                                        className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 font-semibold" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Target Destinasi Wisata</label>
                                    <select 
                                        value={discountFormData.id_destinasi} 
                                        onChange={e => setDiscountFormData({...discountFormData, id_destinasi: e.target.value})} 
                                        className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none font-semibold"
                                    >
                                        <option value="">Semua Destinasi Wisata</option>
                                        {initialDestinations.map(dest => (
                                            <option key={dest.id_destinasi} value={dest.id_destinasi}>
                                                {dest.nama_wisata}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Masa Berlaku (Kosongkan jika selamanya)</label>
                                    <input 
                                        type="datetime-local" 
                                        value={discountFormData.berlaku_sampai} 
                                        onChange={e => setDiscountFormData({...discountFormData, berlaku_sampai: e.target.value})} 
                                        className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 font-semibold" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Status Promo</label>
                                    <select 
                                        value={discountFormData.status} 
                                        onChange={e => setDiscountFormData({...discountFormData, status: e.target.value})} 
                                        className="w-full bg-[#02020a] border border-indigo-900/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none font-semibold"
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="tidak_aktif">Tidak Aktif</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-indigo-900/30">
                                <button type="button" onClick={() => setDiscountModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-indigo-900/50 text-gray-300 text-sm font-bold hover:bg-indigo-950/20 transition-all">
                                    Batal
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-900/30">
                                    Simpan Diskon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

