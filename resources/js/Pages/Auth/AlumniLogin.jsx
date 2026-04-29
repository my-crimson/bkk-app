import { Head, useForm, usePage } from '@inertiajs/react';
import PasswordInput from '../../Components/PasswordInput';

export default function AlumniLogin() {
    const { flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        nisn: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login/siswa');
    };

    return (
        <div className="login-page">
            <Head title="Login Siswa/Alumni" />
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
                    <p className="footer-text">Bursa Kerja Khusus SMKN 1 Boyolangu</p>
                </div>
            </div>
        </div>
    );
}
