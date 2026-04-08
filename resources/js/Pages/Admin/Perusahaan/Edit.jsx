import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminPerusahaanEdit({ perusahaan }) {
    const { data, setData, put, processing } = useForm({
        nama_perusahaan: perusahaan.nama_perusahaan || '',
        alamat: perusahaan.alamat || '',
        deskripsi: perusahaan.deskripsi || '',
        email: perusahaan.email || '',
        telepon: perusahaan.telepon || '',
        website: perusahaan.website || '',
        jenis_perusahaan: perusahaan.jenis_perusahaan || '',
        skala: perusahaan.skala || '',
        jumlah_karyawan: perusahaan.jumlah_karyawan || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/perusahaan/${perusahaan.id_perusahaan}`);
    };

    const jenisOptions = ['UMKM', 'MOU', 'Perseroan', 'Startup'];
    const skalaOptions = ['Lokal', 'Provinsi', 'Nasional', 'Internasional'];

    return (
        <MainLayout>
            <Head title="Edit Perusahaan" />

            <div className="header-bar">
                <a href="#">CRUD / Edit Perusahaan</a>
            </div>

            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>
                    Edit Perusahaan
                </h2>

                <form onSubmit={submit}>
                    {/* NAMA */}
                    <div className="form-group">
                        <label>Nama</label>
                        <input
                            value={data.nama_perusahaan}
                            onChange={e => setData('nama_perusahaan', e.target.value)}
                            required
                        />
                    </div>

                    {/* ALAMAT */}
                    <div className="form-group">
                        <label>Alamat</label>
                        <input
                            value={data.alamat}
                            onChange={e => setData('alamat', e.target.value)}
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                    </div>

                    {/* TELEPON */}
                    <div className="form-group">
                        <label>Telepon</label>
                        <input
                            value={data.telepon}
                            onChange={e => setData('telepon', e.target.value)}
                        />
                    </div>

                    {/* WEBSITE */}
                    <div className="form-group">
                        <label>Website</label>
                        <input
                            value={data.website}
                            onChange={e => setData('website', e.target.value)}
                        />
                    </div>

                    {/* JENIS */}
                    <div className="form-group">
                        <label>Jenis Perusahaan</label>
                        <select
                            value={data.jenis_perusahaan}
                            onChange={e => setData('jenis_perusahaan', e.target.value)}
                        >
                            <option value="">-- Pilih Jenis --</option>
                            {jenisOptions.map(j => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </select>
                    </div>

                    {/* SKALA */}
                    <div className="form-group">
                        <label>Skala Perusahaan</label>
                        <select
                            value={data.skala}
                            onChange={e => setData('skala', e.target.value)}
                        >
                            <option value="">-- Pilih Skala --</option>
                            {skalaOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* JUMLAH KARYAWAN */}
                    <div className="form-group">
                        <label>Jumlah Karyawan</label>
                        <input
                            value={data.jumlah_karyawan}
                            onChange={e => setData('jumlah_karyawan', e.target.value)}
                        />
                    </div>

                    {/* DESKRIPSI */}
                    <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={e => setData('deskripsi', e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={processing}>
                        Update
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}