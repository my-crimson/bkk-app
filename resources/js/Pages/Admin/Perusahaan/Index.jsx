import { Head, router, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminPerusahaanIndex({ perusahaan }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        nama: '', alamat: '', deskripsi_perusahaan: '', email: '', telepon: '',
        website: '', jenis_perusahaan: '', skala: '', jumlah_karyawan: '',
    });

    const submit = (e) => { e.preventDefault(); post('/admin/perusahaan', { onSuccess: () => reset() }); };
    const handleDelete = (id) => { if (confirm('Yakin ingin menghapus?')) router.delete(`/admin/perusahaan/${id}`); };

    return (
        <MainLayout>
            <Head title="CRUD Perusahaan" />
            <div className="header-bar"><a href="#">CRUD / Perusahaan</a></div>

            <div className="crud-form">
                <h3 style={{ marginBottom: '15px', color: '#134CBC' }}>Tambah Perusahaan</h3>
                <form onSubmit={submit}>
                    <div className="form-group"><label>Nama Perusahaan</label><input value={data.nama} onChange={e => setData('nama', e.target.value)} required /></div>
                    <div className="form-group"><label>Alamat</label><input value={data.alamat} onChange={e => setData('alamat', e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input value={data.email} onChange={e => setData('email', e.target.value)} /></div>
                    <div className="form-group"><label>Telepon</label><input value={data.telepon} onChange={e => setData('telepon', e.target.value)} /></div>
                    <div className="form-group"><label>Website</label><input value={data.website} onChange={e => setData('website', e.target.value)} /></div>
                    <div className="form-group"><label>Jenis</label><input value={data.jenis_perusahaan} onChange={e => setData('jenis_perusahaan', e.target.value)} /></div>
                    <div className="form-group"><label>Deskripsi</label><textarea value={data.deskripsi_perusahaan} onChange={e => setData('deskripsi_perusahaan', e.target.value)}></textarea></div>
                    <button type="submit" className="btn-submit" disabled={processing}>Simpan</button>
                </form>
            </div>

            <div className="rekap-container">
                <table className="rekap-table">
                    <thead><tr><th>No</th><th>Nama</th><th>Alamat</th><th>Email</th><th>Telepon</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {perusahaan?.map((p, i) => (
                            <tr key={p.id_perusahaan}>
                                <td>{i + 1}</td><td>{p.nama}</td><td>{p.alamat || '-'}</td><td>{p.email || '-'}</td><td>{p.telepon || '-'}</td>
                                <td>
                                    <button onClick={() => handleDelete(p.id_perusahaan)} className="delete-button" style={{ padding: '5px 10px', fontSize: '12px' }}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}
