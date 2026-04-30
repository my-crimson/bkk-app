import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { validateImage } from '@/Helpers/fileHelper';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function AdminJurusanCreate() {
    const { data, setData, post, processing, reset, errors } = useForm({
        jurusan: '',
        deskripsi: '',
        prospek_kerja: '',
        gambar1: null,
        gambar2: null,
    });

    const [fileErrors, setFileErrors] = useState({
        gambar1: null,
        gambar2: null,
    });

    const [previewGambar1, setPreviewGambar1] = useState(null);
    const [previewGambar2, setPreviewGambar2] = useState(null);

    useEffect(() => {
        if (!data.gambar1) return;

        const url = URL.createObjectURL(data.gambar1);
        setPreviewGambar1(url);

        return () => URL.revokeObjectURL(url);
    }, [data.gambar1]);

    useEffect(() => {
        if (!data.gambar2) return;

        const url = URL.createObjectURL(data.gambar2);
        setPreviewGambar2(url);

        return () => URL.revokeObjectURL(url);
    }, [data.gambar2]);

    const submit = async (e) => {
        e.preventDefault();

        if (fileErrors.gambar1 || fileErrors.gambar2) return;

        if (!(await confirmAction('tambah jurusan'))) return;

        post('/admin/jurusan', {
            forceFormData: true,
            onSuccess: () => {
                reset();

                setPreviewGambar1(null);
                setPreviewGambar2(null);

                setFileErrors({
                    gambar1: null,
                    gambar2: null,
                });

                notifyActionSuccess('tambah jurusan');
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Tambah Jurusan" />

            <div className="header-bar">
                <a href="#">CRUD / Tambah Jurusan</a>
            </div>

            <div className="crud-form">
                <h3 style={{ marginBottom: '15px', color: '#134CBC' }}>
                    Tambah Jurusan
                </h3>

                <form onSubmit={submit}>

                    <div className="form-group">
                        <label>
                            Nama Jurusan <span style={{ color: 'red' }}>*</span>
                        </label>

                        <input
                            value={data.jurusan}
                            onChange={e => setData('jurusan', e.target.value)}
                            required
                            placeholder="Contoh: Teknik Kimia Industri (TKI)"
                        />

                        {errors.jurusan && (
                            <div style={{ color: 'red', fontSize: '12px' }}>
                                {errors.jurusan}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            Deskripsi <span style={{ color: 'red' }}>*</span>
                        </label>

                        <textarea
                            value={data.deskripsi}
                            onChange={e => setData('deskripsi', e.target.value)}
                            rows="5"
                            required
                            placeholder="Deskripsi lengkap tentang jurusan ini..."
                        />

                        {errors.deskripsi && (
                            <div style={{ color: 'red', fontSize: '12px' }}>
                                {errors.deskripsi}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            Prospek Kerja <span style={{ color: 'red' }}>*</span>
                        </label>

                        <textarea
                            value={data.prospek_kerja}
                            onChange={e => setData('prospek_kerja', e.target.value)}
                            rows="5"
                            required
                            placeholder="Pisahkan setiap prospek kerja dengan baris baru..."
                        />

                        {errors.prospek_kerja && (
                            <div style={{ color: 'red', fontSize: '12px' }}>
                                {errors.prospek_kerja}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            Gambar 1 <span style={{ color: 'red' }}>*</span>
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={e => {
                                const file = e.target.files?.[0];
                                const error = validateImage(file, 'Gambar 1');

                                if (error) {
                                    setFileErrors(prev => ({
                                        ...prev,
                                        gambar1: error,
                                    }));

                                    setData('gambar1', null);
                                    return;
                                }

                                setFileErrors(prev => ({
                                    ...prev,
                                    gambar1: null,
                                }));

                                setData('gambar1', file || null);
                            }}
                        />

                        {!previewGambar1 && (
                            <small style={{ color: '#888' }}>
                                Format: JPG / PNG, maksimal 2MB
                            </small>
                        )}

                        {fileErrors.gambar1 && (
                            <div style={{ color: 'red' }}>
                                {fileErrors.gambar1}
                            </div>
                        )}

                        {previewGambar1 && (
                            <img
                                src={previewGambar1}
                                width="100"
                                style={{ marginTop: '10px', borderRadius: '8px' }}
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            Gambar 2 <span style={{ color: 'red' }}>*</span>
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={e => {
                                const file = e.target.files?.[0];
                                const error = validateImage(file, 'Gambar 2');

                                if (error) {
                                    setFileErrors(prev => ({
                                        ...prev,
                                        gambar2: error,
                                    }));

                                    setData('gambar2', null);
                                    return;
                                }

                                setFileErrors(prev => ({
                                    ...prev,
                                    gambar2: null,
                                }));

                                setData('gambar2', file || null);
                            }}
                        />

                        {!previewGambar2 && (
                            <small style={{ color: '#888' }}>
                                Format: JPG / PNG, maksimal 2MB
                            </small>
                        )}

                        {fileErrors.gambar2 && (
                            <div style={{ color: 'red' }}>
                                {fileErrors.gambar2}
                            </div>
                        )}

                        {previewGambar2 && (
                            <img
                                src={previewGambar2}
                                width="100"
                                style={{ marginTop: '10px', borderRadius: '8px' }}
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>

                </form>
            </div>
        </MainLayout>
    );
}