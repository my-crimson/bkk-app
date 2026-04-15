import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { validateImage } from '@/Helpers/fileHelper';

export default function AdminPerusahaanEdit({ perusahaan }) {
    const { data, setData, put, processing } = useForm({
        nama: perusahaan.nama || '', alamat: perusahaan.alamat || '', kota: perusahaan.kota || '',
        deskripsi_perusahaan: perusahaan.deskripsi_perusahaan || '', email: perusahaan.email || '', kontak: perusahaan.kontak || '',
        standar: perusahaan.standar || '', kategori: perusahaan.kategori || '',
        kerja_sama: perusahaan.kerja_sama || '',
    });

    const [fileErrors, setFileErrors] = useState({
        logo: null,
        gambar: null,
    });

    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewGambar, setPreviewGambar] = useState(null);

    // ================= PREVIEW =================
    useEffect(() => {
        if (data.logo) {
            const url = URL.createObjectURL(data.logo);
            setPreviewLogo(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.logo]);

    useEffect(() => {
        if (data.gambar) {
            const url = URL.createObjectURL(data.gambar);
            setPreviewGambar(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.gambar]);

    // ================= SUBMIT =================
    const submit = (e) => {
        e.preventDefault();

        if (fileErrors.logo || fileErrors.gambar) {
            alert('Perbaiki error pada file terlebih dahulu!');
            return;
        }

        post(`/admin/perusahaan/${perusahaan.id_perusahaan}`, {
            _method: 'put',
            forceFormData: true
        });
    };

    const jenisOptions = ['UMKM', 'MOU', 'Perseroan', 'Startup'];
    const skalaOptions = ['Lokal', 'Provinsi', 'Nasional', 'Internasional'];

    return (
        <MainLayout>
            <Head title="Edit Perusahaan" />

            <div className="crud-form">
                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>
                    Edit Perusahaan
                </h2>

                <form onSubmit={submit}>
<<<<<<< HEAD

                    {/* NAMA */}
                    <div className="form-group">
                        <label>Nama</label>
                        <input
                            value={data.nama_perusahaan}
                            onChange={e => setData('nama_perusahaan', e.target.value)}
                            required
                        />
                        {errors.nama_perusahaan && (
                            <div style={{ color: 'red' }}>{errors.nama_perusahaan}</div>
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

                    {/* TELEPON */}
                    <div className="form-group">
                        <label>Telepon</label>
                        <input
                            value={data.telepon}
                            onChange={e => setData('telepon', e.target.value)}
                        />
                    </div>

                    {/* WEBSITE */}
                    <div className="form-group">
                        <label>Website</label>
                        <input
                            value={data.website}
                            onChange={e => setData('website', e.target.value)}
                        />
                    </div>

                    {/* JENIS */}
                    <div className="form-group">
                        <label>Jenis</label>
                        <select
                            value={data.jenis_perusahaan}
                            onChange={e => setData('jenis_perusahaan', e.target.value)}
                        >
                            <option value="">-- Pilih Jenis --</option>
                            {jenisOptions.map(j => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </select>
                    </div>

                    {/* SKALA */}
                    <div className="form-group">
                        <label>Skala</label>
                        <select
                            value={data.skala}
                            onChange={e => setData('skala', e.target.value)}
                        >
                            <option value="">-- Pilih Skala --</option>
                            {skalaOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* DESKRIPSI */}
                    <div className="form-group">
                        <label>Deskripsi</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={e => setData('deskripsi', e.target.value)}
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
                                    setData('logo', null);
                                    e.target.value = null;
                                    return;
                                }

                                setFileErrors(prev => ({ ...prev, logo: null }));
                                setData('logo', file);
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
                                    setData('gambar', null);
                                    e.target.value = null;
                                    return;
                                }

                                setFileErrors(prev => ({ ...prev, gambar: null }));
                                setData('gambar', file);
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

=======
                    <div className="form-group"><label>Nama</label><input value={data.nama} onChange={e => setData('nama', e.target.value)} required /></div>
                    <div className="form-group"><label>Alamat</label><input value={data.alamat} onChange={e => setData('alamat', e.target.value)} /></div>
                    <div className="form-group"><label>Kota</label><input value={data.kota} onChange={e => setData('kota', e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} /></div>
                    <div className="form-group"><label>Kontak</label><input value={data.kontak} onChange={e => setData('kontak', e.target.value)} /></div>
                    <div className="form-group"><label>Standar</label>
                        <select value={data.standar} onChange={e => setData('standar', e.target.value)}>
                            <option value="">-- Pilih --</option>
                            <option value="umkm">UMKM</option>
                            <option value="mou">MOU</option>
                            <option value="startup">Startup</option>
                            <option value="perseroan">Perseroan</option>
                        </select>
                    </div>
                    <div className="form-group"><label>Kategori</label>
                        <select value={data.kategori} onChange={e => setData('kategori', e.target.value)}>
                            <option value="">-- Pilih --</option>
                            <option value="lokal">Lokal</option>
                            <option value="provinsi">Provinsi</option>
                            <option value="nasional">Nasional</option>
                            <option value="internasional">Internasional</option>
                        </select>
                    </div>
                    <div className="form-group"><label>Deskripsi</label><textarea value={data.deskripsi_perusahaan} onChange={e => setData('deskripsi_perusahaan', e.target.value)}></textarea></div>
                    <div className="form-group"><label>Kerjasama</label><textarea value={data.kerja_sama} onChange={e => setData('kerja_sama', e.target.value)}></textarea></div>
                    <button type="submit" className="btn-submit" disabled={processing}>Update</button>
>>>>>>> remotes/origin/main
                </form>
            </div>
        </MainLayout>
    );
}