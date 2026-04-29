import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function AdminJurusanCreate() {
    const { data, setData, post, processing, reset } = useForm({
        jurusan: '',
        deskripsi: '',
        prospek_kerja: '',
        gambar1: null,
        gambar2: null,
    });

    const submit = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('tambah jurusan'))) return;
        post('/admin/jurusan', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                notifyActionSuccess('tambah jurusan');
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Tambah Jurusan" />
            <div className="header-bar"><a href="#">CRUD / Tambah Jurusan</a></div>
            <div className="crud-form">
                <h3 style={{ marginBottom: '15px', color: '#134CBC' }}>Tambah Jurusan</h3>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label>Nama Jurusan</label>
                        <input value={data.jurusan} onChange={e => setData('jurusan', e.target.value)} required placeholder="Contoh: Teknik Kimia Industri (TKI)" />
                    </div>
                    <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} rows="5" placeholder="Deskripsi lengkap tentang jurusan ini..."></textarea>
                    </div>
                    <div className="form-group">
                        <label>Prospek Kerja</label>
                        <textarea value={data.prospek_kerja} onChange={e => setData('prospek_kerja', e.target.value)} rows="5" placeholder="Pisahkan setiap prospek kerja dengan baris baru..."></textarea>
                    </div>
                    <div className="form-group">
                        <label>Gambar 1</label>
                        <input type="file" accept="image/*" onChange={e => setData('gambar1', e.target.files?.[0] ?? null)} />
                    </div>
                    <div className="form-group">
                        <label>Gambar 2</label>
                        <input type="file" accept="image/*" onChange={e => setData('gambar2', e.target.files?.[0] ?? null)} />
                    </div>
                    <button type="submit" className="btn-submit" disabled={processing}>Simpan</button>
                </form>
            </div>
        </MainLayout>
    );
}
