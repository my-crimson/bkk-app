import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminPerusahaanEdit({ perusahaan }) {
    const { data, setData, put, processing } = useForm({
        nama: perusahaan.nama || '', alamat: perusahaan.alamat || '', kota: perusahaan.kota || '',
        deskripsi_perusahaan: perusahaan.deskripsi_perusahaan || '', email: perusahaan.email || '', kontak: perusahaan.kontak || '',
        standar: perusahaan.standar || '', kategori: perusahaan.kategori || '',
        kerja_sama: perusahaan.kerja_sama || '',
    });

    const submit = (e) => { e.preventDefault(); put(`/admin/perusahaan/${perusahaan.id_perusahaan}`); };

    return (
        <MainLayout>
            <Head title="Edit Perusahaan" />
            <div className="header-bar"><a href="#">CRUD / Edit Perusahaan</a></div>
            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>Edit Perusahaan</h2>
                <form onSubmit={submit}>
                    <div className="form-group"><label>Nama</label><input value={data.nama} onChange={e => setData('nama', e.target.value)} required /></div>
                    <div className="form-group"><label>Alamat</label><input value={data.alamat} onChange={e => setData('alamat', e.target.value)} /></div>
                    <div className="form-group"><label>Kota</label><input value={data.kota} onChange={e => setData('kota', e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} /></div>
                    <div className="form-group"><label>Kontak</label><input value={data.kontak} onChange={e => setData('kontak', e.target.value)} /></div>
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
                    <button type="submit" className="btn-submit" disabled={processing}>Update</button>
                </form>
            </div>
        </MainLayout>
    );
}
