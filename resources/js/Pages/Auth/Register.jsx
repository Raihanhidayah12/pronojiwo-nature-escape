import { useState, useMemo } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

function PasswordStrength({ password }) {
    const strength = useMemo(() => {
        if (!password) return 0;
        let s = 0;
        if (password.length >= 8) s++;
        if (/[A-Z]/.test(password)) s++;
        if (/[0-9]/.test(password)) s++;
        if (/[^A-Za-z0-9]/.test(password)) s++;
        return s;
    }, [password]);

    const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
    const colors = ['', '#f87171', '#fbbf24', '#34d399', '#10b981'];

    if (!password) return null;
    return (
        <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 99,
                        background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease'
                    }} />
                ))}
            </div>
            <p style={{ fontSize: 11, color: colors[strength], fontWeight: 600, margin: 0 }}>{labels[strength]}</p>
        </div>
    );
}

const EyeIcon = ({ open }) => open
    ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Field names disesuaikan dengan kolom tabel users
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap: '',
        email: '',
        no_telepon: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", background: '#021a10' }}>
            <Head title="Daftar — Pronojiwo Nature Escape" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                .fp { font-family: 'Playfair Display', serif; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes blobPulse { 0%,100% { opacity: 0.15; } 50% { opacity: 0.28; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .a1 { animation: fadeUp 0.55s 0.00s ease forwards; opacity: 0; }
                .a2 { animation: fadeUp 0.55s 0.07s ease forwards; opacity: 0; }
                .a3 { animation: fadeUp 0.55s 0.14s ease forwards; opacity: 0; }
                .a4 { animation: fadeUp 0.55s 0.21s ease forwards; opacity: 0; }
                .a5 { animation: fadeUp 0.55s 0.28s ease forwards; opacity: 0; }
                .a6 { animation: fadeUp 0.55s 0.35s ease forwards; opacity: 0; }
                .a7 { animation: fadeUp 0.55s 0.42s ease forwards; opacity: 0; }
                .a8 { animation: fadeUp 0.55s 0.49s ease forwards; opacity: 0; }
                .float-badge { animation: floatY 6s ease-in-out infinite; }
                .blob { animation: blobPulse 9s ease-in-out infinite; border-radius: 50%; position: absolute; pointer-events: none; }

                .inp {
                    width: 100%; padding: 13px 16px;
                    background: rgba(255,255,255,0.06);
                    border: 1.5px solid rgba(255,255,255,0.12);
                    border-radius: 14px; color: white; font-size: 14px;
                    outline: none; transition: all 0.25s ease;
                }
                .inp:focus {
                    border-color: #34d399;
                    background: rgba(52,211,153,0.07);
                    box-shadow: 0 0 0 3px rgba(52,211,153,0.12);
                }
                .inp::placeholder { color: rgba(255,255,255,0.28); }
                .inp-icon-l { padding-left: 42px; }
                .inp-icon-r { padding-right: 48px; }

                .lbl {
                    display: block;
                    color: rgba(255,255,255,0.65);
                    font-size: 11px; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.12em;
                    margin-bottom: 7px;
                }
                .icon-l {
                    position: absolute; left: 14px; top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.3); pointer-events: none;
                    display: flex; align-items: center;
                }
                .icon-r {
                    position: absolute; right: 14px; top: 50%;
                    transform: translateY(-50%);
                    background: none; border: none; cursor: pointer;
                    color: rgba(255,255,255,0.35); padding: 0; display: flex;
                }
                .err { color: #f87171; font-size: 12px; margin-top: 5px; }

                .btn-main {
                    width: 100%; padding: 15px; border-radius: 14px;
                    font-weight: 700; font-size: 15px; color: white;
                    border: none; cursor: pointer; letter-spacing: 0.3px;
                    background: linear-gradient(135deg, #059669, #0d9488);
                    box-shadow: 0 8px 24px rgba(5,150,105,0.35);
                    transition: all 0.3s ease;
                }
                .btn-main:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 36px rgba(5,150,105,0.5);
                    background: linear-gradient(135deg, #10b981, #14b8a6);
                }
                .btn-main:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

                .btn-outline {
                    display: block; width: 100%; padding: 13px;
                    border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 600;
                    text-decoration: none; text-align: center;
                    transition: all 0.25s ease; background: none;
                }
                .btn-outline:hover {
                    border-color: rgba(52,211,153,0.35);
                    color: #34d399;
                }

                .benefit-row {
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px; padding: 10px 14px;
                }

                /* Scrollable right panel on small screens */
                .right-panel { overflow-y: auto; }
                @media (max-width: 1023px) { .left-panel { display: none !important; } }
            `}</style>

            {/* ── LEFT PANEL ── */}
            <div className="left-panel" style={{ width: '44%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48, overflow: 'hidden' }}>
                {/* Bg photo */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/download.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(2,44,34,0.88) 0%, rgba(2,18,12,0.95) 100%)' }} />

                {/* Glows */}
                <div className="blob" style={{ top: 40, right: 40, width: 280, height: 280, background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)' }} />
                <div className="blob" style={{ bottom: 80, left: 20, width: 220, height: 220, background: 'radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 70%)', animationDelay: '4s' }} />

                {/* Logo + Back button */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#059669,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 13, boxShadow: '0 8px 24px rgba(5,150,105,0.4)' }}>WAP</div>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#34d399', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Wisata Alam</div>
                            <div className="fp" style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>Pronojiwo</div>
                        </div>
                    </div>
                    <button
                        onClick={() => smoothNavigate(route('home'))}
                        style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:50, padding:'7px 14px', color:'rgba(255,255,255,.7)', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .25s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.14)'; e.currentTarget.style.color='white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,.08)'; e.currentTarget.style.color='rgba(255,255,255,.7)'; }}
                    >
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                        Beranda
                    </button>
                </div>

                {/* Main copy */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="float-badge" style={{ display: 'inline-block', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.22)', borderRadius: 100, padding: '6px 14px', fontSize: 11, color: '#6ee7b7', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
                        ✦ Bergabung Sekarang
                    </div>
                    <h2 className="fp" style={{ fontSize: 38, color: 'white', lineHeight: 1.22, marginBottom: 14 }}>
                        Mulai Petualangan<br />
                        <span style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#6ee7b7,#a5f3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Alam Liar-mu
                        </span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 320 }}>
                        Daftar gratis dan nikmati kemudahan memesan tiket, melacak riwayat wisata, dan mendapatkan rekomendasi terbaik.
                    </p>

                    {/* Benefits */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { icon: '🎟️', text: 'E-Tiket instan & tanpa antri' },
                            { icon: '🗺️', text: 'Rute & panduan wisata eksklusif' },
                            { icon: '⭐', text: 'Ulasan & rekomendasi terpersonalisasi' },
                            { icon: '🛡️', text: 'Data & transaksi aman terenkripsi' },
                        ].map((b, i) => (
                            <div key={i} className="benefit-row">
                                <span style={{ fontSize: 18 }}>{b.icon}</span>
                                <span style={{ color: 'rgba(255,255,255,0.68)', fontSize: 13, fontWeight: 500 }}>{b.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer quote */}
                <div style={{ position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontStyle: 'italic' }}>"Surga tersembunyi Lumajang menunggumu."</p>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="right-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative' }}>
                {/* Bg glows */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(20,184,166,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ width: '100%', maxWidth: 460 }}>

                    {/* Mobile logo */}
                    <div className="a1" style={{ display: 'none', alignItems: 'center', gap: 12, marginBottom: 32 }} id="mobile-logo">
                        <style>{`@media(max-width:1023px){#mobile-logo{display:flex!important}}`}</style>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#059669,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 12 }}>WAP</div>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#34d399', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Wisata Alam</div>
                            <div className="fp" style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>Pronojiwo</div>
                        </div>
                    </div>

                    {/* Mobile back + logo */}
                    <div className="a1" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }} id="reg-mobile-top">
                        <style>{`@media(max-width:1023px){#reg-mobile-top{display:flex!important}}`}</style>
                        <div style={{ display:'none' }} id="reg-mobile-top">
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#059669,#0d9488)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'white', fontSize:11 }}>WAP</div>
                                <div className="fp" style={{ fontSize:17, fontWeight:700, color:'white' }}>Pronojiwo</div>
                            </div>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="a1" style={{ marginBottom: 28 }}>
                        <h1 className="fp" style={{ fontSize: 30, fontWeight: 700, color: 'white', marginBottom: 6 }}>Buat Akun Gratis</h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                            Sudah punya akun?{' '}
                            <Link href={route('login')} style={{ color:'#34d399', fontWeight:700, fontSize:14, textDecoration:'none' }}>Masuk di sini →</Link>
                        </p>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                        {/* ── Nama Lengkap ── */}
                        <div className="a2">
                            <label className="lbl">Nama Lengkap</label>
                            <div style={{ position: 'relative' }}>
                                <span className="icon-l">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                <input
                                    id="nama_lengkap"
                                    type="text"
                                    name="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={e => setData('nama_lengkap', e.target.value)}
                                    autoComplete="name"
                                    autoFocus
                                    placeholder="Nama lengkap Anda"
                                    className="inp inp-icon-l"
                                    required
                                />
                            </div>
                            {errors.nama_lengkap && <p className="err">{errors.nama_lengkap}</p>}
                        </div>

                        {/* ── Email ── */}
                        <div className="a3">
                            <label className="lbl">Alamat Email</label>
                            <div style={{ position: 'relative' }}>
                                <span className="icon-l">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username"
                                    placeholder="nama@email.com"
                                    className="inp inp-icon-l"
                                    required
                                />
                            </div>
                            {errors.email && <p className="err">{errors.email}</p>}
                        </div>

                        {/* ── No. Telepon ── */}
                        <div className="a4">
                            <label className="lbl">No. Telepon <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opsional)</span></label>
                            <div style={{ position: 'relative' }}>
                                <span className="icon-l">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </span>
                                <input
                                    id="no_telepon"
                                    type="tel"
                                    name="no_telepon"
                                    value={data.no_telepon}
                                    onChange={e => setData('no_telepon', e.target.value)}
                                    autoComplete="tel"
                                    placeholder="08xxxxxxxxxx"
                                    className="inp inp-icon-l"
                                />
                            </div>
                            {errors.no_telepon && <p className="err">{errors.no_telepon}</p>}
                        </div>

                        {/* ── Password ── */}
                        <div className="a5">
                            <label className="lbl">Password</label>
                            <div style={{ position: 'relative' }}>
                                <span className="icon-l">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Min. 8 karakter"
                                    className="inp inp-icon-l inp-icon-r"
                                    required
                                />
                                <button type="button" className="icon-r" onClick={() => setShowPassword(v => !v)}>
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                            <PasswordStrength password={data.password} />
                            {errors.password && <p className="err">{errors.password}</p>}
                        </div>

                        {/* ── Konfirmasi Password ── */}
                        <div className="a6">
                            <label className="lbl">Konfirmasi Password</label>
                            <div style={{ position: 'relative' }}>
                                <span className="icon-l">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </span>
                                <input
                                    id="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Ulangi password Anda"
                                    className="inp inp-icon-l inp-icon-r"
                                    required
                                />
                                <button type="button" className="icon-r" onClick={() => setShowConfirm(v => !v)}>
                                    <EyeIcon open={showConfirm} />
                                </button>
                            </div>
                            {data.password_confirmation && data.password !== data.password_confirmation && (
                                <p className="err">Password tidak cocok</p>
                            )}
                            {errors.password_confirmation && <p className="err">{errors.password_confirmation}</p>}
                        </div>

                        {/* Role info badge */}
                        <div className="a7" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.14)', borderRadius: 12, padding: '10px 14px' }}>
                            <span style={{ fontSize: 18 }}>🌿</span>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.5 }}>
                                Akun akan terdaftar sebagai{' '}
                                <span style={{ color: '#34d399', fontWeight: 700 }}>Pengunjung</span>
                                {' '}— dapat memesan tiket dan menulis ulasan destinasi.
                            </p>
                        </div>

                        {/* Submit */}
                        <div className="a7">
                            <button type="submit" disabled={processing} className="btn-main">
                                {processing ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        <svg width="16" height="16" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        Membuat Akun...
                                    </span>
                                ) : 'Buat Akun Sekarang →'}
                            </button>
                        </div>

                        {/* Login link */}
                        <div className="a8">
                            <Link href={route('login')} className="btn-outline">
                                Sudah punya akun? Masuk
                            </Link>
                        </div>
                    </form>

                    <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, textAlign: 'center', marginTop: 28 }}>
                        © 2025 Pronojiwo Nature Escape · Lumajang, Jawa Timur
                    </p>
                </div>
            </div>
        </div>
    );
}
