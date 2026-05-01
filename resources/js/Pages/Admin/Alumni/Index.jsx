import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess, notifyActionError } from '@/Helpers/actionPopup';

export default function AdminAlumniIndex({ alumni, jurusanList, filters }) {
    const [showImport, setShowImport] = useState(false);
    const importForm = useForm({ file: null, tahun_lulus: '' });

    const handleDelete = async (id, nama) => {
        if (!(await confirmAction(`hapus data ${nama}`))) return;
        router.delete(`/admin/alumni/${id}`, {
            onSuccess: () => notifyActionSuccess('hapus siswa/alumni'),
        });
    };

    const handleResetPassword = async (id, nama) => {
        if (!(await confirmAction(`reset password ${nama} ke NISN`))) return;
        router.post(`/admin/alumni/${id}/reset-password`, {}, {
            onSuccess: () => notifyActionSuccess('reset password'),
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        router.get('/admin/alumni', {
            search: form.get('search'),
            tahun_lulus: form.get('tahun_lulus'),
            jurusan: form.get('jurusan'),
        }, { preserveState: true, preserveScroll: true });
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (!importForm.data.tahun_lulus) {
            notifyActionError('Isi Tahun Lulus terlebih dahulu!');
            return;
        }
        if (!importForm.data.file) {
            notifyActionError('Pilih file Excel terlebih dahulu!');
            return;
        }
        if (!(await confirmAction('import data dari Excel'))) return;
        importForm.post('/admin/alumni/import', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                notifyActionSuccess('import data siswa/alumni');
                setShowImport(false);
                importForm.reset();
            },
        });
    };

    const cards = useMemo(() => (alumni?.data ? alumni.data : (Array.isArray(alumni) ? alumni : [])), [alumni]);
    const links = alumni?.links || [];
    const from = alumni?.from || 0;
    const to = alumni?.to || 0;
    const total = alumni?.total || 0;

    const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' };
    const btnPrimary = { padding: '8px 18px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' };
    const btnSuccess = { ...btnPrimary, background: '#16a34a' };
    const btnWarning = { ...btnPrimary, background: '#f59e0b', fontSize: '12px', padding: '5px 10px' };
    const btnDanger = { ...btnPrimary, background: '#ef4444', fontSize: '12px', padding: '5px 10px' };
    const btnSecondary = { ...btnPrimary, background: '#64748b' };

    return (
        <MainLayout>
            <Head title="CRUD Siswa/Alumni" />
            <div className="header-bar"><a href="#">CRUD / Siswa/Alumni</a></div>

            <div style={{ padding: '20px' }}>
                {/* FILTER */}
                <div className="search-container" style={{ margin: '15px 0' }}>
                    <form className="search" onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px', padding: '10px 20px', width: 'fit-content', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <label htmlFor="search-alumni" style={{ margin: 0, fontWeight: 600 }}>Pencarian:</label>
                        <input
                            id="search-alumni"
                            type="text"
                            name="search"
                            placeholder="Cari nama/NISN..."
                            defaultValue={filters?.search || ''}
                            style={{ ...inputStyle, width: '200px' }}
                        />
                        <input
                            type="number"
                            name="tahun_lulus"
                            placeholder="Thn Lulus..."
                            defaultValue={filters?.tahun_lulus || ''}
                            style={{ ...inputStyle, width: '130px' }}
                        />
                        <select name="jurusan" defaultValue={filters?.jurusan || ''} style={{ ...inputStyle, width: 'auto', minWidth: '180px' }}>
                            <option value="">Semua Jurusan</option>
                            {jurusanList?.map(j => (
                                <option key={j.id_jurusan} value={j.id_jurusan}>{j.jurusan}</option>
                            ))}
                        </select>
                        <button type="submit" style={btnPrimary}>
                            <i className="fa-solid fa-magnifying-glass"></i> Filter
                        </button>
                    </form>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <Link href="/admin/alumni/create" style={btnPrimary}>
                        <i className="fa-solid fa-plus"></i> Tambah Manual
                    </Link>
                    <button type="button" onClick={() => setShowImport(!showImport)} style={btnSuccess}>
                        <i className="fa-solid fa-file-excel"></i> Import Excel
                    </button>
                    <a href="/admin/alumni/template" style={btnSecondary}>
                        <i className="fa-solid fa-download"></i> Download Template
                    </a>
                </div>

                {/* IMPORT MODAL */}
                {showImport && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
                        <h4 style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '16px' }}>
                            <i className="fa-solid fa-file-import" style={{ marginRight: '8px' }}></i>
                            Import Data Siswa/Alumni dari Excel
                        </h4>
                        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '12px', fontSize: '13px', lineHeight: 1.7 }}>
                            <strong>Ketentuan kolom yang harus ada di file Excel:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                                {['nama', 'nisn', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'nik', 'agama', 'alamat', 'jurusan', 'rt', 'rw', 'dusun', 'kelurahan', 'kecamatan', 'kode_pos', 'email', 'no_wa'].map(col => (
                                    <span key={col} style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px' }}>
                                        {col} <span style={{ color: '#ef4444' }}>*</span>
                                    </span>
                                ))}
                            </div>
                            <p style={{ margin: '8px 0 0 0', color: '#6b7280' }}>
                                <i className="fa-solid fa-info-circle" style={{ marginRight: '4px' }}></i>
                                Password otomatis = NISN. NISN yang sudah ada akan dilewati.
                            </p>
                        </div>
                        <form onSubmit={handleImport} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="number"
                                placeholder="Thn Lulus"
                                required
                                value={importForm.data.tahun_lulus}
                                onChange={e => importForm.setData('tahun_lulus', e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', width: '110px' }}
                            />
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={e => importForm.setData('file', e.target.files[0])}
                                style={{ flex: 1, fontSize: '13px' }}
                            />
                            <button type="submit" disabled={importForm.processing} style={btnSuccess}>
                                {importForm.processing ? 'Mengimpor...' : 'Import'}
                            </button>
                            <button type="button" onClick={() => setShowImport(false)} style={{ ...btnSecondary, background: '#94a3b8' }}>Tutup</button>
                        </form>
                    </div>
                )}

                {/* INFO */}
                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
                    Menampilkan {from}-{to} dari {total} data
                </p>

                {/* TABLE */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '10px 12px' }}>No</th>
                                <th style={{ padding: '10px 12px' }}>Nama</th>
                                <th style={{ padding: '10px 12px' }}>NISN</th>
                                <th style={{ padding: '10px 12px' }}>Tahun Lulus</th>
                                <th style={{ padding: '10px 12px' }}>Jurusan</th>
                                <th style={{ padding: '10px 12px' }}>JK</th>
                                <th style={{ padding: '10px 12px' }}>No WA</th>
                                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Belum ada data siswa/alumni.</td></tr>
                            ) : (
                                cards.map((item, idx) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '10px 12px' }}>{from + idx}</td>
                                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.nama}</td>
                                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{item.nisn}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            {item.tahun_lulus && (
                                                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                                    {item.tahun_lulus}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>{item.jurusan?.jurusan || '-'}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{ background: item.jenis_kelamin === 'L' ? '#dbeafe' : '#fce7f3', color: item.jenis_kelamin === 'L' ? '#1e40af' : '#be185d', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                                {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>{item.no_wa || '-'}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                <Link href={`/admin/alumni/${item.id}/edit`} style={btnWarning}>
                                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                                </Link>
                                                <button onClick={() => handleResetPassword(item.id, item.nama)} style={{ ...btnPrimary, fontSize: '12px', padding: '5px 10px', background: '#8b5cf6' }}>
                                                    <i className="fa-solid fa-key"></i> Reset
                                                </button>
                                                <button onClick={() => handleDelete(item.id, item.nama)} style={btnDanger}>
                                                    <i className="fa-solid fa-trash"></i> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    border: link.active ? '2px solid #134CBC' : '1px solid #d1d5db',
                                    background: link.active ? '#134CBC' : '#fff',
                                    color: link.active ? '#fff' : (link.url ? '#333' : '#ccc'),
                                    fontWeight: link.active ? 'bold' : 'normal',
                                    cursor: link.url ? 'pointer' : 'default',
                                    fontSize: '13px',
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
