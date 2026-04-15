import { Head, useForm, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { validateImage } from '@/Helpers/fileHelper';

export default function AdminPerusahaanEdit({ perusahaan }) {
    const { data, setData, processing, errors } = useForm({
        _method: 'PUT',
        nama: perusahaan.nama || '',
        alamat: perusahaan.alamat || '',
        kota: perusahaan.kota || '',
        deskripsi_perusahaan: perusahaan.deskripsi_perusahaan || '',
        email: perusahaan.email || '',
        kontak: perusahaan.kontak || '',
        standar: perusahaan.standar || '',
        kategori: perusahaan.kategori || '',
        kerja_sama: perusahaan.kerja_sama || '',
    });

    const [fileErrors, setFileErrors] = useState({
        logo: null,
        gambar: null,
    });

    const [logoFile, setLogoFile] = useState(null);
    const [gambarFile, setGambarFile] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewGambar, setPreviewGambar] = useState(null);

    // ================= PREVIEW =================
    useEffect(() => {
        if (logoFile) {
            const url = URL.createObjectURL(logoFile);
            setPreviewLogo(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [logoFile]);

    useEffect(() => {
        if (gambarFile) {
            const url = URL.createObjectURL(gambarFile);
            setPreviewGambar(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [gambarFile]);

    // ================= SUBMIT =================
    const submit = (e) => {
        e.preventDefault();

        if (fileErrors.logo || fileErrors.gambar) {
            alert('Perbaiki error pada file terlebih dahulu!');
            return;
        }

        const formData = { ...data };
        if (logoFile) formData.logo = logoFile;
        if (gambarFile) formData.gambar = gambarFile;

        router.post(`/admin/perusahaan/${perusahaan.id_perusahaan}`, formData, {
            forceFormData: true,
        });
    };

    const standarOptions = ['UMKM', 'MOU', 'perseroan', 'Startup'];
    const kategoriOptions = ['lokal', 'Provinsi', 'Nasional', 'Internasional'];

    return (
        <MainLayout>
            <Head title="Edit Perusahaan" />

            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>
                    Edit Perusahaan
                </h2>

                <form onSubmit={submit}>

                    {/* NAMA */}
                    <div className="form-group">
                        <label>Nama</label>
                        <input
                            value={data.nama}
                            onChange={e => setData('nama', e.target.value)}
                            required
                        />
                        {errors.nama && (
                            <div style={{ color: 'red', fontSize: '12px' }}>{errors.nama}</div>
                        )}
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

                    {/* KONTAK */}
                    <div className="form-group">
                        <label>Kontak</label>
                        <input
                            value={data.kontak}
                            onChange={e => setData('kontak', e.target.value)}
                        />
                    </div>

                    {/* KOTA */}
                    <div className="form-group">
                        <label>Kota</label>
                        <input
                            value={data.kota}
                            onChange={e => setData('kota', e.target.value)}
                        />
                    </div>

                    {/* STANDAR */}
                    <div className="form-group">
                        <label>Standar</label>
                        <select
                            value={data.standar}
                            onChange={e => setData('standar', e.target.value)}
                        >
                            <option value="">-- Pilih Standar --</option>
                            {standarOptions.map(j => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </select>
                    </div>

                    {/* KATEGORI */}
                    <div className="form-group">
                        <label>Kategori</label>
                        <select
                            value={data.kategori}
                            onChange={e => setData('kategori', e.target.value)}
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {kategoriOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* DESKRIPSI */}
                    <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea
                            value={data.deskripsi_perusahaan}
                            onChange={e => setData('deskripsi_perusahaan', e.target.value)}
                        />
                    </div>

                    {/* KERJA SAMA */}
                    <div className="form-group">
                        <label>Kerja Sama</label>
                        <input
                            value={data.kerja_sama}
                            onChange={e => setData('kerja_sama', e.target.value)}
                        />
                    </div>

                    {/* LOGO */}
                    <div className="form-group">
                        <label>Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const error = validateImage(file, 'Logo');

                                if (error) {
                                    setFileErrors(prev => ({ ...prev, logo: error }));
                                    setLogoFile(null);
                                    e.target.value = null;
                                    return;
                                }

                                setFileErrors(prev => ({ ...prev, logo: null }));
                                setLogoFile(file);
                            }}
                        />

                        {fileErrors.logo && (
                            <div style={{ color: 'red' }}>{fileErrors.logo}</div>
                        )}

                        {!previewLogo && perusahaan.logo && (
                            <img
                                src={`/storage/logo_perusahaan/${perusahaan.logo}`}
                                width="80"
                                style={{ marginTop: '10px' }}
                            />
                        )}

                        {previewLogo && (
                            <img src={previewLogo} width="80" style={{ marginTop: '10px' }} />
                        )}
                    </div>

                    {/* GAMBAR */}
                    <div className="form-group">
                        <label>Gambar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const error = validateImage(file, 'Gambar');

                                if (error) {
                                    setFileErrors(prev => ({ ...prev, gambar: error }));
                                    setGambarFile(null);
                                    e.target.value = null;
                                    return;
                                }

                                setFileErrors(prev => ({ ...prev, gambar: null }));
                                setGambarFile(file);
                            }}
                        />

                        {fileErrors.gambar && (
                            <div style={{ color: 'red' }}>{fileErrors.gambar}</div>
                        )}

                        {!previewGambar && perusahaan.gambar && (
                            <img
                                src={`/storage/gambar_perusahaan/${perusahaan.gambar}`}
                                width="100"
                                style={{ marginTop: '10px' }}
                            />
                        )}

                        {previewGambar && (
                            <img src={previewGambar} width="100" style={{ marginTop: '10px' }} />
                        )}
                    </div>

                    <button type="submit" disabled={processing}
                            style={{
                                padding: '5px 10px',
                                fontSize: '12px',
                                background: '#134CBC',
                                color: '#fff',
                                borderRadius: '4px',
                                border: 'none'
                            }}>
                        {processing ? 'Mengupdate...' : 'Update'}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}