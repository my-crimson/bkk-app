import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminPerusahaanEdit({ perusahaan }) {
    const { data, setData, put, processing } = useForm({
        nama: perusahaan.nama || '', alamat: perusahaan.alamat || '',
        deskripsi_perusahaan: perusahaan.deskripsi_perusahaan || '', email: perusahaan.email || '', telepon: perusahaan.telepon || '',
        website: perusahaan.website || '', jenis_perusahaan: perusahaan.jenis_perusahaan || '',
        skala: perusahaan.skala || '', jumlah_karyawan: perusahaan.jumlah_karyawan || '',
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
                    <div className="form-group"><label>Email</label><input value={data.email} onChange={e => setData('email', e.target.value)} /></div>
                    <div className="form-group"><label>Telepon</label><input value={data.telepon} onChange={e => setData('telepon', e.target.value)} /></div>
                    <div className="form-group"><label>Deskripsi</label><textarea value={data.deskripsi_perusahaan} onChange={e => setData('deskripsi_perusahaan', e.target.value)}></textarea></div>
                    <button type="submit" className="btn-submit" disabled={processing}>Update</button>
                </form>
            </div>
        </MainLayout>
    );
}
