import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function ManagementBeritaEdit({ berita }) {
    const { data, setData, post, processing } = useForm({
        _method: 'PUT', judul: berita.judul || '', tanggal: berita.tanggal || '',
        jml_peserta: berita.jml_peserta || '', lokasi: berita.lokasi || '', deskripsi: berita.deskripsi || '',
        gambar: null,
    });

    const submit = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('update kegiatan'))) return;
        post(`/management/berita/${berita.id_berita}`, {
            forceFormData: true,
            onSuccess: () => notifyActionSuccess('update kegiatan'),
        });
    };

    return (
        <MainLayout>
            <Head title="Edit Kegiatan" />
            <div className="header-bar"><a href="#">CRUD / Edit Kegiatan</a></div>
            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>Edit Kegiatan</h2>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label>
                            Judul Berita <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input value={data.judul} onChange={e => setData('judul', e.target.value)} required /></div>
                    <div className="form-group">
                        <label>
                            Tanggal <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} required /></div>
                    <div className="form-group">
                        <label>
                            Jumlah Peserta
                        </label>
                        <input value={data.jml_peserta} onChange={e => setData('jml_peserta', e.target.value)} /></div>
                    <div className="form-group">
                        <label>
                            Lokasi <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input value={data.lokasi} onChange={e => setData('lokasi', e.target.value)} required /></div>
                    <div className="form-group">
                        <label>
                            Deskripsi <span style={{ color: 'red' }}>*</span>
                        </label>
                        <textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} required ></textarea></div>
                    <div className="form-group">
                        <label>
                            Gambar
                        </label>
                        <input type="file" accept="image/*" onChange={e => setData('gambar', e.target.files[0])} /></div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link href="/management/berita" className="btn-submit" style={{ backgroundColor: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Kembali
                        </Link>
                        <button type="submit" className="btn-submit" disabled={processing}>
                            {processing ? 'Mengupdate...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
