import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import PasswordInput from '../../Components/PasswordInput';

export default function AlumniLogin() {
    const { flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        nisn: '',
        password: '',
    });

    const [showForgot, setShowForgot] = useState(false);
    const [forgotNisn, setForgotNisn] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post('/login/siswa');
    };

    const handleForgotSubmit = async () => {
        if (!forgotNisn.trim()) {
            setForgotMessage({ type: 'error', text: 'Masukkan NISN terlebih dahulu.' });
            return;
        }
        setForgotLoading(true);
        setForgotMessage(null);
        try {
            const res = await axios.post('/forgot-password', { nisn: forgotNisn });
            setForgotMessage({
                type: res.data.success ? 'success' : 'error',
                text: res.data.message,
            });
        } catch (e) {
            const msg = e.response?.data?.message || 'Terjadi kesalahan. Coba lagi nanti.';
            setForgotMessage({ type: 'error', text: msg });
        }
        setForgotLoading(false);
    };

    const WA_NUMBER = '6281234567890'; // Ganti dengan nomor admin BKK

    return (
        <div className="login-page">
            <Head title="Login Siswa/Alumni" />
            
            {/* Tombol Kembali ke Beranda */}
            <Link href="/" className="back-home-button" title="Kembali ke Beranda">
                <i className="fa-solid fa-xmark"></i>
            </Link>
            
            <div className="login-left" style={{ backgroundImage: "url('/images/login-bg.jpg')" }}>
                <div className="login-left-content">
                    <h1>SMKN 1 BOYOLANGU</h1>
                    <p>Bursa Kerja Khusus - Jembatan Masa Depan Anda</p>
                </div>
            </div>

            <div className="login-container">
                <div className="login-card-form">
                    <div className="login-header">
                        <img src="/images/logo.png" alt="Logo" className="logo-img" />
                        <h2>Login</h2>
                        <p>Akun Siswa/Alumni</p>
                    </div>
                    <form onSubmit={submit}>
                        {flash?.error && (
                            <div className="error-message">{flash.error}</div>
                        )}
                        <div className="input-group">
                            <label htmlFor="nisn">NISN</label>
                            <input type="text" name="nisn" id="nisn" placeholder="Masukkan NISN..."
                                value={data.nisn} onChange={e => setData('nisn', e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <PasswordInput
                                name="password"
                                id="password"
                                placeholder="Masukkan Password..."
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                            />
                        </div>
                        <p className="login-hint">* Login pertama: gunakan NISN sebagai password</p>
                        <button type="submit" className="login-button" disabled={processing}>MASUK</button>
                    </form>

                    {/* Forgot Password Link */}
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <button
                            type="button"
                            onClick={() => { setShowForgot(true); setForgotMessage(null); setForgotNisn(''); }}
                            style={{ background: 'none', border: 'none', color: '#134CBC', cursor: 'pointer', fontSize: '14px', fontWeight: 600, textDecoration: 'underline' }}
                        >
                            <i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i>
                            Lupa Password?
                        </button>
                    </div>

                    <p className="footer-text">Bursa Kerja Khusus SMKN 1 Boyolangu</p>
                </div>
            </div>

            {/* ====== FORGOT PASSWORD MODAL ====== */}
            {showForgot && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 10000, backdropFilter: 'blur(3px)',
                }} onClick={() => setShowForgot(false)}>
                    <div style={{
                        background: '#fff', borderRadius: '16px', padding: '30px',
                        width: '90%', maxWidth: '420px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
                            <i className="fa-solid fa-key" style={{ marginRight: '10px', color: '#134CBC' }}></i>
                            Lupa Password
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px 0' }}>
                            Pilih cara untuk mereset password Anda:
                        </p>

                        {/* OPTION 1: Website Request */}
                        <div style={{ background: '#f0f7ff', border: '1px solid #cce5ff', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#134CBC', margin: '0 0 8px 0' }}>
                                <i className="fa-solid fa-globe" style={{ marginRight: '6px' }}></i>
                                Kirim Permintaan Reset via Website
                            </h4>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>
                                Jam operasional: <strong>07.00 - 17.00 WIB</strong>
                            </p>
                            <p style={{ fontSize: '12px', color: '#0369a1', margin: '0 0 10px 0', background: '#e0f2fe', padding: '6px 10px', borderRadius: '6px' }}>
                                <i className="fa-solid fa-circle-info" style={{ marginRight: '6px' }}></i>
                                Jika disetujui, password otomatis direset menjadi <strong>NISN</strong> Anda.
                            </p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Masukkan NISN Anda..."
                                    value={forgotNisn}
                                    onChange={e => setForgotNisn(e.target.value)}
                                    style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                                />
                                <button
                                    onClick={handleForgotSubmit}
                                    disabled={forgotLoading}
                                    style={{ padding: '8px 16px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
                                >
                                    {forgotLoading ? '...' : 'Kirim'}
                                </button>
                            </div>
                            {forgotMessage && (
                                <div style={{
                                    marginTop: '8px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px',
                                    background: forgotMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                                    color: forgotMessage.type === 'success' ? '#166534' : '#dc2626',
                                }}>
                                    <i className={`fa-solid ${forgotMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: '6px' }}></i>
                                    {forgotMessage.text}
                                </div>
                            )}
                        </div>

                        {/* OPTION 2: WhatsApp */}
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#166534', margin: '0 0 8px 0' }}>
                                <i className="fa-brands fa-whatsapp" style={{ marginRight: '6px' }}></i>
                                Hubungi Management via WhatsApp
                            </h4>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 10px 0' }}>
                                Tersedia <strong>24 jam</strong>
                            </p>
                            <a
                                href={`https://wa.me/6287844852308?text=${encodeURIComponent('Halo Management BKK, saya ingin mereset password akun saya. NISN saya: ')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 16px', background: '#25D366', color: '#fff', border: 'none',
                                    borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', fontSize: '13px',
                                }}
                            >
                                <i className="fa-brands fa-whatsapp"></i> Buka WhatsApp
                            </a>
                        </div>

                        <button
                            onClick={() => setShowForgot(false)}
                            style={{ width: '100%', padding: '10px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
