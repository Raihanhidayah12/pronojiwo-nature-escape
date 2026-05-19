import { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";

// Curated Unsplash fallback images mapping based on index or name
const getDestImage = (dbPhoto, index) => {
    if (dbPhoto && !dbPhoto.includes("placeholder") && !dbPhoto.includes("build/assets")) {
        return dbPhoto;
    }
    const unsplashPics = [
        "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80", // Tumpak Sewu
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", // Panorama Kapas Biru
        "https://images.unsplash.com/photo-1432406186267-e85d9921434f?auto=format&fit=crop&w=800&q=80", // Air Terjun Kapas Biru
        "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&q=80", // Kabut Pelangi
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80", // Hutan Pinus
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"  // Bukit Sriti
    ];
    return unsplashPics[index % unsplashPics.length];
};

const getDestCategory = (name) => {
    if (!name) return "Wisata Alam";
    const lowerName = name.toLowerCase();
    if (lowerName.includes("air terjun")) return "Air Terjun";
    if (lowerName.includes("panorama") || lowerName.includes("bukit")) return "Panorama";
    if (lowerName.includes("hutan") || lowerName.includes("pinus")) return "Hutan";
    return "Wisata Alam";
};



const features = [
    {
        icon: "🌿",
        title: "Kawasan Asri & Lestari",
        desc: "Komitmen penuh menjaga keaslian ekosistem alam demi kelangsungan flora dan fauna lokal.",
        gradient: "from-emerald-500 to-teal-500"
    },
    {
        icon: "🗺️",
        title: "Local Guides Berlisensi",
        desc: "Didampingi warga lokal berpengalaman yang sangat mengenal sejarah dan rute teraman alam liar.",
        gradient: "from-teal-500 to-cyan-500"
    },
    {
        icon: "🎟️",
        title: "E-Ticketing Praktis",
        desc: "Kemudahan memesan tiket secara daring kapan saja dengan kalkulator biaya transparan.",
        gradient: "from-amber-500 to-yellow-500"
    },
    {
        icon: "🛡️",
        title: "Prioritas Keamanan",
        desc: "Jaminan mitigasi risiko menyeluruh dan pemeliharaan fasilitas jalur trekking berkala.",
        gradient: "from-emerald-600 to-emerald-400"
    }
];

const navLinks = [
    { name: "Beranda", id: "beranda" },
    { name: "Destinasi Favorit", id: "destinasi" },
    { name: "Pesan Tiket", id: "tiket" },
    { name: "Testimoni", id: "testimoni" },
    { name: "Kontak", id: "kontak" }
];

// Helper constants & calendar generation functions
const INDO_MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const WEEK_DAYS = ["M", "S", "S", "R", "K", "J", "S"];

const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    const startDayOfWeek = date.getDay(); // 0 Sunday, 1 Monday...
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    // Fill previous month padding days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        days.push({
            day: prevMonthLastDate - i,
            month: month - 1 === -1 ? 11 : month - 1,
            year: month - 1 === -1 ? year - 1 : year,
            isCurrentMonth: false,
            isPast: true
        });
    }

    // Fill current month days
    const daysCount = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysCount; i++) {
        const currentDate = new Date(year, month, i);
        days.push({
            day: i,
            month: month,
            year: year,
            isCurrentMonth: true,
            isPast: currentDate < today
        });
    }

    // Fill next month padding days
    const totalCells = days.length > 35 ? 42 : 35;
    const nextDaysCount = totalCells - days.length;
    for (let i = 1; i <= nextDaysCount; i++) {
        days.push({
            day: i,
            month: month + 1 === 12 ? 0 : month + 1,
            year: month + 1 === 12 ? year + 1 : year,
            isCurrentMonth: false,
            isPast: false
        });
    }
    return days;
};

const getCategoryIcon = (category) => {
    switch (category) {
        case "Air Terjun": return "🌊";
        case "Panorama": return "⛰️";
        case "Hutan": return "🌲";
        default: return "🌿";
    }
};

