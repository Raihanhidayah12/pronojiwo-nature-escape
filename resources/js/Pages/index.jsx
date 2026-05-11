import { useState, useEffect, useRef } from "react";

const destinations = [
    {
        id: 1,
        name: "Air Terjun Tumpak Sewu",
        location: "Lumajang, Jawa Timur",
        category: "Air Terjun",
        rating: 4.9,
        image: "./build/assets/sewu.jpg",
    },
    {
        id: 2,
        name: "Panorama Kapas Biru",
        location: "Pronojiwo, Lumajang",
        category: "Panorama",
        rating: 4.7,
        image: "./build/assets/panoramakapasbiru.jpg",
    },
    {
        id: 3,
        name: "Kapas Biru",
        location: "Lumajang, Jawa Timur",
        category: "Air Terjun",
        rating: 4.6,
        image: "./build/assets/kapasbiru.jpg",
    },
    {
        id: 4,
        name: "Kabut Pelangi",
        location: "Lumajang, Jawa Timur",
        category: "Air Terjun",
        rating: 4.8,
        image: "./build/assets/kabutpelangi.jpg",
    },
];

const testimonials = [
    {
        name: "Andi Pratama",
        location: "Surabaya",
        rating: 5,
        text: "Pengalaman luar biasa! Air terjun Tumpak Sewu benar-benar memukau. Pemandu wisata sangat profesional dan ramah.",
        avatar: "AP",
    },
    {
        name: "Sari Dewi",
        location: "Malang",
        rating: 5,
        text: "Pronojiwo adalah surga tersembunyi! Alam yang masih asri dan udara yang segar membuat saya ingin kembali lagi.",
        avatar: "SD",
    },
    {
        name: "Budi Santoso",
        location: "Jakarta",
        rating: 4,
        text: "Destinasi yang wajib dikunjungi! Pemandangan bukit dan hutan pinus sangat indah. Pelayanan sangat memuaskan.",
        avatar: "BS",
    },
];

const navLinks = ["Beranda", "Destinasi", "Tiket", "Testimoni", "Kontak"];

const features = [
    { icon: "🌿", title: "Alam Asli", desc: "Kawasan wisata terjaga keaslian dan kelestariannya" },
    { icon: "🗺️", title: "Pemandu Lokal", desc: "Dipandu oleh warga lokal yang berpengalaman dan ramah" },
    { icon: "🎟️", title: "Tiket Terjangkau", desc: "Harga tiket masuk yang sangat terjangkau untuk semua kalangan" },
    { icon: "🔒", title: "Aman & Nyaman", desc: "Keamanan dan kenyamanan wisatawan adalah prioritas kami" },
];

