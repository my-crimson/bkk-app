import { Head, useForm, usePage, Link } from '@inertiajs/react';
import PasswordInput from '../../Components/PasswordInput';

export default function ManagementLogin() {
    const { flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        username: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login/management');
    };

    return (
        <div className="login-page">
            <Head title="Login Management" />
            
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
                        <p>Akun Management</p>
                    </div>
                    <form onSubmit={submit}>
                        {flash?.error && (
                            <div className="error-message">{flash.error}</div>
                        )}
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" id="username" placeholder="Masukkan Username..."
                                value={data.username} onChange={e => setData('username', e.target.value)} required />
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
                        <button type="submit" className="login-button" disabled={processing}>MASUK</button>
                    </form>
                    <p className="footer-text">Bursa Kerja Khusus SMKN 1 Boyolangu</p>
                </div>
            </div>
        </div>
    );
}
