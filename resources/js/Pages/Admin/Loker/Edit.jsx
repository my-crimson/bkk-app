import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminLokerEdit({ lowker, perusahaan, jurusan }) {
    const { data, setData, put, processing } = useForm({
        judul_lowker: lowker.judul_lowker || '', deskripsi_lowker: lowker.deskripsi_lowker || '', kualifikasi: lowker.kualifikasi || '',
        gaji: lowker.gaji || '', lokasi: lowker.lokasi || '', tgl_posting: lowker.tgl_posting || '',
        tgl_ditutup: lowker.tgl_ditutup || '', id_perusahaan: lowker.id_perusahaan || '', id_jurusan: lowker.id_jurusan || '',
        status: lowker.status || 'aktif',
    });

    const submit = (e) => { e.preventDefault(); put(`/admin/loker/${lowker.id_lowker}`); };

    return (
        <MainLayout>
            <Head title="Edit Lowongan Kerja" />
            <div className="header-bar"><a href="#">CRUD / Edit Lowongan Kerja</a></div>
            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>Edit Lowongan Kerja</h2>
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
                    <div className="form-group"><label>Status</label><select value={data.status} onChange={e => setData('status', e.target.value)}><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
                    <button type="submit" className="btn-submit" disabled={processing}>Update</button>
                </form>
            </div>
        </MainLayout>
    );
}
