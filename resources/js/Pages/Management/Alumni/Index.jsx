import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useMemo, useCallback } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess, notifyActionError } from '@/Helpers/actionPopup';

export default function ManagementAlumniIndex({ alumni, jurusanList, filters, management_users }) {
    const [activeTab, setActiveTab] = useState('alumni'); // 'alumni' or 'management'
    
    // === ALUMNI STATE & LOGIC ===
    const [showImport, setShowImport] = useState(false);
    const importForm = useForm({ file: null, tahun_lulus: '' });
    const [selectedIds, setSelectedIds] = useState([]);

    const handleDelete = async (id, nama) => {
        if (!(await confirmAction(`hapus data ${nama}`))) return;
        router.delete(`/management/alumni/${id}`, {
            onSuccess: () => notifyActionSuccess('hapus siswa/alumni'),
        });
    };

    const handleResetPassword = async (id, nama) => {
        if (!(await confirmAction(`reset password ${nama} ke NISN`))) return;
        router.post(`/management/alumni/${id}/reset-password`, {}, {
            onSuccess: () => notifyActionSuccess('reset password'),
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        setSelectedIds([]);
        router.get('/management/alumni', {
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
        importForm.post('/management/alumni/import', {
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

    const isAllSelected = cards.length > 0 && cards.every(item => selectedIds.includes(item.id));
    const toggleSelect = useCallback((id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }, []);
    const toggleSelectAll = useCallback(() => {
        if (isAllSelected) {
            setSelectedIds(prev => prev.filter(id => !cards.find(c => c.id === id)));
        } else {
            const currentPageIds = cards.map(c => c.id);
            setSelectedIds(prev => [...new Set([...prev, ...currentPageIds])]);
        }
    }, [isAllSelected, cards]);

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            notifyActionError('Pilih minimal 1 data untuk dihapus!');
            return;
        }
        if (!(await confirmAction(`hapus ${selectedIds.length} data siswa/alumni yang dipilih`))) return;
        router.post('/management/alumni/bulk-delete', { ids: selectedIds }, {
            onSuccess: () => {
                notifyActionSuccess(`hapus ${selectedIds.length} data siswa/alumni`);
                setSelectedIds([]);
            },
        });
    };

    // === MANAGEMENT USER LOGIC ===
    const userForm = useForm({ username: '', password: '' });
    const [editUserId, setEditUserId] = useState(null);

    const handleUserSubmit = (e) => {
        e.preventDefault();
        if (editUserId) {
            userForm.put(`/management/management-user/${editUserId}`, {
                onSuccess: () => {
                    notifyActionSuccess('update akun management');
                    setEditUserId(null);
                    userForm.reset();
                }
            });
        } else {
            userForm.post('/management/management-user', {
                onSuccess: () => {
                    notifyActionSuccess('tambah akun management');
                    userForm.reset();
                }
            });
        }
    };

    const handleEditUser = (user) => {
        setEditUserId(user.id);
        userForm.setData({ username: user.username, password: '' });
    };

    const handleDeleteUser = async (id, username) => {
        if (!(await confirmAction(`hapus akun management ${username}`))) return;
        router.delete(`/management/management-user/${id}`, {
            onSuccess: () => notifyActionSuccess('hapus akun management'),
        });
    };

    // === STYLES ===
    const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' };
    const btnPrimary = { padding: '8px 18px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' };
    const btnSuccess = { ...btnPrimary, background: '#16a34a' };
    const btnWarning = { ...btnPrimary, background: '#f59e0b', fontSize: '12px', padding: '5px 10px' };
    const btnDanger = { ...btnPrimary, background: '#ef4444', fontSize: '12px', padding: '5px 10px' };
    const btnSecondary = { ...btnPrimary, background: '#64748b' };
    const tabStyle = (active) => ({
        padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
        borderBottom: active ? '3px solid #134CBC' : '3px solid transparent',
        color: active ? '#134CBC' : '#64748b', transition: 'all 0.3s'
    });

    return (
        <MainLayout>
            <Head title="CRUD Siswa & Management" />
            <div className="header-bar"><a href="#">CRUD / Siswa & Management</a></div>

            {/* TAB NAVIGATION */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', padding: '0 20px', marginTop: '20px' }}>
                <div style={tabStyle(activeTab === 'alumni')} onClick={() => setActiveTab('alumni')}>
                    <i className="fa-solid fa-user-graduate" style={{ marginRight: '8px' }}></i>
                    Data Siswa / Alumni
                </div>
                <div style={tabStyle(activeTab === 'management')} onClick={() => setActiveTab('management')}>
                    <i className="fa-solid fa-user-tie" style={{ marginRight: '8px' }}></i>
                    Akun Management
                </div>
            </div>

            <div style={{ padding: '0 20px 20px 20px' }}>
                
                {/* ======================= TAB 1: ALUMNI ======================= */}
                {activeTab === 'alumni' && (
                    <>
                        {/* FILTER */}
                        <div className="search-container" style={{ margin: '15px 0' }}>
                            <form className="search" onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px', padding: '10px 20px', width: 'fit-content', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <label htmlFor="search-alumni" style={{ margin: 0, fontWeight: 600 }}>Pencarian:</label>
                                <input id="search-alumni" type="text" name="search" placeholder="Cari nama/NISN..." defaultValue={filters?.search || ''} style={{ ...inputStyle, width: '200px' }} />
                                <input type="number" name="tahun_lulus" placeholder="Thn Lulus..." defaultValue={filters?.tahun_lulus || ''} style={{ ...inputStyle, width: '130px' }} />
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
                            <Link href="/management/alumni/create" style={btnPrimary}>
                                <i className="fa-solid fa-plus"></i> Tambah Manual
                            </Link>
                            <button type="button" onClick={() => setShowImport(!showImport)} style={btnSuccess}>
                                <i className="fa-solid fa-file-excel"></i> Import Excel
                            </button>
                            <a href="/management/alumni/template" style={btnSecondary}>
                                <i className="fa-solid fa-download"></i> Download Template
                            </a>
                            {selectedIds.length > 0 && (
                                <button type="button" onClick={handleBulkDelete} style={{ ...btnPrimary, background: '#dc2626' }}>
                                    <i className="fa-solid fa-trash"></i> Hapus {selectedIds.length} Terpilih
                                </button>
                            )}
                        </div>

                        {/* IMPORT MODAL */}
                        {showImport && (
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
                                <h4 style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '16px' }}><i className="fa-solid fa-file-import" style={{ marginRight: '8px' }}></i>Import Data Siswa/Alumni</h4>
                                <form onSubmit={handleImport} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input type="number" placeholder="Thn Lulus" required value={importForm.data.tahun_lulus} onChange={e => importForm.setData('tahun_lulus', e.target.value)} style={{ ...inputStyle, width: '110px' }} />
                                    <input type="file" accept=".xlsx,.xls" required onChange={e => importForm.setData('file', e.target.files[0])} style={{ fontSize: '13px', flex: 1 }} />
                                    <button type="submit" disabled={importForm.processing} style={btnSuccess}>{importForm.processing ? 'Mengimpor...' : 'Import'}</button>
                                    <button type="button" onClick={() => setShowImport(false)} style={{ ...btnSecondary, background: '#94a3b8' }}>Tutup</button>
                                </form>
                            </div>
                        )}

                        {/* INFO */}
                        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
                            Menampilkan {from}-{to} dari {total} data
                            {selectedIds.length > 0 && <span style={{ marginLeft: '10px', background: '#dbeafe', color: '#1e40af', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>{selectedIds.length} dipilih</span>}
                        </p>

                        {/* TABLE ALUMNI */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                        <th style={{ padding: '10px 12px', width: '40px' }}><input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} style={{ cursor: 'pointer', width: '16px', height: '16px' }} /></th>
                                        <th style={{ padding: '10px 12px' }}>No</th>
                                        <th style={{ padding: '10px 12px' }}>Nama</th>
                                        <th style={{ padding: '10px 12px' }}>NISN</th>
                                        <th style={{ padding: '10px 12px' }}>Tahun Lulus</th>
                                        <th style={{ padding: '10px 12px' }}>Jurusan</th>
                                        <th style={{ padding: '10px 12px' }}>JK</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cards.length === 0 ? (
                                        <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Belum ada data siswa/alumni.</td></tr>
                                    ) : (
                                        cards.map((item, idx) => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', background: selectedIds.includes(item.id) ? '#eff6ff' : 'transparent' }}>
                                                <td style={{ padding: '10px 12px' }}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} style={{ cursor: 'pointer', width: '16px', height: '16px' }} /></td>
                                                <td style={{ padding: '10px 12px' }}>{from + idx}</td>
                                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.nama}</td>
                                                <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{item.nisn}</td>
                                                <td style={{ padding: '10px 12px' }}>{item.tahun_lulus}</td>
                                                <td style={{ padding: '10px 12px' }}>{item.jurusan?.jurusan || '-'}</td>
                                                <td style={{ padding: '10px 12px' }}>{item.jenis_kelamin}</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                        <Link href={`/management/alumni/${item.id}/edit`} style={btnWarning}><i className="fa-solid fa-pen-to-square"></i></Link>
                                                        <button onClick={() => handleResetPassword(item.id, item.nama)} style={{ ...btnPrimary, fontSize: '12px', padding: '5px 10px', background: '#8b5cf6' }} title="Reset Password"><i className="fa-solid fa-key"></i></button>
                                                        <button onClick={() => handleDelete(item.id, item.nama)} style={btnDanger}><i className="fa-solid fa-trash"></i></button>
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
                                        key={i} disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        style={{ padding: '6px 14px', borderRadius: '6px', border: link.active ? '2px solid #134CBC' : '1px solid #d1d5db', background: link.active ? '#134CBC' : '#fff', color: link.active ? '#fff' : (link.url ? '#333' : '#ccc'), cursor: link.url ? 'pointer' : 'default', fontSize: '13px' }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}


                {/* ======================= TAB 2: MANAGEMENT USERS ======================= */}
                {activeTab === 'management' && (
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        
                        {/* FORM CARD */}
                        <div style={{ flex: '1 1 300px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1e293b' }}>
                                {editUserId ? 'Edit Akun Management' : 'Tambah Akun Management'}
                            </h3>
                            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '14px', color: '#475569' }}>Username</label>
                                    <input 
                                        type="text" required 
                                        value={userForm.data.username} 
                                        onChange={e => userForm.setData('username', e.target.value)} 
                                        style={{ ...inputStyle, width: '100%' }} 
                                        placeholder="Masukkan username unik..."
                                    />
                                    {userForm.errors.username && <span style={{ color: '#ef4444', fontSize: '12px' }}>{userForm.errors.username}</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '14px', color: '#475569' }}>
                                        Password {editUserId && <span style={{ color: '#94a3b8', fontWeight: 'normal', fontSize: '12px' }}>(kosongkan jika tidak ingin diubah)</span>}
                                    </label>
                                    <input 
                                        type="password" required={!editUserId} 
                                        value={userForm.data.password} 
                                        onChange={e => userForm.setData('password', e.target.value)} 
                                        style={{ ...inputStyle, width: '100%' }} 
                                        placeholder="Minimal 6 karakter..."
                                    />
                                    {userForm.errors.password && <span style={{ color: '#ef4444', fontSize: '12px' }}>{userForm.errors.password}</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button type="submit" disabled={userForm.processing} style={{ ...btnPrimary, width: '100%', justifyContent: 'center' }}>
                                        <i className="fa-solid fa-save"></i> {editUserId ? 'Simpan Perubahan' : 'Tambah Akun'}
                                    </button>
                                    {editUserId && (
                                        <button type="button" onClick={() => { setEditUserId(null); userForm.reset(); }} style={btnSecondary}>
                                            Batal
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* TABLE LIST */}
                        <div style={{ flex: '2 1 500px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                        <th style={{ padding: '10px 12px' }}>No</th>
                                        <th style={{ padding: '10px 12px' }}>Username</th>
                                        <th style={{ padding: '10px 12px' }}>Role</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {management_users?.map((user, idx) => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '10px 12px' }}>{idx + 1}</td>
                                            <td style={{ padding: '10px 12px', fontWeight: 600 }}>{user.username}</td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                    <button onClick={() => handleEditUser(user)} style={btnWarning} title="Edit"><i className="fa-solid fa-pen"></i></button>
                                                    <button onClick={() => handleDeleteUser(user.id, user.username)} style={btnDanger} title="Hapus"><i className="fa-solid fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!management_users || management_users.length === 0) && (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Tidak ada data akun management.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                )}
            </div>
        </MainLayout>
    );
}
