import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { validateImage } from '@/Helpers/fileHelper';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function AdminJurusanEdit({ jurusan }) {

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        jurusan: jurusan.jurusan || '',
        deskripsi: jurusan.deskripsi || '',
        prospek_kerja: jurusan.prospek_kerja || '',
        gambar1: null,
        gambar2: null,
    });

    const [fileErrors, setFileErrors] = useState({
        gambar1: null,
        gambar2: null,
    });

    const [previewGambar1, setPreviewGambar1] = useState(
        jurusan.gambar1
            ? `/storage/uploads/jurusan/${jurusan.gambar1}`
            : null
    );

    const [previewGambar2, setPreviewGambar2] = useState(
        jurusan.gambar2
            ? `/storage/uploads/jurusan/${jurusan.gambar2}`
            : null
    );

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

        if (!(await confirmAction('update jurusan'))) return;

        post(`/admin/jurusan/${jurusan.id_jurusan}`, {
            forceFormData: true,
            onSuccess: () => {
                notifyActionSuccess('update jurusan');
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Edit Jurusan" />

            <div className="header-bar">
                <a href="#">CRUD / Edit Jurusan</a>
            </div>

            <div className="crud-form">

                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>
                    Edit Jurusan
                </h2>

                <form onSubmit={submit}>

                    <div className="form-group">
                        <label>
                            Nama Jurusan <span style={{ color: 'red' }}>*</span>
                        </label>

                        <input
                            value={data.jurusan}
                            onChange={e => setData('jurusan', e.target.value)}
                            required
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
                        />

                        {errors.prospek_kerja && (
                            <div style={{ color: 'red', fontSize: '12px' }}>
                                {errors.prospek_kerja}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            Gambar 1
                        </label>

                        <input
                            type="file"
                            accept="image/*"
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

                        <small style={{ color: '#888' }}>
                            Kosongkan jika tidak ingin mengganti gambar
                        </small>

                        {fileErrors.gambar1 && (
                            <div style={{ color: 'red' }}>
                                {fileErrors.gambar1}
                            </div>
                        )}

                        {previewGambar1 && (
                            <img
                                src={previewGambar1}
                                alt="Preview Gambar 1"
                                style={{
                                    maxWidth: '200px',
                                    marginTop: '10px',
                                    borderRadius: '8px',
                                }}
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            Gambar 2
                        </label>

                        <input
                            type="file"
                            accept="image/*"
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

                        <small style={{ color: '#888' }}>
                            Kosongkan jika tidak ingin mengganti gambar
                        </small>

                        {fileErrors.gambar2 && (
                            <div style={{ color: 'red' }}>
                                {fileErrors.gambar2}
                            </div>
                        )}

                        {previewGambar2 && (
                            <img
                                src={previewGambar2}
                                alt="Preview Gambar 2"
                                style={{
                                    maxWidth: '200px',
                                    marginTop: '10px',
                                    borderRadius: '8px',
                                }}
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={processing}
                    >
                        {processing ? 'Mengupdate...' : 'Update'}
                    </button>

                </form>
            </div>
        </MainLayout>
    );
}