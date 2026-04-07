import { Head, useForm, usePage } from '@inertiajs/react';

export default function AlumniLogin() {
    const { flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        nama: '',
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
                            <label htmlFor="nama">Username</label>
                            <input type="text" name="nama" id="username" placeholder="Masukkan Username..."
                                value={data.nama} onChange={e => setData('nama', e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" placeholder="Masukkan Password..."
                                value={data.password} onChange={e => setData('password', e.target.value)} required />
                        </div>
                        <button type="submit" className="login-button" disabled={processing}>MASUK</button>
                    </form>
                    <p className="footer-text">Bursa Kerja Khusus SMKN 1 Boyolangu</p>
                </div>
            </div>
        </div>
    );
}
