import { Head, router, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminPerusahaanIndex({ perusahaan }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        nama: '', alamat: '', kota: '', deskripsi_perusahaan: '', email: '', kontak: '',
        gambar: '', standar: '', kategori: '', kerja_sama: '',
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
                    <div className="form-group"><label>Nama Perusahaan*</label><input value={data.nama} onChange={e => setData('nama', e.target.value)} required /></div>
                    <div className="form-group"><label>Alamat</label><input value={data.alamat} onChange={e => setData('alamat', e.target.value)} /></div>
                    <div className="form-group"><label>Kota</label><input value={data.kota} onChange={e => setData('kota', e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} /></div>
                    <div className="form-group"><label>Kontak (No. Telepon)</label><input value={data.kontak} onChange={e => setData('kontak', e.target.value)} /></div>
                    <div className="form-group"><label>Standar</label>
                        <select value={data.standar} onChange={e => setData('standar', e.target.value)}>
                            <option value="">-- Pilih --</option>
                            <option value="umkm">UMKM</option>
                            <option value="mou">MOU</option>
                            <option value="startup">Startup</option>
                            <option value="perseroan">Perseroan</option>
                        </select>
                    </div>
                    <div className="form-group"><label>Kategori</label>
                        <select value={data.kategori} onChange={e => setData('kategori', e.target.value)}>
                            <option value="">-- Pilih --</option>
                            <option value="lokal">Lokal</option>
                            <option value="provinsi">Provinsi</option>
                            <option value="nasional">Nasional</option>
                            <option value="internasional">Internasional</option>
                        </select>
                    </div>
                    <div className="form-group"><label>Deskripsi</label><textarea value={data.deskripsi_perusahaan} onChange={e => setData('deskripsi_perusahaan', e.target.value)}></textarea></div>
                    <div className="form-group"><label>Kerjasama</label><textarea value={data.kerja_sama} onChange={e => setData('kerja_sama', e.target.value)}></textarea></div>
                    <button type="submit" className="btn-submit" disabled={processing}>Simpan</button>
                </form>
            </div>

            <div className="rekap-container">
                <table className="rekap-table">
                    <thead><tr><th>No</th><th>Nama</th><th>Alamat</th><th>Email</th><th>Kontak</th><th>Standar</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {perusahaan?.map((p, i) => (
                            <tr key={p.id_perusahaan}>
                                <td>{i + 1}</td><td>{p.nama}</td><td>{p.alamat || '-'}</td><td>{p.email || '-'}</td><td>{p.kontak || '-'}</td><td>{p.standar || '-'}</td>
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
