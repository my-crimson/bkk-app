import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminBeritaEdit({ berita }) {
    const { data, setData, post, processing } = useForm({
        _method: 'PUT', judul: berita.judul || '', tanggal: berita.tanggal || '',
        jml_peserta: berita.jml_peserta || '', lokasi: berita.lokasi || '', deskripsi_lowker: berita.deskripsi_lowker || '',
        gambar: null,
    });

    const submit = (e) => { e.preventDefault(); post(`/admin/berita/${berita.id_berita}`, { forceFormData: true }); };

    return (
        <MainLayout>
            <Head title="Edit Kegiatan" />
            <div className="header-bar"><a href="#">CRUD / Edit Kegiatan</a></div>
            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>Edit Kegiatan</h2>
                <form onSubmit={submit}>
                    <div className="form-group"><label>Judul</label><input value={data.judul} onChange={e => setData('judul', e.target.value)} required /></div>
                    <div className="form-group"><label>Tanggal</label><input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} /></div>
                    <div className="form-group"><label>Jumlah Peserta</label><input value={data.jml_peserta} onChange={e => setData('jml_peserta', e.target.value)} /></div>
                    <div className="form-group"><label>Lokasi</label><input value={data.lokasi} onChange={e => setData('lokasi', e.target.value)} /></div>
                    <div className="form-group"><label>Deskripsi</label><textarea value={data.deskripsi_lowker} onChange={e => setData('deskripsi_lowker', e.target.value)}></textarea></div>
                    <div className="form-group"><label>Gambar</label><input type="file" accept="image/*" onChange={e => setData('gambar', e.target.files[0])} /></div>
                    <button type="submit" className="btn-submit" disabled={processing}>Update</button>
                </form>
            </div>
        </MainLayout>
    );
}