export default function WisataAlamPronojiwo() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [visibleStats, setVisibleStats] = useState(false);
    const [counts, setCounts] = useState({ wisata: 0, pengunjung: 0, rating: 0 });
    const statsRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisibleStats(true); },
            { threshold: 0.5 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visibleStats) return;
        const steps = 60;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const ease = 1 - Math.pow(1 - step / steps, 3);
            setCounts({
                wisata: Math.floor(ease * 10),
                pengunjung: Math.floor(ease * 1200),
                rating: parseFloat((ease * 4.8).toFixed(1)),
            });
            if (step >= steps) clearInterval(timer);
        }, 1500 / steps);
        return () => clearInterval(timer);
    }, [visibleStats]);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="font-sans text-gray-900 overflow-x-hidden">

            {/* ── NAVBAR ── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${scrolled ? "bg-white/70 shadow-md" : "bg-white/95"
                }`}>
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                            WAP
                        </div>
                        <div className="leading-tight">
                            <div className="font-black text-xs text-green-700">WISATA ALAM</div>
                            <div className="font-black text-xs text-green-900">PRONOJIWO</div>
                        </div>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="text-sm font-medium text-gray-600 hover:text-green-700 relative group transition-colors duration-200"
                            >
                                {link}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                        {/* Register */}
                        <div className=" md:flex items-center gap-2">
                            <a href={route('login')} className="ring-1 ring-green-800 hover:bg-green-800 text-gray-600 hover:text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 ">
                                Login
                            </a>
                            <a href={route('register')} className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:shadow-green-200">
                                Daftar
                            </a>
                        </div>
                        {/* <button className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200">
                            Daftar Sekarang!
                        </button> */}
                    </div>



                    {/* Hamburger */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="block py-2.5 text-sm font-medium text-gray-600 border-b border-gray-50 hover:text-green-700 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link}
                            </a>
                        ))}
                        <a href={route('login')}>
                            <button className="mt-4 w-full ring-1 ring-green-700 text-gray-600 hover:text-white font-semibold py-3 rounded-full text-sm hover:bg-green-800 transition-colors">
                                Login
                            </button>
                        </a>
                        <a href={route('register')}>
                            <button className="mt-4 w-full bg-green-700 text-white font-semibold py-3 rounded-full text-sm hover:bg-green-800 transition-colors">
                                Daftar
                            </button>
                        </a>
                    </div>
                )}
            </nav>

            {/* ── HERO ── */}
            <section
                id="beranda"
                className="min-h-screen flex items-center justify-center text-center px-6 pt-28 pb-20 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.55)), url('./build/assets/sewu2.jpg')",
                }}
            >
                <div className="max-w-2xl">
                    <div className="inline-block bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-5 py-1.5 text-white text-xs font-semibold tracking-widest mb-6">
                        Surga Alam Lumajang
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
                        JELAJAHI KEINDAHAN ALAM
                    </h1>
                    <h1 className="text-4xl md:text-5xl font-black text-green-300 italic leading-tight mb-5">
                        PRONOJIWO
                    </h1>
                    <p className="text-white/90 text-base md:text-lg leading-relaxed mb-10">
                        Surga tersembunyi di Lumajang — air terjun, bukit, dan petualangan menunggu
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            Mulai Jelajah
                        </button>
                        <button className="bg-white/15 backdrop-blur-md text-white border-2 border-white/60 hover:bg-white/25 font-semibold px-8 py-3.5 rounded-full text-base transition-all duration-300 hover:-translate-y-1">
                            Pesan Tiket
                        </button>
                    </div>

                    <div className="flex gap-10 justify-center mt-14 flex-wrap">
                        {[
                            { val: "10+", label: "Destinasi" },
                            { val: "1.200+", label: "Pengunjung/Bulan" },
                            { val: "4.8/5", label: "Rating" },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <div className="text-2xl font-black text-green-300">{s.val}</div>
                                <div className="text-xs text-white/70 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DESTINASI FAVORIT ── */}
            <section id="destinasi" className="bg-white py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
                        <div>
                            <p className="text-green-700 font-bold text-xs tracking-widest uppercase mb-2">Pilihan Terbaik</p>
                            <h2 className="text-3xl font-black text-gray-900 mb-1">Destinasi Favorit</h2>
                            <p className="text-gray-500 text-sm">Temukan tempat wisata alam terpopuler di Pronojiwo</p>
                        </div>
                        <a
                            href="#"
                            className="text-green-700 font-semibold text-sm border border-green-700 px-5 py-2 rounded-full hover:bg-green-700 hover:text-white transition-all duration-300"
                        >
                            Lihat Semua →
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {destinations.map((dest) => (
                            <div
                                key={dest.id}
                                className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <span className="absolute top-2.5 left-2.5 bg-green-700 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                                        {dest.category}
                                    </span>
                                    <span className="absolute top-2.5 right-2.5 bg-black/50 text-white text-xs font-semibold px-2 py-0.5 rounded-lg">
                                        ★ {dest.rating}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-sm text-gray-900 mb-1">{dest.name}</h3>
                                    <p className="text-xs text-gray-500 mb-3">📍 {dest.location}</p>
                                    <button className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-full text-sm transition-colors duration-200">
                                        Detail
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section ref={statsRef} className="bg-gradient-to-br from-green-50 to-lime-50 py-16 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { count: counts.wisata + "+", label: "Total Wisata", sub: "Destinasi alam tersedia", icon: "" },
                        { count: counts.pengunjung.toLocaleString() + "+", label: "Pengunjung", sub: "Pengunjung per bulan", icon: "" },
                        { count: counts.rating + "/5", label: "Rating", sub: "Berdasarkan ulasan", icon: "" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-green-100 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="text-4xl mb-3">{stat.icon}</div>
                            <div className="text-4xl font-black text-green-700 mb-1">{stat.count}</div>
                            <div className="text-base font-bold text-gray-800 mb-1">{stat.label}</div>
                            <div className="text-sm text-gray-500">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── KEUNGGULAN ── */}
            <section className="bg-white py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-green-700 font-bold text-xs tracking-widest uppercase mb-2">Keunggulan Kami</p>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Mengapa Memilih Pronojiwo?</h2>
                    <p className="text-gray-500 text-sm mb-12">
                        Kami hadir untuk memberikan pengalaman wisata alam terbaik dan tak terlupakan
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((item) => (
                            <div
                                key={item.title}
                                className="bg-green-50/60 border border-green-100 rounded-2xl p-7 text-center hover:-translate-y-2 hover:shadow-lg hover:bg-green-50 transition-all duration-300"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="font-bold text-base text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONI ── */}
            <section id="testimoni" className="bg-gradient-to-br from-green-900 to-green-700 py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-green-300 font-bold text-xs tracking-widest uppercase mb-2">Kata Mereka</p>
                    <h2 className="text-3xl font-black text-white mb-12">Testimoni Wisatawan</h2>

                    <div className="relative min-h-52">
                        {testimonials.map((t, i) => (
                            <div
                                key={t.name}
                                className={`absolute inset-0 transition-opacity duration-500 ${i === activeTestimonial ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                    }`}
                            >
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/15">
                                    <div className="text-5xl text-green-300 mb-4 leading-none">"</div>
                                    <p className="text-white/90 text-base leading-relaxed italic mb-6">{t.text}</p>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                            {t.avatar}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-white font-bold text-sm">{t.name}</div>
                                            <div className="text-green-300 text-xs">📍 {t.location}</div>
                                        </div>
                                        <div className="ml-auto text-yellow-400 text-base tracking-tight">
                                            {"★".repeat(t.rating)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-56">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTestimonial(i)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-7 bg-green-300" : "w-2.5 bg-white/30"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA / KONTAK ── */}
            <section id="kontak" className="bg-white py-20 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <p className="text-green-700 font-bold text-xs tracking-widest uppercase mb-2">Hubungi Kami</p>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Siap Berpetualang?</h2>
                    <p className="text-gray-500 text-base leading-relaxed mb-12">
                        Pesan tiket wisata Anda sekarang dan rasakan keindahan alam Pronojiwo yang memukau
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap mb-14">
                        <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-200">
                            🎟️ Pesan Tiket Sekarang
                        </button>
                        <button className="border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all duration-300 hover:-translate-y-1">
                            📞 Hubungi Kami
                        </button>
                    </div>
                    <div className="flex justify-center gap-8 flex-wrap">
                        {[
                            { icon: "📍", text: "Pronojiwo, Lumajang, Jawa Timur" },
                            { icon: "📞", text: "+62 1234 5678" },
                            { icon: "✉️", text: "info@wisatapronojiwo.com" },
                        ].map((c) => (
                            <div key={c.text} className="flex items-center gap-2 text-gray-500 text-sm">
                                <span>{c.icon}</span>
                                <span>{c.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-green-950 text-white/75 pt-14 pb-6 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white font-black text-xs">
                                    WAP
                                </div>
                                <div className="leading-tight">
                                    <div className="font-black text-xs text-green-400">WISATA ALAM</div>
                                    <div className="font-black text-xs text-white">PRONOJIWO</div>
                                </div>
                            </div>
                            <p className="text-xs leading-relaxed text-white/55 max-w-xs mb-5">
                                Pronojiwo Nature Escape — destinasi wisata alam terbaik di Lumajang dengan pemandangan air terjun, bukit, dan hutan yang menakjubkan.
                            </p>
                            <div className="flex gap-2.5">
                                {["📘", "📸", "🐦"].map((icon, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-green-700 flex items-center justify-center text-sm cursor-pointer transition-colors duration-200"
                                    >
                                        {icon}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm mb-4">Navigasi</h4>
                            {navLinks.map((link) => (
                                <a
                                    key={link}
                                    href={`#${link.toLowerCase()}`}
                                    className="block text-white/55 text-sm mb-2.5 hover:text-green-400 transition-colors duration-200"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm mb-4">Kontak</h4>
                            {[
                                { icon: "📍", text: "Pronojiwo, Lumajang, Jawa Timur" },
                                { icon: "📞", text: "+62 1234 5678" },
                                { icon: "✉️", text: "info@wisatapronojiwo.com" },
                                { icon: "🕐", text: "Buka: 07.00 – 17.00 WIB" },
                            ].map((c) => (
                                <div key={c.text} className="flex gap-2 text-white/55 text-sm mb-2.5">
                                    <span>{c.icon}</span>
                                    <span>{c.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-5 flex justify-between items-center flex-wrap gap-3">
                        <p className="text-xs text-white/35">© 2026 Wisata Alam Pronojiwo. All rights reserved.</p>
                        <p className="text-xs text-white/35">📍 Pronojiwo, Lumajang, Jawa Timur</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