// ── CUSTOM SELECT COMPONENT ──
function CustomSelect({ value, onChange, options, placeholder, isDark }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => String(opt.id) === String(value));

    return (
        <div ref={containerRef} className="relative w-full text-left">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:ring-1 ${isDark
                    ? 'bg-emerald-950/50 border border-white/20 text-white focus:border-emerald-400 focus:ring-emerald-400'
                    : 'bg-stone-50 border border-gray-200 text-gray-900 focus:border-emerald-600 focus:ring-emerald-600'
                    }`}
            >
                <div className="flex items-center gap-2 truncate">
                    {selectedOption ? (
                        <>
                            <span className="text-base flex-shrink-0">{getCategoryIcon(selectedOption.category)}</span>
                            <span className="font-medium truncate">{selectedOption.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedOption.price)}
                            </span>
                        </>
                    ) : (
                        <span className={isDark ? 'text-white/40' : 'text-gray-400'}>{placeholder}</span>
                    )}
                </div>
                <svg
                    className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-white/60' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {/* Always mounted with state classes for hardware-accelerated transitions */}
            <div className={`absolute z-50 mt-1.5 w-full rounded-2xl p-2 shadow-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top transform ${isOpen
                ? 'opacity-100 scale-100 pointer-events-auto visible translate-y-0'
                : 'opacity-0 scale-95 pointer-events-none invisible -translate-y-2'
                } ${isDark
                    ? 'bg-[#052217] border-white/10 text-white shadow-emerald-950/80 shadow-2xl'
                    : 'bg-white border-gray-100 text-gray-900 shadow-stone-300/40 shadow-2xl'
                }`}>
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {options.map((opt) => {
                        const isSelected = String(opt.id) === String(value);
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                    onChange(String(opt.id));
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${isSelected
                                    ? isDark ? 'bg-emerald-800/80 text-white font-bold' : 'bg-emerald-50 text-emerald-900 font-black'
                                    : isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-stone-50 text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    <span className="text-base flex-shrink-0">{getCategoryIcon(opt.category)}</span>
                                    <div className="truncate">
                                        <span className="block font-semibold truncate">{opt.name}</span>
                                        <span className={`text-[10px] ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{opt.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(opt.price)}
                                    </span>
                                    {isSelected && (
                                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── CUSTOM DATE PICKER COMPONENT ──
function CustomDatePicker({ value, onChange, isDark }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const initialDate = value ? new Date(value) : new Date();
    const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
    const [viewYear, setViewYear] = useState(initialDate.getFullYear());

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            setViewMonth(d.getMonth());
            setViewYear(d.getFullYear());
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const days = getDaysInMonth(viewMonth, viewYear);

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return "-- Pilih Tanggal --";
        const d = new Date(dateStr);
        return `${d.getDate()} ${INDO_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    };

    const handleDaySelect = (d) => {
        if (d.isPast) return;
        const formattedMonth = String(d.month + 1).padStart(2, "0");
        const formattedDay = String(d.day).padStart(2, "0");
        const dateStr = `${d.year}-${formattedMonth}-${formattedDay}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full text-left">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:ring-1 ${isDark
                    ? 'bg-emerald-950/50 border border-white/20 text-white focus:border-emerald-400 focus:ring-emerald-400'
                    : 'bg-stone-50 border border-gray-200 text-gray-900 focus:border-emerald-600 focus:ring-emerald-600'
                    }`}
            >
                <div className="flex items-center gap-2 truncate">
                    <svg className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className={value ? 'font-medium truncate' : isDark ? 'text-white/40' : 'text-gray-400'}>
                        {formatDateDisplay(value)}
                    </span>
                </div>
                <svg
                    className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-white/60' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {/* Always mounted with state classes for hardware-accelerated transitions */}
            <div className={`absolute z-50 mt-1.5 w-[290px] md:w-[310px] rounded-2xl p-4 shadow-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-right md:origin-top transform ${isOpen
                ? 'opacity-100 scale-100 pointer-events-auto visible translate-y-0'
                : 'opacity-0 scale-95 pointer-events-none invisible -translate-y-2'
                } ${isDark
                    ? 'bg-[#052217] border-white/10 text-white shadow-emerald-950/85 shadow-2xl right-0 lg:left-0'
                    : 'bg-white border-gray-100 text-gray-900 shadow-stone-300/40 shadow-2xl right-0'
                }`}>
                {/* Header: Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-stone-100 text-gray-700'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <span className="font-bold text-xs uppercase tracking-wider">
                        {INDO_MONTHS[viewMonth]} {viewYear}
                    </span>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-stone-100 text-gray-700'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {WEEK_DAYS.map((day, i) => (
                        <span key={i} className={`text-[10px] font-black uppercase ${i === 0 ? 'text-rose-500' : isDark ? 'text-white/40' : 'text-gray-400'}`}>
                            {day}
                        </span>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((d, i) => {
                        if (!d.isCurrentMonth) {
                            return <div key={i} className="aspect-square w-full"></div>;
                        }

                        const dateStr = `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
                        const isSelected = value === dateStr;
                        const isToday = today.getDate() === d.day && today.getMonth() === d.month && today.getFullYear() === d.year;

                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleDaySelect(d)}
                                disabled={d.isPast}
                                className={`aspect-square w-full text-xs font-bold rounded-lg flex flex-col items-center justify-center relative transition-all duration-200 ${d.isPast
                                    ? isDark ? 'text-white/20 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
                                    : isSelected
                                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-emerald-950 font-black shadow-lg shadow-amber-500/20 scale-105'
                                        : isDark
                                            ? 'hover:bg-white/10 text-white/80'
                                            : 'hover:bg-stone-100 text-gray-700'
                                    }`}
                            >
                                <span>{d.day}</span>
                                {isToday && !isSelected && (
                                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function WisataAlamPronojiwo({ auth, destinasis = [], reviews = [], stats = {}, canLogin = true, canRegister = true }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [visibleStats, setVisibleStats] = useState(false);
    const [counts, setCounts] = useState({ wisata: 0, pengunjung: 0, rating: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Interactive UI States
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [selectedDestDetails, setSelectedDestDetails] = useState(null);

    // Booking Form States
    const [bookingDestId, setBookingDestId] = useState("");
    const [bookingQty, setBookingQty] = useState(1);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [createdTicket, setCreatedTicket] = useState(null);

    // Contact Form States
    const [contactNama, setContactNama] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactSubjek, setContactSubjek] = useState("");
    const [contactPesan, setContactPesan] = useState("");
    const [contactLoading, setContactLoading] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);

    const statsRef = useRef(null);

    // Process destination list
    const activeDestinations = destinasis.length > 0
        ? destinasis.map((d, index) => ({
            id: d.id,
            name: d.nama_wisata || "Destinasi Wisata",
            location: d.lokasi_rute || "Pronojiwo, Lumajang",
            category: d.kategori || getDestCategory(d.nama_wisata),
            rating: d.rating || d.rating_asli || 4.8,
            reviewCount: d.total_review || 0,
            image: getDestImage(d.foto, index),
            description: d.deskripsi || "Keindahan alam Pronojiwo yang menakjubkan dan asri.",
            price: d.harga_tiket || 15000,
            capacity: d.kapasitas || 150,
            facilities: d.fasilitas
                ? d.fasilitas.split(',').map(f => f.trim())
                : ((d.nama_wisata || "").toLowerCase().includes("sewu")
                    ? ["Pemandu lokal", "Gazebo santai", "Spot foto", "Warung makan", "Area parkir", "Toilet umum"]
                    : ["Spot foto estetik", "Camping area", "Gazebo", "Toilet"]),
            coordinates: (d.nama_wisata || "").toLowerCase().includes("sewu") ? "8.2291° S, 112.9157° E" : "8.2195° S, 112.9234° E"
        }))
        : [];

    // Process testimonials list
    const activeTestimonials = reviews.length > 0
        ? reviews.map((r) => ({
            name: r.nama || "Pengunjung Anonim",
            location: r.destinasi || "Wisata Alam",
            rating: r.rating || 5,
            text: r.ulasan || "Pengalaman liburan yang luar biasa di Pronojiwo.",
            avatar: r.nama ? r.nama.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "PA",
            date: r.created_at || "Baru-baru ini"
        }))
        : [];

    // Get current booking selected destination details
    const selectedBookingDest = activeDestinations.find(d => String(d.id) === String(bookingDestId));
    const bookingSubtotal = selectedBookingDest ? selectedBookingDest.price * bookingQty : 0;
    const bookingTax = selectedBookingDest ? Math.round(bookingSubtotal * 0.05) : 0;
    const bookingTotal = bookingSubtotal + bookingTax;

    // Parallax mouse effect for hero section
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            setMousePosition({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Stats animation observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisibleStats(true); },
            { threshold: 0.2 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    // Animated counter
    useEffect(() => {
        if (!visibleStats) return;
        const steps = 60;
        let step = 0;
        const targetWisata = stats.total_destinasi ?? 0;
        const targetReview = stats.total_review ?? 0;
        const targetRating = stats.avg_rating ?? 0.0;

        const timer = setInterval(() => {
            step++;
            const ease = 1 - Math.pow(1 - step / steps, 3);
            setCounts({
                wisata: Math.floor(ease * targetWisata),
                pengunjung: Math.floor(ease * targetReview),
                rating: parseFloat((ease * targetRating).toFixed(1)),
            });
            if (step >= steps) clearInterval(timer);
        }, 1500 / steps);
        return () => clearInterval(timer);
    }, [visibleStats, stats]);

    // Auto testimonial slider
    useEffect(() => {
        if (activeTestimonials.length === 0) return;
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % activeTestimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [activeTestimonials.length]);

    // Format currency
    const formatPrice = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(num);
    };

    // Handle Quick Booking Submit
    const handleQuickBookingSubmit = (e) => {
        e.preventDefault();
        if (!auth?.user) {
            alert("Anda harus masuk (login) terlebih dahulu untuk melakukan pemesanan dan pembayaran!");
            window.location.href = "/login";
            return;
        }
        if (!bookingDestId) return alert("Pilih destinasi wisata terlebih dahulu!");
        if (!bookingDate) return alert("Pilih tanggal kunjungan Anda!");

        const destination = activeDestinations.find(d => String(d.id) === String(bookingDestId));

        // Generate Ticket Mockup
        const ticketCode = "TKT-" + Math.floor(Math.random() * 90000 + 10000);
        setCreatedTicket({
            code: ticketCode,
            destination: destination.name,
            location: destination.location,
            date: bookingDate,
            quantity: bookingQty,
            total: bookingTotal,
            pricePerTicket: destination.price
        });
        setBookingSuccess(true);
    };

    // Close checkout success state and reset form
    const resetBookingForm = () => {
        setBookingSuccess(false);
        setCreatedTicket(null);
        setBookingDestId("");
        setBookingQty(1);
        setBookingDate("");
    };

    // Category lists for filtering
    const categories = ["Semua", "Air Terjun", "Panorama", "Hutan"];

    const filteredDestinations = selectedCategory === "Semua"
        ? activeDestinations
        : activeDestinations.filter(d => d.category === selectedCategory);

    // Direct Booking action from Modal Detail click
    const handleDirectBook = (dest) => {
        if (!auth?.user) {
            alert("Anda harus masuk (login) terlebih dahulu untuk melakukan pemesanan dan pembayaran!");
            window.location.href = "/login";
            return;
        }
        setBookingDestId(String(dest.id));
        setBookingQty(1);
        // Default tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setBookingDate(tomorrow.toISOString().split("T")[0]);
        setSelectedDestDetails(null);

        // Scroll smoothly to ticket widget
        const ticketSection = document.getElementById("tiket");
        if (ticketSection) {
            ticketSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="font-sans text-gray-900 overflow-x-hidden antialiased bg-white selection:bg-emerald-600 selection:text-white">
            <Head>
                <title>Pronojiwo Nature Escape - Surga Tersembunyi Lumajang</title>
                <meta name="description" content="Temukan surga tersembunyi dengan air terjun spektakuler, bukit hijau, dan petualangan tak terlupakan di jantung Pronojiwo, Lumajang, Jawa Timur." />
            </Head>

            {/* ── BACK TO TOP BUTTON ── */}
            <button
                className={`fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-emerald-500/50 hover:rotate-6 ${scrolled ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-50 pointer-events-none'}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Kembali ke atas"
            >
                <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"></path>
                </svg>
            </button>

            {/* ── NAVBAR ── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-white/90 backdrop-blur-xl border-b border-emerald-100/30 shadow-xl shadow-emerald-950/5"
                : "bg-transparent"
                }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-22">

                    {/* Logo Premium */}
                    <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative">
                            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-base shadow-xl shadow-emerald-500/20 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                WAP
                            </div>
                            <div className="absolute -inset-1.5 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                        </div>
                        <div className="leading-tight">
                            <span className="block font-black text-[10px] text-emerald-700 tracking-widest uppercase">WISATA ALAM</span>
                            <span className={`block font-playfair font-black text-xl transition-colors duration-300 ${scrolled ? 'text-gray-950' : 'text-white'}`}>PRONOJIWO</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                className={`relative text-sm font-bold tracking-wide transition-all duration-300 group ${scrolled ? 'text-gray-700 hover:text-emerald-700' : 'text-white/90 hover:text-white'}`}
                            >
                                {link.name}
                                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                    </div>

                    {/* Login/Register Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href={route('login')}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 border-2 ${scrolled
                                ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-md hover:shadow-emerald-500/10'
                                : 'border-white/40 text-white hover:bg-white hover:text-emerald-950 hover:border-white shadow-lg'}`}
                        >
                            Masuk
                        </Link>
                        <Link
                            href={route('register')}
                            className="px-6 py-3 rounded-full font-bold text-sm tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-xl shadow-emerald-700/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Daftar Baru
                        </Link>
                    </div>

                    {/* Hamburger Button */}
                    <button
                        className="lg:hidden p-3 rounded-2xl hover:bg-emerald-500/10 transition-colors duration-300"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 space-y-1.5">
                            <span className={`block h-[3px] bg-current rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''} ${scrolled ? 'text-gray-900' : 'text-white'}`} />
                            <span className={`block h-[3px] bg-current rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''} ${scrolled ? 'text-gray-900' : 'text-white'}`} />
                            <span className={`block h-[3px] bg-current rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''} ${scrolled ? 'text-gray-900' : 'text-white'}`} />
                        </div>
                    </button>
                </div>

            </nav>

            {/* Mobile Full-Screen Premium Slide Menu */}
            {/* Backdrop overlay */}
            <div
                className={`lg:hidden fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in panel from right */}
            <div
                className={`lg:hidden fixed top-0 right-0 bottom-0 z-[9999] w-[88vw] max-w-sm flex flex-col transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-x-0 shadow-[-40px_0_80px_rgba(0,0,0,0.5)]' : 'translate-x-full'}`}
                style={{ background: 'linear-gradient(160deg, #022c22 0%, #041c14 60%, #021a10 100%)' }}
            >
                {/* Decorative ambient glows */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -left-20 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 right-10 w-56 h-56 bg-emerald-600/10 rounded-full blur-3xl" />
                    {/* Decorative grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                {/* ── HEADER ── */}
                <div className="relative z-10 flex items-center justify-between px-6 pt-8 pb-5">
                    {/* Brand identity */}
                    <div className={`flex items-center gap-3 transition-all duration-700 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
                        {/* Logo badge */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-emerald-900/60">
                                WAP
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl blur-md opacity-30" />
                        </div>
                        <div className="leading-tight">
                            <span className="block text-[9px] font-black text-emerald-400 tracking-[0.2em] uppercase">Wisata Alam</span>
                            <span className="block font-playfair font-black text-lg text-white tracking-wide leading-none">PRONOJIWO</span>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        className={`relative w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${menuOpen ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-75 opacity-0'}`}
                        style={{ transitionDelay: '150ms' }}
                        onClick={() => setMenuOpen(false)}
                        aria-label="Tutup menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Thin separator line with glow */}
                <div className="relative mx-6 mb-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                    <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent mt-0.5" />
                </div>

                {/* ── NAV SECTION LABEL ── */}
                <div className={`px-6 pt-5 pb-3 transition-all duration-700 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: '180ms' }}>
                    <span className="text-[9px] font-black tracking-[0.25em] uppercase text-emerald-500/70">🧭 Navigasi Utama</span>
                </div>

                {/* ── NAV LINKS ── scrollable */}
                <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link, idx) => {
                            const navMeta = {
                                beranda: { desc: 'Gerbang surga alam Pronojiwo', icon: '🏠', gradient: 'from-emerald-500 to-teal-500', color: 'text-emerald-300' },
                                destinasi: { desc: 'Katalog spot petualangan terbaik', icon: '🏔️', gradient: 'from-teal-500 to-cyan-500', color: 'text-teal-300' },
                                tiket: { desc: 'E-tiket masuk praktis & cepat', icon: '🎫', gradient: 'from-amber-500 to-orange-500', color: 'text-amber-300' },
                                testimoni: { desc: 'Kisah nyata para penjelajah kami', icon: '💬', gradient: 'from-violet-500 to-purple-500', color: 'text-violet-300' },
                                kontak: { desc: 'Hubungi pramuwisata ramah kami', icon: '📞', gradient: 'from-rose-500 to-pink-500', color: 'text-rose-300' },
                            };
                            const meta = navMeta[link.id] || { desc: '', icon: '🌿', gradient: 'from-emerald-500 to-teal-500', color: 'text-emerald-300' };

                            return (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-500 overflow-hidden
                                        border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10
                                        active:scale-[0.98] transform
                                        ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                                    onClick={() => setMenuOpen(false)}
                                    style={{ transitionDelay: menuOpen ? `${200 + idx * 70}ms` : '0ms' }}
                                >
                                    {/* Hover shimmer */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${meta.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />

                                    {/* Icon pill with gradient */}
                                    <div className={`relative w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-400`}>
                                        <span className="drop-shadow-sm">{meta.icon}</span>
                                    </div>

                                    {/* Text content */}
                                    <div className="flex-1 min-w-0">
                                        <span className={`block font-bold text-[15px] text-white group-hover:${meta.color} transition-colors duration-300 leading-tight`}>
                                            {link.name}
                                        </span>
                                        <span className="block text-[11px] text-white/40 font-medium mt-0.5 truncate group-hover:text-white/60 transition-colors">
                                            {meta.desc}
                                        </span>
                                    </div>

                                    {/* Chevron indicator */}
                                    <svg className={`w-4 h-4 shrink-0 ${meta.color} opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </a>
                            );
                        })}
                    </div>

                    {/* Decorative stat pills */}
                    <div className={`mt-6 mx-1 grid grid-cols-3 gap-2 transition-all duration-700 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={{ transitionDelay: '560ms' }}>
                        {[
                            { label: 'Destinasi', value: `${stats?.total_destinasi || 0}${stats?.total_destinasi > 5 ? '+' : ''}`, icon: '🌿' },
                            { label: 'Wisatawan', value: `${(stats?.total_review || 0).toLocaleString()}${stats?.total_review > 10 ? '+' : ''}`, icon: '👥' },
                            { label: 'Rating', value: `${stats?.avg_rating || 0}★`, icon: '⭐' },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center py-3 px-2 rounded-xl bg-white/[0.04] border border-white/5">
                                <span className="text-base mb-1">{stat.icon}</span>
                                <span className="font-black text-sm text-white leading-none">{stat.value}</span>
                                <span className="text-[9px] text-white/40 mt-0.5 font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BOTTOM CTA BUTTONS ── */}
                <div
                    className={`relative z-10 px-5 pt-4 pb-8 transition-all duration-700 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    style={{ transitionDelay: '500ms' }}
                >
                    {/* Separator with glow */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                    {/* Login button */}
                    <Link
                        href={route('login')}
                        className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-bold text-sm text-white border border-white/15 bg-white/[0.05] hover:bg-white/[0.10] hover:border-white/25 transition-all duration-300 mb-3 overflow-hidden"
                        onClick={() => setMenuOpen(false)}
                    >
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Masuk ke Akun
                    </Link>

                    {/* Register button - premium gradient */}
                    <Link
                        href={route('register')}
                        className="group relative flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-black text-sm text-emerald-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-size-200 hover:bg-pos-100 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-400/50 active:scale-[0.98] transition-all duration-400 overflow-hidden"
                        onClick={() => setMenuOpen(false)}
                    >
                        {/* Shimmer animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <svg className="relative w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                        <span className="relative">Daftar Sekarang — Gratis!</span>
                    </Link>

                    {/* Fine print */}
                    <p className="text-center text-[10px] text-white/25 mt-3 font-medium">
                        🔒 Aman & terenkripsi &nbsp;·&nbsp; Tanpa biaya tersembunyi
                    </p>
                </div>
            </div>

            {/* ── HERO SECTION ── */}
            <section
                id="beranda"
                className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-32 pb-28 overflow-hidden bg-emerald-950"
            >
                {/* Background image & gradient overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-100 select-none scale-105"
                    style={{
                        backgroundImage: "linear-gradient(180deg, rgba(2, 44, 34, 0.92) 0%, rgba(2, 44, 34, 0.65) 40%, rgba(2, 44, 34, 0.90) 80%, rgba(2, 44, 34, 1) 100%), url('/images/download.jpg')",
                        transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px) scale(1.1)`,
                    }}
                />

                {/* Animated soft glowing color blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center justify-center text-center">

                    {/* Hero Text Content */}
                    <div className="flex flex-col items-center space-y-7">
                        <div
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-950/45 backdrop-blur-md animate-fade-in-up opacity-0 shadow-lg"
                            style={{ animationDelay: '100ms' }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                            <span className="text-emerald-300 text-xs font-extrabold tracking-widest uppercase flex items-center gap-1">
                                ✦ ECO-PARADISE INDONESIA
                            </span>
                        </div>

                        <h1
                            className="text-5xl md:text-7xl font-bold leading-[1.1] text-white animate-fade-in-up opacity-0"
                            style={{ animationDelay: '250ms' }}
                        >
                            Jelajahi Serpihan
                            <span className="block font-playfair italic font-medium bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 text-transparent bg-clip-text mt-5 mb-3 px-4 -mx-4 py-2 -my-2">
                                Surga Tersembunyi
                            </span>
                            di Pronojiwo Lumajang
                        </h1>

                        <p
                            className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl font-light animate-fade-in-up opacity-0"
                            style={{ animationDelay: '400ms' }}
                        >
                            Rasakan petualangan mistis di jantung Lumajang. Dari canyon air terjun Tumpak Sewu yang kolosal hingga udara pinus yang menenangkan jiwa.
                        </p>

                        <div
                            className="flex flex-wrap justify-center gap-5 pt-6 animate-fade-in-up opacity-0"
                            style={{ animationDelay: '550ms' }}
                        >
                            <a
                                href="#destinasi"
                                className="group px-8 py-4 rounded-full font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2.5"
                            >
                                Mulai Menjelajah
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                                </svg>
                            </a>
                            <a
                                href="#tiket"
                                className="group px-8 py-4 rounded-full font-bold text-base text-white border-2 border-white/30 hover:border-white/100 hover:bg-white/5 transition-all duration-300 flex items-center gap-2.5"
                            >
                                <svg className="w-5 h-5 text-emerald-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12a1.5 1.5 0 011.5 1.5V17a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 013 17V7.5A1.5 1.5 0 014.5 6zM9 9h.008v.008H9V9zm0 3h.008v.008H9V12zm0 3h.008v.008H9V15z"></path>
                                </svg>
                                Pesan E-Tiket
                            </a>
                        </div>
                        </div>
                    </div>

                {/* Smooth downward scroll indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70">
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Gulir ke bawah</span>
                    <div className="w-5 h-9 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2.5 bg-emerald-400 rounded-full animate-scroll"></div>
                    </div>
                </div>
            </section>

            {/* ── STATS / METRICS SECTION ── */}
            <section ref={statsRef} className="relative pt-4 pb-32 bg-emerald-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">

                            {/* Wisata count */}
                            <div className="py-6 md:py-0 md:px-6 space-y-2">
                                <div className="text-5xl font-black text-amber-300 tracking-tight">
                                    {counts.wisata}{counts.wisata > 5 ? '+' : ''}
                                </div>
                                <div className="text-lg font-bold text-white font-playfair italic">Total Destinasi</div>
                                <p className="text-white/60 text-xs max-w-[200px] mx-auto">Kawasan wisata alam terintegrasi dan teregistrasi.</p>
                            </div>

                            {/* Reviews / Visitors count */}
                            <div className="py-6 md:py-0 md:px-6 space-y-2">
                                <div className="text-5xl font-black text-white tracking-tight">
                                    {counts.pengunjung.toLocaleString()}{counts.pengunjung > 10 ? '+' : ''}
                                </div>
                                <div className="text-lg font-bold text-white font-playfair italic">Review Wisatawan</div>
                                <p className="text-white/60 text-xs max-w-[200px] mx-auto">Ulasan nyata bintang 4 keatas oleh pelancong.</p>
                            </div>

                            {/* Avg Rating */}
                            <div className="py-6 md:py-0 md:px-6 space-y-2">
                                <div className="text-5xl font-black text-emerald-400 tracking-tight flex items-center justify-center gap-1">
                                    {counts.rating} <span className="text-amber-400 text-3xl">★</span>
                                </div>
                                <div className="text-lg font-bold text-white font-playfair italic">Rating Kepuasan</div>
                                <p className="text-white/60 text-xs max-w-[200px] mx-auto">Pengalaman petualangan bernilai luar biasa.</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Smooth Wave Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[50px] md:h-[80px] lg:h-[120px]">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C52.16,93.36,103.99,86.29,155.82,73.13,209.68,59.39,265.17,67.6,321.39,56.44Z" className="fill-white"></path>
                    </svg>
                </div>
            </section>

            {/* ── DESTINASI FAVORIT ── */}
            <section id="destinasi" className="relative bg-white py-24 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] tracking-widest uppercase">
                            🏔️ PILIHAN EKSPEDISI TERBAIK
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
                            Jelajahi Katalog <span className="font-playfair italic font-medium text-emerald-700">Destinasi Favorit</span>
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 mx-auto rounded-full"></div>
                        <p className="text-gray-500 text-base md:text-lg">
                            Setiap lekuk Pronojiwo menyimpan keajaiban. Pilih kategori petualangan Anda dan mulailah merancang memori indah.
                        </p>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-sm transition-all duration-300 border ${selectedCategory === cat
                                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-emerald-700/20'
                                    : 'bg-stone-50 text-gray-600 border-gray-100 hover:bg-stone-100 hover:border-gray-200'}`}
                            >
                                {cat === "Semua" ? "Semua Destinasi ✨" : cat}
                            </button>
                        ))}
                    </div>

                    {/* Destinations Cards Grid */}
                    <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                        {filteredDestinations.map((dest) => (
                            <div
                                key={dest.id}
                                className="group bg-stone-50 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-500 flex flex-col justify-between"
                            >
                                {/* Card Media */}
                                <div className="relative h-68 overflow-hidden select-none">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:rotate-1"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent"></div>

                                    {/* Float badges */}
                                    <span className="absolute top-4 left-4 bg-emerald-900/90 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-md">
                                        {dest.category}
                                    </span>
                                    <span className="absolute top-4 right-4 bg-gray-950/60 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                        <span className="text-amber-400">★</span> {dest.rating}
                                    </span>

                                    {/* Float Price tag bottom left */}
                                    <span className="absolute bottom-4 left-4 text-white font-black text-lg bg-emerald-700/80 px-4 py-1.5 rounded-xl shadow-lg backdrop-blur-sm">
                                        {formatPrice(dest.price)}
                                    </span>
                                </div>

                                {/* Content Details */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                                            <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
                                            </svg>
                                            <span>{dest.location}</span>
                                        </div>
                                        <h3 className="font-playfair text-xl font-bold text-gray-950 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-1">
                                            {dest.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                            {dest.description}
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-5 mt-5 flex items-center justify-between">
                                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                            Kuota: <span className="text-emerald-700 font-black">{dest.capacity} / hari</span>
                                        </span>
                                        <button
                                            onClick={() => setSelectedDestDetails(dest)}
                                            className="px-5 py-2.5 rounded-full font-extrabold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-800 hover:text-white transition-all duration-300 border border-emerald-100/50"
                                        >
                                            Detail Destinasi →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── KEUNGGULAN (FIXED INTERFACE CLASH) ── */}
            <section className="bg-stone-50 py-24 px-6 lg:px-8 relative overflow-hidden">

                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] tracking-widest uppercase">
                            ⭐ STANDAR WISATA PREMIUM
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
                            Kenapa Memilih <span className="font-playfair italic font-medium text-emerald-700">Layanan Kami?</span>
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 mx-auto rounded-full"></div>
                        <p className="text-gray-500 text-base">
                            Petualangan sejati lahir dari kenyamanan dan kepastian keselamatan. Kami mengabdi menjaga ekologi Pronojiwo sembari menghidangkan kenyamanan wisata berkelas.
                        </p>
                    </div>

                    {/* Features cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
                        {features.map((item, index) => {
                            // Dapatkan ikon SVG khusus yang minimalis & elegan untuk tiap keunggulan
                            let svgIcon = null;
                            if (index === 0) {
                                svgIcon = (
                                    <svg className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 0-2.4.6-3.2 1.6C7.3 6.3 7 8.5 7 11c0 5 5 10 5 10s5-5 5-10c0-2.5-.3-4.7-1.8-6.4C14.4 3.6 13.2 3 12 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13c1.5-1 2.5-2.5 3-4" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16c-1.5-1-2.5-2.5-3-4" />
                                    </svg>
                                );
                            } else if (index === 1) {
                                svgIcon = (
                                    <svg className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                );
                            } else if (index === 2) {
                                svgIcon = (
                                    <svg className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                );
                            } else if (index === 3) {
                                svgIcon = (
                                    <svg className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                );
                            }

                            return (
                                <div
                                    key={item.title}
                                    className="group bg-white/80 border border-gray-100/60 rounded-[32px] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative backdrop-blur-sm"
                                >
                                    {/* Efek glowing halo dekoratif saat di-hover */}
                                    <div className={`absolute -right-10 -bottom-10 w-28 h-28 bg-gradient-to-br ${item.gradient} opacity-[0.03] rounded-full blur-2xl group-hover:scale-[2.5] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none`} />

                                    {/* Badge Ikon dengan bayangan glow halus */}
                                    <div className="mb-6 relative flex justify-center">
                                        <div className="relative">
                                            {/* Aura bersinar di belakang ikon */}
                                            <div className={`absolute -inset-1 bg-gradient-to-br ${item.gradient} opacity-20 rounded-2xl blur group-hover:opacity-40 transition-opacity duration-500`} />
                                            {/* Container ikon bundar melengkung premium */}
                                            <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.03)] group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-teal-500 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                                                {svgIcon}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="font-extrabold text-xl text-gray-900 mb-3.5 tracking-tight group-hover:text-emerald-700 transition-colors duration-300 font-playfair">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500/95 leading-relaxed font-normal">
                                        {item.desc}
                                    </p>

                                    {/* Aksen garis progres interaktif premium di bagian bawah kartu */}
                                    <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${item.gradient} group-hover:w-full transition-all duration-500`} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Elegant SVG Wave divider bottom to cover clashes with testimonials section */}
                <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
                    <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,88.43,26.85,152.42,44.3,222.21,68.75,321.39,56.44Z" className="fill-emerald-950"></path>
                    </svg>
                </div>
            </section>

            {/* ── TESTIMONIALS SLIDER SECTION ── */}
            <section id="testimoni" className="relative bg-emerald-950 py-24 px-6 lg:px-8 overflow-hidden select-none">
                {/* Visual backdrops */}
                <div className="absolute inset-0 opacity-15">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                </div>

                <div className="relative max-w-4xl mx-auto z-10">

                    {/* Header */}
                    <div className="text-center space-y-4 mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-emerald-300 font-extrabold text-[10px] tracking-widest uppercase">
                            💬 SUARA WISATAWAN
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-relaxed">
                            Kisah Seru <span className="inline-block font-playfair italic font-medium bg-gradient-to-r from-emerald-300 to-amber-200 text-transparent bg-clip-text px-4 -mx-4 py-1 -my-1">Mereka di Pronojiwo</span>
                        </h2>
                        <p className="text-white/60 max-w-xl mx-auto text-sm">
                            Cerita nyata dari para penjelajah pemberani yang telah membasuh penat di bawah gemuruh air terjun Lumajang.
                        </p>
                    </div>

                    {/* Slider Cards Container */}
                    <div className="relative min-h-[360px] md:min-h-[300px]">
                        {activeTestimonials.map((test, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-700 ${index === activeTestimonial
                                    ? "opacity-100 translate-x-0 pointer-events-auto scale-100"
                                    : index < activeTestimonial
                                        ? "opacity-0 -translate-x-12 pointer-events-none scale-95"
                                        : "opacity-0 translate-x-12 pointer-events-none scale-95"
                                    }`}
                            >
                                <div className="bg-white/5 border border-white/15 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl relative">
                                    {/* Quotation mark */}
                                    <div className="absolute -top-7 left-8 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl text-white shadow-xl transform -rotate-6">
                                        “
                                    </div>

                                    {/* Star ratings */}
                                    <div className="flex justify-end gap-1 mb-6">
                                        {[...Array(test.rating)].map((_, i) => (
                                            <span key={i} className="text-amber-400 text-lg animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* Quote Text */}
                                    <p className="text-white/90 text-base md:text-lg leading-relaxed italic mb-8">
                                        "{test.text}"
                                    </p>

                                    {/* Review Author Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-emerald-950 font-black text-sm shadow-lg">
                                            {test.avatar}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-base">{test.name}</div>
                                            <div className="text-emerald-300 text-xs flex items-center gap-1 font-semibold">
                                                <span>🗺️</span> {test.location}
                                            </div>
                                            <span className="text-[10px] text-white/40 block mt-0.5">{test.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bullet Navigation */}
                    <div className="flex justify-center gap-2.5 mt-10">
                        {activeTestimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`h-2.5 rounded-full transition-all duration-500 ${index === activeTestimonial
                                    ? "w-10 bg-gradient-to-r from-emerald-400 to-teal-300 shadow-md"
                                    : "w-2.5 bg-white/20 hover:bg-white/40"
                                    }`}
                                aria-label={`Testimonial slide ${index + 1}`}
                            />
                        ))}
                    </div>

                </div>
            </section>

            {/* ── TICKET / BOOKING SECTION (id="tiket") ── */}
            <section id="tiket" className="relative py-24 bg-stone-50 px-6 lg:px-8 border-b border-gray-100">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center space-y-4 mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] tracking-widest uppercase">
                            🎫 DARING BOOKING PLATFORM
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
                            Pesan E-Tiket <span className="font-playfair italic font-medium text-emerald-700">Digital Anda</span>
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 mx-auto rounded-full"></div>
                        <p className="text-gray-500 text-sm max-w-xl mx-auto">
                            Kalkulasikan langsung biaya liburan Anda. Dapatkan QR Code konfirmasi instan di surel dan ponsel Anda tanpa antre di gerbang masuk.
                        </p>
                    </div>

                    {/* Booking Form Layout */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-2xl relative">

                        {!bookingSuccess ? (
                            <form onSubmit={handleQuickBookingSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Select destination */}
                                    <div className="space-y-2">
                                        <label className="text-gray-700 font-extrabold text-xs uppercase tracking-wider block">Destinasi Wisata</label>
                                        <CustomSelect
                                            value={bookingDestId}
                                            onChange={setBookingDestId}
                                            options={activeDestinations}
                                            placeholder="-- Pilih Destinasi Favorit --"
                                            isDark={false}
                                        />
                                    </div>

                                    {/* Date selection */}
                                    <div className="space-y-2">
                                        <label className="text-gray-700 font-extrabold text-xs uppercase tracking-wider block">Tanggal Kunjungan</label>
                                        <CustomDatePicker
                                            value={bookingDate}
                                            onChange={setBookingDate}
                                            isDark={false}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    {/* Ticket adjuster */}
                                    <div className="space-y-2">
                                        <label className="text-gray-700 font-extrabold text-xs uppercase tracking-wider block">Jumlah Orang / Tiket</label>
                                        <div className="flex items-center bg-stone-50 border border-gray-200 rounded-xl px-3 py-2 max-w-[200px]">
                                            <button
                                                type="button"
                                                onClick={() => setBookingQty(Math.max(1, bookingQty - 1))}
                                                className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="flex-1 text-center text-gray-900 font-black text-sm">{bookingQty}</span>
                                            <button
                                                type="button"
                                                onClick={() => setBookingQty(bookingQty + 1)}
                                                className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Base information on price */}
                                    {selectedBookingDest && (
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800">
                                            💡 Setiap pembelian tiket berkontribusi 5% langsung ke program konservasi dan penanaman pohon lokal Pronojiwo.
                                        </div>
                                    )}
                                </div>

                                {/* Detailed price calculator breakdown card */}
                                {selectedBookingDest ? (
                                    <div className="bg-stone-50 border border-gray-200 rounded-2xl p-6 space-y-3 text-xs md:text-sm">
                                        <h4 className="font-bold text-gray-950 border-b border-gray-200 pb-2 mb-2">Rincian Pembelian Tiket</h4>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tiket Kunjungan ({selectedBookingDest.name}):</span>
                                            <span className="font-semibold text-gray-800">{formatPrice(selectedBookingDest.price)} x {bookingQty}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Biaya Layanan Daring (5%):</span>
                                            <span className="font-semibold text-gray-800">{formatPrice(bookingTax)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-base text-emerald-800">
                                            <span>Total yang harus dibayar:</span>
                                            <span className="text-xl text-gray-950 font-black">{formatPrice(bookingTotal)}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
                                        Isi form pemesanan diatas untuk melihat kalkulasi biaya digital tiket.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:scale-102 transition-all duration-300"
                                >
                                    Pesan E-Tiket Sekarang
                                </button>
                            </form>
                        ) : (
                            /* Success check out state */
                            <div className="text-center py-8 space-y-6 max-w-md mx-auto">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-4xl text-emerald-600 shadow-inner">
                                    ✓
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-playfair text-3xl font-black text-gray-950">Transaksi Berhasil!</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        E-Tiket digital Anda telah diterbitkan. Simpan QR code di bawah ini untuk ditukarkan di gerbang masuk wisata.
                                    </p>
                                </div>

                                {/* Ticket card print layout */}
                                <div className="print-ticket-card bg-white border-2 border-emerald-600 rounded-3xl p-6 shadow-3xl text-left relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-600 to-teal-500"></div>

                                    <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                                        <div>
                                            <h4 className="font-extrabold text-xs text-emerald-800 tracking-wider">E-PRONOJIWO NATURE ESCAPE</h4>
                                            <h5 className="font-black text-base text-gray-950 leading-tight mt-0.5">{createdTicket?.destination}</h5>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-gray-400 block font-bold uppercase">CODE</span>
                                            <span className="font-black text-sm text-amber-600">{createdTicket?.code}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs mb-5">
                                        <div>
                                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Tanggal</span>
                                            <span className="font-black text-gray-800">{createdTicket?.date}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Jumlah Orang</span>
                                            <span className="font-black text-gray-800">{createdTicket?.quantity} Tiket</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Rute Masuk</span>
                                            <span className="font-black text-gray-600 truncate block max-w-[130px]">{createdTicket?.location}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Pembayaran</span>
                                            <span className="font-black text-emerald-800 text-sm">{formatPrice(createdTicket?.total)}</span>
                                        </div>
                                    </div>

                                    {/* QR section with dashed border separation */}
                                    <div className="border-t-2 border-dashed border-gray-100 pt-4 flex items-center justify-between">
                                        <div>
                                            <span className="text-[9px] text-gray-400 block">STATUS</span>
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 uppercase tracking-widest border border-emerald-100">
                                                Lunas / Aktif
                                            </span>
                                        </div>

                                        {/* Dynamic mockup barcode styling */}
                                        <div className="w-16 h-16 bg-stone-100 rounded-xl p-1.5 flex items-center justify-center border border-gray-200">
                                            <div className="grid grid-cols-5 gap-0.5 w-full h-full opacity-80">
                                                {[...Array(25)].map((_, i) => (
                                                    <div key={i} className={`rounded-xs ${i % 2 === 0 || i % 4 === 1 ? 'bg-gray-900' : 'bg-transparent'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => {
                                            const ticket = document.querySelector('#tiket .print-ticket-card');
                                            if (ticket) ticket.classList.add('printing-now');
                                            window.print();
                                            if (ticket) {
                                                setTimeout(() => {
                                                    ticket.classList.remove('printing-now');
                                                }, 1000);
                                            }
                                        }}
                                        className="px-6 py-2.5 rounded-full bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
                                    >
                                        🖨️ Cetak Tiket
                                    </button>
                                    <button
                                        onClick={resetBookingForm}
                                        className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-stone-50 font-bold text-xs transition-colors"
                                    >
                                        Pesan Tiket Lain
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── CTA / KONTAK SECTION ── */}
            <section id="kontak" className="relative py-24 bg-white px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Grid Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Info details */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[10px] tracking-widest uppercase">
                                📞 PUSAT BANTUAN TURIS
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight text-gray-950 font-playfair">
                                Siap Berpetualang <span className="italic font-medium text-emerald-700">Bersama Kami?</span>
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Punya kendala rute, butuh akomodasi homestay, atau ingin merancang trip rombongan/corporate? Tim customer support lokal kami siap melayani Anda 24/7.
                            </p>

                            <div className="space-y-4 pt-4">
                                {[
                                    { icon: "📍", title: "Kantor Informasi Wisata", text: "Kecamatan Pronojiwo, Lumajang, Jawa Timur, Indonesia" },
                                    { icon: "📞", title: "Hotline Layanan Turis", text: "+62 812-3456-7890 (WA / Telp)" },
                                    { icon: "✉️", title: "Surel Korespondensi", text: "hello@pronojiwonature.id" }
                                ].map(c => (
                                    <div key={c.text} className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-gray-100 hover:border-emerald-100 transition-colors duration-300">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-lg flex-shrink-0">
                                            {c.icon}
                                        </div>
                                        <div>
                                            <span className="block font-bold text-[10px] uppercase text-gray-400">{c.title}</span>
                                            <span className="font-semibold text-xs text-gray-800 mt-0.5 block">{c.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive contact forms */}
                        <div className="lg:col-span-7 bg-stone-50 border border-gray-200/50 rounded-3xl p-6 md:p-8 shadow-xl">
                            <h3 className="font-playfair text-xl font-bold text-gray-950 mb-1">Kirim Pesan Instan</h3>
                            <p className="text-xs text-gray-400 mb-6">Ajukan pertanyaan Anda secara tertulis dan cepat.</p>

                            {contactSuccess && (
                                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fade-in flex items-center gap-2">
                                    <span className="text-sm">✓</span>
                                    <span>Pesan instan Anda berhasil dikirim! Tim admin kami akan segera merespon via email.</span>
                                </div>
                            )}

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setContactLoading(true);
                                router.post('/kontak', {
                                    nama_lengkap: contactNama,
                                    email: contactEmail,
                                    subjek: contactSubjek,
                                    pesan: contactPesan,
                                }, {
                                    onSuccess: () => {
                                        setContactNama("");
                                        setContactEmail("");
                                        setContactSubjek("");
                                        setContactPesan("");
                                        setContactLoading(false);
                                        setContactSuccess(true);
                                        setTimeout(() => setContactSuccess(false), 6000);
                                    },
                                    onError: () => {
                                        setContactLoading(false);
                                    }
                                });
                            }} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={contactNama}
                                            onChange={(e) => setContactNama(e.target.value)}
                                            placeholder="cth: Ahmad Dani"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600 transition-all duration-300"
                                            required
                                            disabled={contactLoading}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500">Alamat Surel</label>
                                        <input
                                            type="email"
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            placeholder="cth: dani@email.com"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600 transition-all duration-300"
                                            required
                                            disabled={contactLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Subjek Pertanyaan</label>
                                    <input
                                        type="text"
                                        value={contactSubjek}
                                        onChange={(e) => setContactSubjek(e.target.value)}
                                        placeholder="cth: Sewa Guide lokal / Reservasi Homestay"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600 transition-all duration-300"
                                        required
                                        disabled={contactLoading}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Isi Pesan Detail</label>
                                    <textarea
                                        rows="4"
                                        value={contactPesan}
                                        onChange={(e) => setContactPesan(e.target.value)}
                                        placeholder="Tuliskan detail pertanyaan atau keluhan Anda di sini..."
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600 transition-all duration-300 resize-none"
                                        required
                                        disabled={contactLoading}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={contactLoading}
                                    className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {contactLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Mengirim...
                                        </>
                                    ) : "Kirim Pesan Sekarang"}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── FOOTER OVERHAUL ── */}
            <footer className="bg-gradient-to-br from-emerald-950 via-gray-950 to-emerald-950 text-white/70 pt-20 pb-8 px-6 lg:px-8 border-t border-white/5 relative z-10">

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">

                        {/* Column 1: Brand & Logo */}
                        <div className="md:col-span-5 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-xl">
                                    WAP
                                </div>
                                <div className="leading-tight">
                                    <span className="block font-black text-[9px] text-emerald-400 tracking-wider">WISATA ALAM</span>
                                    <span className="block font-playfair font-black text-lg text-white">PRONOJIWO</span>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed max-w-sm font-light">
                                Pronojiwo Nature Escape adalah media resmi reservasi & pariwisata terpadu kawasan Kecamatan Pronojiwo, Lumajang. Hub penghubung keindahan alam dan kearifan lokal.
                            </p>

                            {/* Social Media Link Icons */}
                            <div className="flex gap-2.5 pt-2">
                                {[
                                    { icon: "📘", label: "Facebook" },
                                    { icon: "📸", label: "Instagram" },
                                    { icon: "🐦", label: "Twitter" },
                                    { icon: "📺", label: "YouTube" }
                                ].map((soc, idx) => (
                                    <button
                                        key={idx}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-gradient-to-br hover:from-emerald-600 hover:to-teal-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                                        title={soc.label}
                                    >
                                        <span className="text-sm select-none">{soc.icon}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Navigation Links */}
                        <div className="md:col-span-3 space-y-5">
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Jelajah Pintar</h4>
                            <div className="flex flex-col gap-3.5 text-sm font-semibold">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={`#${link.id}`}
                                        className="hover:text-emerald-400 transition-colors duration-300 w-fit"
                                    >
                                        → {link.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Column 3: Contact & Newsletter */}
                        <div className="md:col-span-4 space-y-5">
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Info Buletin</h4>
                            <p className="text-xs text-white/50 leading-relaxed font-light">
                                Dapatkan info promo musiman, festival seni budaya, dan update pembukaan jalur trekking Pronojiwo gratis.
                            </p>

                            {/* Newsletter form inputs */}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                alert("Terima kasih! Anda telah berlangganan info pariwisata Pronojiwo.");
                                e.target.reset();
                            }} className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="Alamat surel Anda"
                                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-white/35 focus:outline-none focus:border-emerald-500 flex-1 transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-colors duration-300 shadow-md"
                                >
                                    Gabung
                                </button>
                            </form>
                        </div>

                    </div>

                    {/* Footer bottom */}
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-white/40">
                        <p>© 2026 Wisata Alam Pronojiwo. Hak cipta dilindungi undang-undang.</p>
                        <p className="flex items-center gap-1.5">
                            Terbuat dengan <span className="text-red-500 animate-pulse text-sm">♥</span> untuk pariwisata lestari Lumajang, Jawa Timur.
                        </p>
                    </div>

                </div>
            </footer>

            {/* ── DESTINASI FAVORIT DETAIL MODAL WINDOW ── */}
            {selectedDestDetails && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in">
                    <div className="bg-white border border-gray-100 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-scale-up">

                        {/* Close button float */}
                        <button
                            onClick={() => setSelectedDestDetails(null)}
                            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-950/40 hover:bg-gray-950/80 text-white flex items-center justify-center transition-colors duration-300 shadow-lg"
                        >
                            ✕
                        </button>

                        {/* Modal Cover Image */}
                        <div className="h-64 md:h-76 relative select-none">
                            <img
                                src={selectedDestDetails.image}
                                alt={selectedDestDetails.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent"></div>

                            <div className="absolute bottom-4 left-6 space-y-1">
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    {selectedDestDetails.category}
                                </span>
                                <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                                    {selectedDestDetails.name}
                                </h3>
                            </div>
                        </div>

                        {/* Modal Body contents */}
                        <div className="p-6 md:p-8 space-y-6 max-h-[50vh] overflow-y-auto">

                            {/* Short specifications row */}
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-4 text-center">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Harga Masuk</span>
                                    <span className="font-black text-sm text-emerald-800">{formatPrice(selectedDestDetails.price)}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Koordinat GPS</span>
                                    <span className="font-bold text-gray-600 text-xs truncate block">{selectedDestDetails.coordinates}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Rating Turis</span>
                                    <span className="font-black text-sm text-amber-500">★ {selectedDestDetails.rating}</span>
                                </div>
                            </div>

                            {/* Description paragraph */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Deskripsi Destinasi</h4>
                                <p className="text-gray-600 text-sm leading-relaxed text-justify">
                                    {selectedDestDetails.description}
                                </p>
                            </div>

                            {/* Facilities pills row */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Fasilitas Tersedia</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDestDetails.facilities.map((fac, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 rounded-xl bg-stone-50 border border-gray-100 text-xs font-semibold text-gray-600 flex items-center gap-1"
                                        >
                                            🏕️ {fac}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal footer call to actions */}
                        <div className="bg-stone-50 border-t border-gray-100 p-6 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedDestDetails(null)}
                                className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={() => handleDirectBook(selectedDestDetails)}
                                className="px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-102 transition-all duration-300"
                            >
                                Pesan E-Tiket Sekarang
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ── CUSTOM CORE ANIMATIONS ── */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleUp {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes scroll {
                    0% { transform: translateY(0); opacity: 0; }
                    30% { opacity: 1; }
                    100% { transform: translateY(14px); opacity: 0; }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                .animate-fade-in {
                    animation: fadeIn 0.4s ease both;
                }

                .animate-scale-up {
                    animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                .animate-scroll {
                    animation: scroll 2.2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
                }

                /* Custom elegant thin scrollbar styling */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.4);
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.7);
                }

                .h-0.75 {
                    height: 3px;
                }
                .h-13 {
                    height: 52px;
                }
                .w-13 {
                    width: 52px;
                }
                .h-22 {
                    height: 88px;
                }
                .h-68 {
                    height: 272px;
                }
                .h-76 {
                    height: 304px;
                }
                .p-6.5 {
                    padding: 26px;
                }
                .left-1\/10 {
                    left: 10%;
                }
                .right-1\/10 {
                    right: 10%;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            
                 @media print {
                     /* Sesuaikan ukuran kertas print tepat dengan ukuran kartu tiket (600px x 380px) */
                     @page {
                         size: 600px 380px;
                         margin: 0;
                     }
                     /* Kunci tinggi html dan body ke 100% viewport cetak dan sembunyikan overflow */
                     html, body {
                         height: 380px !important;
                         max-height: 380px !important;
                         overflow: hidden !important;
                         margin: 0 !important;
                         padding: 0 !important;
                         background: #ffffff !important;
                     }
                     /* Sembunyikan semua elemen di halaman */
                     body * {
                         visibility: hidden !important;
                     }
                     /* Tampilkan HANYA kartu tiket yang sedang aktif dicetak */
                     .print-ticket-card.printing-now, 
                     .print-ticket-card.printing-now * {
                         visibility: visible !important;
                     }
                     /* Atur agar tiket memenuhi ukuran kertas cetak secara sempurna tanpa margin/border meluap */
                     .print-ticket-card.printing-now {
                         position: fixed !important;
                         left: 0 !important;
                         top: 0 !important;
                         width: 600px !important;
                         height: 380px !important;
                         max-width: 600px !important;
                         max-height: 380px !important;
                         margin: 0 !important;
                         padding: 24px !important;
                         border: none !important;
                         box-shadow: none !important;
                         background: white !important;
                         color: #111827 !important;
                         transform: none !important;
                         border-radius: 0 !important;
                         z-index: 9999999 !important;
                     }
                 }
             `}</style>
        </div>
    );
}