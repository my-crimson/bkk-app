import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { validateImage } from '@/Helpers/fileHelper';

export default function AdminPerusahaanCreate() {
    const { data, setData, post, processing, reset, errors } = useForm({
        nama: '', alamat: '', deskripsi: '', email: '', kontak: '',
        logo: null, gambar: null, jenis: '', skala: '', kerja_sama: '',
    });

    const [fileErrors, setFileErrors] = useState({ logo: null, gambar: null });
    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewGambar, setPreviewGambar] = useState(null);

    useEffect(() => {
        if (!data.logo) return;
        const url = URL.createObjectURL(data.logo);
        setPreviewLogo(url);
        return () => URL.revokeObjectURL(url);
    }, [data.logo]);

    useEffect(() => {
        if (!data.gambar) return;
        const url = URL.createObjectURL(data.gambar);
        setPreviewGambar(url);
        return () => URL.revokeObjectURL(url);
    }, [data.gambar]);

    const submit = (e) => {
        e.preventDefault();
        if (fileErrors.logo || fileErrors.gambar) return;

        post('/admin/perusahaan', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviewLogo(null);
                setPreviewGambar(null);
                setFileErrors({ logo: null, gambar: null });
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Tambah Perusahaan" />
            <div className="header-bar"><a href="#">CRUD / Tambah Perusahaan</a></div>
            <div className="crud-form">
                <h3 style={{ marginBottom: '15px', color: '#134CBC' }}>Tambah Perusahaan</h3>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label>Nama Perusahaan</label>
                        <input value={data.nama} onChange={e => setData('nama', e.target.value)} required />
                        {errors.nama && <div style={{ color: 'red', fontSize: '12px' }}>{errors.nama}</div>}
                    </div>
                    <div className="form-group"><label>Alamat</label><input value={data.alamat} onChange={e => setData('alamat', e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input value={data.email} onChange={e => setData('email', e.target.value)} /></div>
                    <div className="form-group"><label>Kontak</label><input value={data.kontak} onChange={e => setData('kontak', e.target.value)} /></div>
                    <div className="form-group">
                        <label>Jenis Perusahaan</label>
                        <select value={data.jenis} onChange={e => setData('jenis', e.target.value)}>
                            <option value="">-- Pilih Jenis --</option>
                            <option value="UMKM">UMKM</option>
                            <option value="MOU">MOU</option>
                            <option value="perseroan">Perseroan</option>
                            <option value="Startup">Startup</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Skala</label>
                        <select value={data.Skala} onChange={e => setData('Skala', e.target.value)}>
                            <option value="">-- Pilih Skala --</option>
                            <option value="lokal">Lokal</option>
                            <option value="Provinsi">Provinsi</option>
                            <option value="Nasional">Nasional</option>
                            <option value="Internasional">Internasional</option>
                        </select>
                    </div>
                    <div className="form-group"><label>Deskripsi</label><textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} /></div>
                    <div className="form-group"><label>Kerja Sama</label><input value={data.kerja_sama} onChange={e => setData('kerja_sama', e.target.value)} /></div>
                    <div className="form-group">
                        <label>Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files?.[0];
                                const error = validateImage(file, 'Logo');
                                if (error) {
                                    setFileErrors(prev => ({ ...prev, logo: error }));
                                    setData('logo', null);
                                    return;
                                }
                                setFileErrors(prev => ({ ...prev, logo: null }));
                                setData('logo', file || null);
                            }}
                        />
                        {!previewLogo && (
                            <small style={{ color: '#888' }}>
                                Format: JPG / PNG, maksimal 2MB
                            </small>
                        )}
                        {fileErrors.logo && <div style={{ color: 'red' }}>{fileErrors.logo}</div>}
                        {previewLogo && <img src={previewLogo} width="80" style={{ marginTop: '10px' }} />}
                    </div>
                    <div className="form-group">
                        <label>Gambar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files?.[0];
                                const error = validateImage(file, 'Gambar');
                                if (error) {
                                    setFileErrors(prev => ({ ...prev, gambar: error }));
                                    setData('gambar', null);
                                    return;
                                }
                                setFileErrors(prev => ({ ...prev, gambar: null }));
                                setData('gambar', file || null);
                            }}
                        />
                        {!previewGambar && (
                            <small style={{ color: '#888' }}>
                                Format: JPG / PNG, maksimal 2MB
                            </small>
                        )}
                        {fileErrors.gambar && <div style={{ color: 'red' }}>{fileErrors.gambar}</div>}
                        {previewGambar && <img src={previewGambar} width="80" style={{ marginTop: '10px' }} />}
                    </div>
                    <button type="submit" className="btn-submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}
