import { Head, router, useForm, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { validateImage } from '@/Helpers/fileHelper';

export default function AdminPerusahaanIndex({ perusahaan }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        nama: '', alamat: '', kota: '', deskripsi_perusahaan: '', email: '', kontak: '',
        gambar: '', standar: '', kategori: '', kerja_sama: '',
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

        post('/admin/perusahaan', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setData('logo', null);
                setData('gambar', null);
                setPreviewLogo(null);
                setPreviewGambar(null);
                setFileErrors({ logo: null, gambar: null });
            },
        });
    };

    // ================= DELETE =================
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus?')) {
            router.delete(`/admin/perusahaan/${id}`);
        }
    };

    return (
        <MainLayout>
            <Head title="CRUD Perusahaan" />

            <div className="header-bar">
                <a href="#">CRUD / Perusahaan</a>
            </div>

            {/* ================= FORM ================= */}
            <div className="crud-form">
                <h3 style={{ marginBottom: '15px', color: '#134CBC' }}>
                    Tambah Perusahaan
                </h3>

                <form onSubmit={submit}>
<<<<<<< HEAD
                    <div className="form-group">
                        <label>Nama Perusahaan</label>
                        <input
                            value={data.nama_perusahaan}
                            onChange={e => setData('nama_perusahaan', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Alamat</label>
                        <input
                            value={data.alamat}
                            onChange={e => setData('alamat', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Telepon</label>
                        <input
                            value={data.telepon}
                            onChange={e => setData('telepon', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Website</label>
                        <input
                            value={data.website}
                            onChange={e => setData('website', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Jenis</label>
                        <select
                            value={data.jenis_perusahaan}
                            onChange={e => setData('jenis_perusahaan', e.target.value)}
                        >
                            <option value="">-- Pilih Jenis --</option>
                            <option value="UMKM">UMKM</option>
                            <option value="MOU">MOU</option>
                            <option value="Perseroan">Perseroan</option>
                            <option value="Startup">Startup</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Skala</label>
                        <select
                            value={data.skala}
                            onChange={e => setData('skala', e.target.value)}
                        >
                            <option value="">-- Pilih Skala --</option>
                            <option value="Lokal">Lokal</option>
                            <option value="Provinsi">Provinsi</option>
                            <option value="Nasional">Nasional</option>
                            <option value="Internasional">Internasional</option>
                        </select>
                    </div>

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
                                const error = validateImage(file, 'Logo');

                                if (error) {
                                    setFileErrors(prev => ({ ...prev, logo: error }));
                                    setData('logo', null);
                                    return;
                                }

                                setFileErrors(prev => ({ ...prev, logo: null }));
                                setData('logo', file);
                            }}
                        />
                        {fileErrors.logo && (
                            <div style={{ color: 'red' }}>{fileErrors.logo}</div>
                        )}

                        {!previewLogo && (
                            <small style={{ color: '#888' }}>
                                Max 2MB (jpg, jpeg, png)
                            </small>
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
                                const error = validateImage(file, 'Gambar');

                                if (error) {
                                    setFileErrors(prev => ({ ...prev, gambar: error }));
                                    setData('gambar', null);
                                    return;
                                }

                                setFileErrors(prev => ({ ...prev, gambar: null }));
                                setData('gambar', file);
                            }}
                        />
                        {fileErrors.gambar && (
                            <div style={{ color: 'red' }}>{fileErrors.gambar}</div>
                        )}

                        {!previewGambar && (
                            <small style={{ color: '#888' }}>
                                Max 2MB (jpg, jpeg, png)
                            </small>
                        )}

                        {previewGambar && (
                            <img src={previewGambar} width="80" style={{ marginTop: '10px' }} />
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
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>

=======
                    <div className="form-group"><label>Nama Perusahaan*</label><input value={data.nama} onChange={e => setData('nama', e.target.value)} required /></div>
                    <div className="form-group"><label>Alamat</label><input value={data.alamat} onChange={e => setData('alamat', e.target.value)} /></div>
                    <div className="form-group"><label>Kota</label><input value={data.kota} onChange={e => setData('kota', e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} /></div>
                    <div className="form-group"><label>Kontak (No. Telepon)</label><input value={data.kontak} onChange={e => setData('kontak', e.target.value)} /></div>
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
                    <button type="submit" className="btn-submit" disabled={processing}>Simpan</button>
>>>>>>> remotes/origin/main
                </form>
            </div>

            {/* ================= TABLE ================= */}
            <div className="rekap-container">
                <table className="rekap-table">
<<<<<<< HEAD
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Alamat</th>
                            <th>Email</th>
                            <th>Telepon</th>
                            <th>Logo</th>
                            <th>Gambar</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>

=======
                    <thead><tr><th>No</th><th>Nama</th><th>Alamat</th><th>Email</th><th>Kontak</th><th>Standar</th><th>Aksi</th></tr></thead>
>>>>>>> remotes/origin/main
                    <tbody>
                        {perusahaan.data.map((p, i) => (
                            <tr key={p.id_perusahaan}>
<<<<<<< HEAD
                                <td>{(perusahaan.current_page - 1) * perusahaan.per_page + i + 1}</td>
                                <td>{p.nama_perusahaan}</td>
                                <td>{p.alamat || '-'}</td>
                                <td>{p.email || '-'}</td>
                                <td>{p.telepon || '-'}</td>

=======
                                <td>{i + 1}</td><td>{p.nama}</td><td>{p.alamat || '-'}</td><td>{p.email || '-'}</td><td>{p.kontak || '-'}</td><td>{p.standar || '-'}</td>
>>>>>>> remotes/origin/main
                                <td>
                                    <img
                                        src={p.logo
                                            ? `/storage/logo_perusahaan/${p.logo}`
                                            : '/default-logo.png'}
                                        width="50"
                                    />
                                </td>

                                <td>
                                    <img
                                        src={p.gambar
                                            ? `/storage/gambar_perusahaan/${p.gambar}`
                                            : '/default-gambar.png'}
                                        width="70"
                                    />
                                </td>

                                <td>
                                    <Link href={`/admin/perusahaan/${p.id_perusahaan}/edit`}
                                        className="edit-button"
                                        style={{
                                            padding: '5px 10px',
                                            fontSize: '12px',
                                            marginRight: '5px',
                                            background: '#4CAF50',
                                            color: '#fff',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            border: 'none'
                                        }}>
                                        Edit
                                    </Link>

                                    <button onClick={() => handleDelete(p.id_perusahaan)}
                                        style={{
                                            padding: '5px 10px',
                                            fontSize: '12px',
                                            background: '#dc3545',
                                            color: '#fff',
                                            borderRadius: '4px',
                                            border: 'none'
                                        }}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ================= PAGINATION ================= */}
                <div style={{ marginTop: '20px' }}>
                    {perusahaan.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            style={{
                                marginRight: '5px',
                                padding: '5px 10px',
                                background: link.active ? '#134CBC' : '#eee',
                                color: link.active ? '#fff' : '#000',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: link.url ? 'pointer' : 'not-allowed'
                            }}
                        />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}