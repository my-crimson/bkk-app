import { Head, router, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminBeritaIndex({ berita }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        judul: '', tanggal: '', jml_peserta: '', lokasi: '', deskripsi_lowker: '', gambar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/berita', { forceFormData: true, onSuccess: () => reset() });
    };

    const handleDelete = (id) => { if (confirm('Yakin ingin menghapus?')) router.delete(`/admin/berita/${id}`); };

    return (
        <MainLayout>
            <Head title="CRUD Kegiatan BKK" />
            <div className="header-bar"><a href="#">CRUD / Kegiatan BKK</a></div>

            <div className="crud-form">
                <h3 style={{ marginBottom: '15px', color: '#134CBC' }}>Tambah Kegiatan</h3>
                <form onSubmit={submit}>
                    <div className="form-group"><label>Judul</label><input value={data.judul} onChange={e => setData('judul', e.target.value)} required /></div>
                    <div className="form-group"><label>Tanggal</label><input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} /></div>
                    <div className="form-group"><label>Jumlah Peserta</label><input value={data.jml_peserta} onChange={e => setData('jml_peserta', e.target.value)} /></div>
                    <div className="form-group"><label>Lokasi</label><input value={data.lokasi} onChange={e => setData('lokasi', e.target.value)} /></div>
                    <div className="form-group"><label>Deskripsi</label><textarea value={data.deskripsi_lowker} onChange={e => setData('deskripsi_lowker', e.target.value)}></textarea></div>
                    <div className="form-group"><label>Gambar</label><input type="file" accept="image/*" onChange={e => setData('gambar', e.target.files[0])} /></div>
                    <button type="submit" className="btn-submit" disabled={processing}>Simpan</button>
                </form>
            </div>

            <div className="rekap-container">
                <table className="rekap-table">
                    <thead><tr><th>No</th><th>Judul</th><th>Tanggal</th><th>Lokasi</th><th>Peserta</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {berita?.map((b, i) => (
                            <tr key={b.id_berita}>
                                <td>{i + 1}</td><td>{b.judul}</td><td>{b.tanggal}</td><td>{b.lokasi || '-'}</td><td>{b.jml_peserta || '-'}</td>
                                <td>
                                    <button onClick={() => handleDelete(b.id_berita)} className="delete-button" style={{ padding: '5px 10px', fontSize: '12px' }}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}
