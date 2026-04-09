import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminLokerCreate({ perusahaan, jurusan }) {
    const { data, setData, post, processing } = useForm({
        judul_lowker: '', deskripsi_lowker: '', kualifikasi: '', gaji: '', lokasi: '',
        tgl_posting: '', tgl_ditutup: '', id_perusahaan: '', id_jurusan: '', status: 'aktif',
        email: '', pendidikan: '', tipe_pekerjaan: '', keahlian: '', waktu_bekerja: '', tunjangan: '',
    });

    const submit = (e) => { e.preventDefault(); post('/admin/loker'); };

    return (
        <MainLayout>
            <Head title="Tambah Lowongan Kerja" />
            <div className="header-bar"><a href="#">CRUD / Tambah Lowongan Kerja</a></div>
            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>Tambah Lowongan Kerja</h2>
                <form onSubmit={submit}>
                    <div className="form-group"><label>Judul Lowongan</label><input value={data.judul_lowker} onChange={e => setData('judul_lowker', e.target.value)} required /></div>
                    <div className="form-group"><label>Perusahaan</label><select value={data.id_perusahaan} onChange={e => setData('id_perusahaan', e.target.value)} required><option value="">-- Pilih --</option>{perusahaan?.map(p => <option key={p.id_perusahaan} value={p.id_perusahaan}>{p.nama}</option>)}</select></div>
                    <div className="form-group"><label>Jurusan</label><select value={data.id_jurusan} onChange={e => setData('id_jurusan', e.target.value)} required><option value="">-- Pilih --</option>{jurusan?.map(j => <option key={j.id_jurusan} value={j.id_jurusan}>{j.jurusan}</option>)}</select></div>
                    <div className="form-group"><label>Deskripsi</label><textarea value={data.deskripsi_lowker} onChange={e => setData('deskripsi_lowker', e.target.value)}></textarea></div>
                    <div className="form-group"><label>Persyaratan</label><textarea value={data.kualifikasi} onChange={e => setData('kualifikasi', e.target.value)}></textarea></div>
                    <div className="form-group"><label>Gaji</label><input value={data.gaji} onChange={e => setData('gaji', e.target.value)} /></div>
                    <div className="form-group"><label>Lokasi</label><input value={data.lokasi} onChange={e => setData('lokasi', e.target.value)} /></div>
                    <div className="form-group"><label>Tanggal Posting</label><input type="date" value={data.tgl_posting} onChange={e => setData('tgl_posting', e.target.value)} /></div>
                    <div className="form-group"><label>Tanggal Ditutup</label><input type="date" value={data.tgl_ditutup} onChange={e => setData('tgl_ditutup', e.target.value)} /></div>
                    <div className="form-group"><label>Email Kontak</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required /></div>
                    <div className="form-group"><label>Pendidikan</label><input value={data.pendidikan} onChange={e => setData('pendidikan', e.target.value)} /></div>
                    <div className="form-group"><label>Tipe Pekerjaan</label><input value={data.tipe_pekerjaan} onChange={e => setData('tipe_pekerjaan', e.target.value)} /></div>
                    <div className="form-group"><label>Keahlian yang Dibutuhkan</label><textarea value={data.keahlian} onChange={e => setData('keahlian', e.target.value)}></textarea></div>
                    <div className="form-group"><label>Waktu Bekerja</label><input value={data.waktu_bekerja} onChange={e => setData('waktu_bekerja', e.target.value)} /></div>
                    <div className="form-group"><label>Tunjangan</label><textarea value={data.tunjangan} onChange={e => setData('tunjangan', e.target.value)}></textarea></div>
                    <button type="submit" className="btn-submit" disabled={processing}>Simpan</button>
                </form>
            </div>
        </MainLayout>
    );
}
