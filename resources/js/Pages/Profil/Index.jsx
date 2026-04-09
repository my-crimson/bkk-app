import { Head, useForm, usePage, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function ProfilIndex({ alumni }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        nama: alumni.nama || '',
        jenis_kelamin: alumni.jenis_kelamin || '',
        nisn: alumni.nisn || '',
        tempat_lahir: alumni.tempat_lahir || '',
        tanggal_lahir: alumni.tanggal_lahir || '',
        nik: alumni.nik || '',
        agama: alumni.agama || '',
        alamat: alumni.alamat || '',
        email: alumni.email || '',
        no_wa: alumni.no_wa || '',
        gambar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/profil', { forceFormData: true });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            router.post('/logout');
        }
    };

    return (
        <MainLayout>
            <Head title="Profil" />
            <div className="header-bar"><a href="#">Profil</a></div>
            <div className="profil-container">
                {flash?.success && <div className="alert alert-success">{flash.success}</div>}
                <div className="profil-card">
                    <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>Profil Alumni</h2>
                    <form onSubmit={submit}>
                        <div className="form-group">
                            <label>Nama</label>
                            <input value={data.nama} onChange={e => setData('nama', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>NISN</label>
                            <input value={data.nisn} onChange={e => setData('nisn', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Jenis Kelamin</label>
                            <select value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)}>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tempat Lahir</label>
                            <input value={data.tempat_lahir} onChange={e => setData('tempat_lahir', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Tanggal Lahir</label>
                            <input type="date" value={data.tanggal_lahir} onChange={e => setData('tanggal_lahir', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>No WA</label>
                            <input value={data.no_wa} onChange={e => setData('no_wa', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Alamat</label>
                            <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} style={{ height: '80px' }}></textarea>
                        </div>
                        <div className="form-group">
                            <label>Foto Profil</label>
                            <input type="file" accept="image/*" onChange={e => setData('gambar', e.target.files[0])} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-save" disabled={processing}>Simpan Perubahan</button>
                            <button type="button" className="btn-logout" onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>Keluar</button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
