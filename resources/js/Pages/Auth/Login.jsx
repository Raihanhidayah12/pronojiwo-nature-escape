import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    const emailNotFound  = errors.email && errors.email.includes('belum terdaftar');
    const emailRateLimit = errors.email && errors.email.includes('terlalu banyak');
    const passwordWrong  = errors.password && errors.password.includes('salah');

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", background: '#021a10' }}>
            <Head title="Masuk — Pronojiwo Nature Escape" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                .fp { font-family: 'Playfair Display', serif; }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes blobP   { 0%,100%{opacity:.14} 50%{opacity:.26} }
                @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
                @keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }

                .a1{animation:fadeUp .55s .00s ease both;}
                .a2{animation:fadeUp .55s .08s ease both;}
                .a3{animation:fadeUp .55s .16s ease both;}
                .a4{animation:fadeUp .55s .24s ease both;}
                .a5{animation:fadeUp .55s .32s ease both;}
                .a6{animation:fadeUp .55s .40s ease both;}
                .badge-float{animation:floatY 6s ease-in-out infinite;}
                .blob{animation:blobP 9s ease-in-out infinite;border-radius:50%;position:absolute;pointer-events:none;}

                .inp{
                    width:100%;padding:13px 16px;
                    background:rgba(255,255,255,.06);
                    border:1.5px solid rgba(255,255,255,.12);
                    border-radius:14px;color:white;font-size:14px;
                    outline:none;transition:all .25s ease;
                }
                .inp:focus{border-color:#34d399;background:rgba(52,211,153,.07);box-shadow:0 0 0 3px rgba(52,211,153,.12);}
                .inp::placeholder{color:rgba(255,255,255,.28);}
                .inp-err{border-color:#f87171!important;background:rgba(248,113,113,.06)!important;}
                .inp-err:focus{box-shadow:0 0 0 3px rgba(248,113,113,.12)!important;}

                .icon-l{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.3);pointer-events:none;display:flex;align-items:center;}
                .icon-r{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,.35);padding:0;display:flex;}

                .btn-main{
                    width:100%;padding:15px;border-radius:14px;
                    font-weight:700;font-size:15px;color:white;
                    border:none;cursor:pointer;letter-spacing:.3px;
                    background:linear-gradient(135deg,#059669,#0d9488);
                    box-shadow:0 8px 24px rgba(5,150,105,.35);
                    transition:all .3s ease;
                }
                .btn-main:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 36px rgba(5,150,105,.5);background:linear-gradient(135deg,#10b981,#14b8a6);}
                .btn-main:disabled{opacity:.6;cursor:not-allowed;transform:none;}

                .btn-back{
                    display:inline-flex;align-items:center;gap:7px;
                    background:rgba(255,255,255,.08);
                    border:1px solid rgba(255,255,255,.12);
                    border-radius:50px;padding:7px 14px;
                    color:rgba(255,255,255,.7);font-size:12px;font-weight:600;
                    cursor:pointer;transition:all .25s ease;
                    text-decoration:none;
                }
                .btn-back:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.22);color:white;transform:translateX(-2px);}

                .btn-outline{
                    display:block;width:100%;padding:13px;
                    border-radius:14px;border:1.5px solid rgba(255,255,255,.1);
                    color:rgba(255,255,255,.6);font-size:14px;font-weight:600;
                    text-decoration:none;text-align:center;
                    transition:all .3s ease;background:none;cursor:pointer;
                }
                .btn-outline:hover{border-color:rgba(52,211,153,.4);color:#34d399;background:rgba(52,211,153,.04);}

                .link-switch{
                    color:#34d399;font-weight:700;text-decoration:none;
                    position:relative;transition:all .25s ease;
                }
                .link-switch::after{
                    content:'';position:absolute;left:0;bottom:-1px;
                    width:0;height:1.5px;background:#34d399;
                    transition:width .25s ease;
                }
                .link-switch:hover::after{width:100%;}

                .alert{border-radius:14px;padding:14px 16px;animation:slideIn .35s ease;display:flex;align-items:flex-start;gap:12px;}
                .alert-err{background:rgba(239,68,68,.08);border:1.5px solid rgba(239,68,68,.25);}
                .alert-warn{background:rgba(251,191,36,.07);border:1.5px solid rgba(251,191,36,.22);}
                .alert-success{background:rgba(52,211,153,.08);border:1.5px solid rgba(52,211,153,.22);}
                .alert-icon{flex-shrink:0;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;}
                .shake{animation:shake .4s ease;}

                .lbl{display:block;color:rgba(255,255,255,.65);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;margin-bottom:7px;}

                @media(max-width:1023px){.left-panel{display:none!important;} #mobile-logo{display:flex!important;}}
                #mobile-logo{display:none;}
            `}</style>

            {/* ── LEFT PANEL ── */}
            <div className="left-panel" style={{ width:'45%', position:'relative', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:48, overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:0, backgroundImage:"url('/images/download.jpg')", backgroundSize:'cover', backgroundPosition:'center' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(2,44,34,.88) 0%,rgba(2,18,12,.95) 100%)' }} />
                <div className="blob" style={{ top:40, right:40, width:280, height:280, background:'radial-gradient(circle,rgba(16,185,129,.22) 0%,transparent 70%)' }} />
                <div className="blob" style={{ bottom:80, left:20, width:220, height:220, background:'radial-gradient(circle,rgba(20,184,166,.16) 0%,transparent 70%)', animationDelay:'4s' }} />

                {/* Back button top-left */}
                <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#059669,#0d9488)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'white', fontSize:13, boxShadow:'0 8px 24px rgba(5,150,105,.4)' }}>WAP</div>
                        <div>
                            <div style={{ fontSize:9, fontWeight:800, color:'#34d399', letterSpacing:'0.2em', textTransform:'uppercase' }}>Wisata Alam</div>
                            <div className="fp" style={{ fontSize:20, fontWeight:700, color:'white' }}>Pronojiwo</div>
                        </div>
                    </div>
                    <Link href={route('home')} className="btn-back">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                        Beranda
                    </Link>
                </div>

                {/* Hero copy */}
                <div style={{ position:'relative', zIndex:2 }}>
                    <div className="badge-float" style={{ display:'inline-block', background:'rgba(52,211,153,.1)', border:'1px solid rgba(52,211,153,.22)', borderRadius:100, padding:'6px 14px', fontSize:11, color:'#6ee7b7', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:20 }}>
                        ✦ ECO-PARADISE INDONESIA
                    </div>
                    <h2 className="fp" style={{ fontSize:42, color:'white', lineHeight:1.2, marginBottom:14 }}>
                        Selamat Datang<br />
                        <span style={{ fontStyle:'italic', background:'linear-gradient(135deg,#6ee7b7,#a5f3fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Penjelajah Alam</span>
                    </h2>
                    <p style={{ color:'rgba(255,255,255,.55)', fontSize:14, lineHeight:1.7, marginBottom:28, maxWidth:340 }}>
                        Masuk dan temukan surga tersembunyi Lumajang. Pesan tiket, lacak perjalanan, dan nikmati pengalaman tak terlupakan.
                    </p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                        {[{n:'10+',l:'Destinasi'},{n:'1.2K+',l:'Traveler'},{n:'4.9★',l:'Rating'}].map((s,i)=>(
                            <div key={i} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:16, padding:'14px 12px', textAlign:'center' }}>
                                <div style={{ fontSize:22, fontWeight:900, color:'white' }}>{s.n}</div>
                                <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.1em', marginTop:2 }}>{s.l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ position:'relative', zIndex:2, borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:16 }}>
                    <p style={{ color:'rgba(255,255,255,.3)', fontSize:12, fontStyle:'italic' }}>"Dari canyon Tumpak Sewu hingga kabut pelangi Kapas Biru."</p>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px', position:'relative', overflowY:'auto' }}>
                <div style={{ position:'absolute', top:0, right:0, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 70%)', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:0, left:0, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,.05) 0%,transparent 70%)', pointerEvents:'none' }} />

                <div style={{ width:'100%', maxWidth:440 }}>

                    {/* Mobile: back + logo */}
                    <div id="mobile-logo" className="a1" style={{ alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#059669,#0d9488)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'white', fontSize:11 }}>WAP</div>
                            <div className="fp" style={{ fontSize:17, fontWeight:700, color:'white' }}>Pronojiwo</div>
                        </div>
                        <Link href={route('home')} className="btn-back">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                            Beranda
                        </Link>
                    </div>

                    {/* Heading */}
                    <div className="a1" style={{ marginBottom:28 }}>
                        <h1 className="fp" style={{ fontSize:30, fontWeight:700, color:'white', marginBottom:6 }}>Masuk ke Akun</h1>
                        <p style={{ color:'rgba(255,255,255,.4)', fontSize:14 }}>
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="link-switch">Daftar gratis →</Link>
                        </p>
                    </div>

                    {/* Alerts */}
                    {status && (
                        <div className="alert alert-success a1" style={{ marginBottom:20 }}>
                            <div className="alert-icon" style={{ background:'rgba(52,211,153,.15)' }}>✅</div>
                            <p style={{ color:'#6ee7b7', fontSize:13, fontWeight:600 }}>{status}</p>
                        </div>
                    )}
                    {emailNotFound && (
                        <div className="alert alert-err shake" style={{ marginBottom:20 }}>
                            <div className="alert-icon" style={{ background:'rgba(239,68,68,.15)' }}>📧</div>
                            <div style={{ flex:1 }}>
                                <p style={{ color:'#fca5a5', fontSize:13, fontWeight:700, marginBottom:4 }}>Email Belum Terdaftar</p>
                                <p style={{ color:'rgba(255,255,255,.5)', fontSize:12, lineHeight:1.5 }}>
                                    Alamat email ini tidak ditemukan.{' '}
                                    <button onClick={() => smoothNavigate(route('register'))} style={{ background:'none', border:'none', padding:0, color:'#34d399', fontWeight:700, fontSize:12, cursor:'pointer', textDecoration:'underline' }}>
                                        Daftar sekarang →
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                    {passwordWrong && (
                        <div className="alert alert-warn shake" style={{ marginBottom:20 }}>
                            <div className="alert-icon" style={{ background:'rgba(251,191,36,.15)' }}>🔑</div>
                            <div style={{ flex:1 }}>
                                <p style={{ color:'#fde68a', fontSize:13, fontWeight:700, marginBottom:4 }}>Password Salah</p>
                                <p style={{ color:'rgba(255,255,255,.5)', fontSize:12, lineHeight:1.5 }}>
                                    Password tidak sesuai.{' '}
                                    {canResetPassword && (
                                        <Link href={route('password.request')} style={{ color:'#fbbf24', fontWeight:700, textDecoration:'underline' }}>Lupa password?</Link>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                    {emailRateLimit && (
                        <div className="alert alert-err" style={{ marginBottom:20 }}>
                            <div className="alert-icon" style={{ background:'rgba(239,68,68,.15)' }}>⏳</div>
                            <div>
                                <p style={{ color:'#fca5a5', fontSize:13, fontWeight:700, marginBottom:4 }}>Terlalu Banyak Percobaan</p>
                                <p style={{ color:'rgba(255,255,255,.5)', fontSize:12 }}>{errors.email}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:18 }}>

                        {/* Email */}
                        <div className="a2">
                            <label className="lbl">Email</label>
                            <div style={{ position:'relative' }}>
                                <span className="icon-l">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </span>
                                <input
                                    id="email" type="email" name="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username" autoFocus
                                    placeholder="nama@email.com"
                                    className={`inp${emailNotFound || emailRateLimit ? ' inp-err' : ''}`}
                                    style={{ paddingLeft:42 }}
                                />
                            </div>
                            {errors.email && !emailNotFound && !emailRateLimit && (
                                <p style={{ color:'#f87171', fontSize:12, marginTop:5 }}>{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="a3">
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                                <label className="lbl" style={{ margin:0 }}>Password</label>
                                {canResetPassword && !passwordWrong && (
                                    <Link href={route('password.request')} style={{ color:'#34d399', fontSize:12, fontWeight:600, textDecoration:'none' }}>Lupa password?</Link>
                                )}
                            </div>
                            <div style={{ position:'relative' }}>
                                <span className="icon-l">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input
                                    id="password" type={showPassword ? 'text' : 'password'} name="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className={`inp${passwordWrong ? ' inp-err' : ''}`}
                                    style={{ paddingLeft:42, paddingRight:48 }}
                                />
                                <button type="button" className="icon-r" onClick={() => setShowPassword(v => !v)}>
                                    {showPassword
                                        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Remember */}
                        <div className="a4">
                            <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                                <Checkbox name="remember" checked={data.remember} onChange={e => setData('remember', e.target.checked)} />
                                <span style={{ color:'rgba(255,255,255,.5)', fontSize:13 }}>Ingat saya di perangkat ini</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="a5">
                            <button type="submit" disabled={processing} className="btn-main">
                                {processing
                                    ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                                        <svg width="16" height="16" style={{ animation:'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                                            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        Memverifikasi...
                                    </span>
                                    : 'Masuk ke Akun →'
                                }
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="a6" style={{ display:'flex', alignItems:'center', gap:12 }}>
                            <div style={{ flex:1, height:1, background:'rgba(255,255,255,.08)' }} />
                            <span style={{ color:'rgba(255,255,255,.25)', fontSize:12 }}>atau</span>
                            <div style={{ flex:1, height:1, background:'rgba(255,255,255,.08)' }} />
                        </div>

                        {/* Register button */}
                        <div className="a6">
                            <Link href={route('register')} className="btn-outline">
                                Belum punya akun? Daftar Gratis
                            </Link>
                        </div>
                    </form>

                    <p style={{ color:'rgba(255,255,255,.18)', fontSize:11, textAlign:'center', marginTop:28 }}>
                        © 2025 Pronojiwo Nature Escape · Lumajang, Jawa Timur
                    </p>
                </div>
            </div>
        </div>
    );
}
