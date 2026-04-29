import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function AdminJurusanEdit({ jurusan }) {
    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        jurusan: jurusan.jurusan || '',
        deskripsi: jurusan.deskripsi || '',
        prospek_kerja: jurusan.prospek_kerja || '',
        gambar1: null,
        gambar2: null,
    });

    const submit = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('update jurusan'))) return;
        post(`/admin/jurusan/${jurusan.id_jurusan}`, {
            forceFormData: true,
            onSuccess: () => notifyActionSuccess('update jurusan'),
        });
    };

    return (
        <MainLayout>
            <Head title="Edit Jurusan" />
            <div className="header-bar"><a href="#">CRUD / Edit Jurusan</a></div>
            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>Edit Jurusan</h2>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label>Nama Jurusan</label>
                        <input value={data.jurusan} onChange={e => setData('jurusan', e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} rows="5"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Prospek Kerja</label>
                        <textarea value={data.prospek_kerja} onChange={e => setData('prospek_kerja', e.target.value)} rows="5"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Gambar 1 {jurusan.gambar1 && <span style={{ fontSize: '0.85em', color: '#888' }}>(saat ini: {jurusan.gambar1})</span>}</label>
                        <input type="file" accept="image/*" onChange={e => setData('gambar1', e.target.files[0])} />
                        {jurusan.gambar1 && (
                            <img src={`/storage/uploads/jurusan/${jurusan.gambar1}`} alt="Preview" style={{ maxWidth: '200px', marginTop: '8px', borderRadius: '6px' }} />
                        )}
                    </div>
                    <div className="form-group">
                        <label>Gambar 2 {jurusan.gambar2 && <span style={{ fontSize: '0.85em', color: '#888' }}>(saat ini: {jurusan.gambar2})</span>}</label>
                        <input type="file" accept="image/*" onChange={e => setData('gambar2', e.target.files[0])} />
                        {jurusan.gambar2 && (
                            <img src={`/storage/uploads/jurusan/${jurusan.gambar2}`} alt="Preview" style={{ maxWidth: '200px', marginTop: '8px', borderRadius: '6px' }} />
                        )}
                    </div>
                    <button type="submit" className="btn-submit" disabled={processing}>Update</button>
                </form>
            </div>
        </MainLayout>
    );
}
