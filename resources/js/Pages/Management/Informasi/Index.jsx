import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { notifyActionSuccess, notifyActionError, confirmAction } from '@/Helpers/actionPopup';

const DEFAULT_LEVELS = [
    { level: 1, label: 'Pelindung' },
    { level: 2, label: 'Pembina' },
    { level: 3, label: 'Penanggungjawab' },
    { level: 4, label: 'Ketua BKK' },
    { level: 5, label: 'Petugas' },
];

export default function InformasiIndex({ informasi, struktur }) {
    const [activeTab, setActiveTab] = useState('visi_misi');

    // =========== INFORMASI TEXT FORM ===========
    const formInfo = useForm({
        visi: informasi?.visi || '',
        misi: informasi?.misi || '',
        proker: informasi?.proker || '',
        tujuan: informasi?.tujuan || '',
        pengantar: informasi?.pengantar || '',
    });

    const submitInfo = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('simpan perubahan informasi'))) return;
        formInfo.put('/management/informasi', {
            preserveScroll: true,
            onSuccess: () => notifyActionSuccess('update informasi'),
        });
    };

    // =========== PENGANTAR PROFILE FORM ===========
    const formProfile = useForm({
        pengantar_nama: informasi?.pengantar_nama || '',
        pengantar_jabatan: informasi?.pengantar_jabatan || '',
        pengantar_nip: informasi?.pengantar_nip || '',
        pengantar_foto: null,
    });

    const submitProfile = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('simpan profil pengantar'))) return;
        formProfile.post('/management/informasi/pengantar-profile', {
            preserveScroll: true,
            onSuccess: () => notifyActionSuccess('update profil pengantar'),
        });
    };

    const [pengantarPreview, setPengantarPreview] = useState(
        informasi?.pengantar_foto ? `/storage/uploads/pengantar/${informasi.pengantar_foto}` : null
    );

    useEffect(() => {
        if (formProfile.data.pengantar_foto) {
            const url = URL.createObjectURL(formProfile.data.pengantar_foto);
            setPengantarPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [formProfile.data.pengantar_foto]);

    // =========== LEVEL OPTIONS ===========
    const savedLevels = informasi?.level_options;
    const [levelOptions, setLevelOptions] = useState(
        savedLevels && savedLevels.length > 0 ? savedLevels : DEFAULT_LEVELS
    );
    const [newLevelLabel, setNewLevelLabel] = useState('');
    const [newLevelNumber, setNewLevelNumber] = useState('');
    const [editingLevelKey, setEditingLevelKey] = useState(null);
    const [editLevelLabel, setEditLevelLabel] = useState('');
    const [editLevelNumber, setEditLevelNumber] = useState('');

    const addLevelOption = async () => {
        if (!newLevelLabel.trim() || !newLevelNumber) return;
        const num = parseInt(newLevelNumber, 10);
        if (isNaN(num) || num < 1) return;
        if (levelOptions.some(l => l.level === num)) {
            notifyActionError(`Level ${num} sudah digunakan. Hapus level tersebut terlebih dahulu atau gunakan nomor lain.`);
            return;
        }
        if (!(await confirmAction(`tambah level ${num} (${newLevelLabel.trim()})`))) return;
        const updated = [...levelOptions, { level: num, label: newLevelLabel.trim() }]
            .sort((a, b) => a.level - b.level);
        setLevelOptions(updated);
        setNewLevelLabel('');
        setNewLevelNumber('');
        router.put('/management/informasi/level-options', { level_options: updated }, {
            preserveScroll: true,
            onSuccess: () => notifyActionSuccess('tambah level'),
        });
    };

    const removeLevelOption = async (level) => {
        const opt = levelOptions.find(l => l.level === level);
        if (!(await confirmAction(`hapus level ${level} (${opt?.label || ''})`))) return;
        const updated = levelOptions.filter(l => l.level !== level);
        setLevelOptions(updated);
        router.put('/management/informasi/level-options', { level_options: updated }, {
            preserveScroll: true,
            onSuccess: () => notifyActionSuccess('hapus level'),
        });
    };

    const startEditLevel = (opt) => {
        setEditingLevelKey(opt.level);
        setEditLevelLabel(opt.label);
        setEditLevelNumber(String(opt.level));
    };

    const cancelEditLevel = () => {
        setEditingLevelKey(null);
        setEditLevelLabel('');
        setEditLevelNumber('');
    };

    const saveEditLevel = async () => {
        const num = parseInt(editLevelNumber, 10);
        if (isNaN(num) || num < 1 || !editLevelLabel.trim()) return;
        if (num !== editingLevelKey && levelOptions.some(l => l.level === num)) {
            notifyActionError(`Level ${num} sudah digunakan. Gunakan nomor lain.`);
            return;
        }
        if (!(await confirmAction(`update level menjadi ${num} (${editLevelLabel.trim()})`))) return;
        const updated = levelOptions
            .map(l => l.level === editingLevelKey ? { level: num, label: editLevelLabel.trim() } : l)
            .sort((a, b) => a.level - b.level);
        setLevelOptions(updated);
        setEditingLevelKey(null);
        setEditLevelLabel('');
        setEditLevelNumber('');
        router.put('/management/informasi/level-options', { level_options: updated }, {
            preserveScroll: true,
            onSuccess: () => notifyActionSuccess('update level'),
        });
    };

    // =========== STRUKTUR FORM ===========
    const [strukturId, setStrukturId] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]?.level || 1);
    const formStruktur = useForm({
        level: levelOptions[0]?.level || 1,
        jabatan: '',
        nama: '',
        nip: '',
        foto_profil: null,
    });

    const selectLevel = (level) => {
        setSelectedLevel(level);
        formStruktur.setData('level', level);
    };

    const editStruktur = (item) => {
        setStrukturId(item.id);
        setSelectedLevel(item.level);
        formStruktur.setData({
            level: item.level,
            jabatan: item.jabatan,
            nama: item.nama,
            nip: item.nip || '',
            foto_profil: null,
        });
    };

    const resetStruktur = () => {
        setStrukturId(null);
        setSelectedLevel(levelOptions[0]?.level || 1);
        formStruktur.reset();
    };

    const submitStruktur = async (e) => {
        e.preventDefault();
        const actionLabel = strukturId ? 'update anggota' : 'tambah anggota';
        if (!(await confirmAction(actionLabel))) return;
        const url = strukturId
            ? `/management/informasi/struktur/${strukturId}`
            : '/management/informasi/struktur';
        formStruktur.post(url, {
            preserveScroll: true,
            onSuccess: () => {
                notifyActionSuccess(actionLabel);
                resetStruktur();
            },
        });
    };

    const deleteStruktur = async (id) => {
        if (await confirmAction('hapus anggota')) {
            router.delete(`/management/informasi/struktur/${id}`, {
                preserveScroll: true,
                onSuccess: () => notifyActionSuccess('hapus anggota'),
            });
        }
    };

    // =========== TABS ===========
    const tabs = [
        { id: 'visi_misi', label: 'Visi & Misi', icon: 'fa-bullseye' },
        { id: 'proker', label: 'Program Kerja', icon: 'fa-list-check' },
        { id: 'tujuan', label: 'Tujuan', icon: 'fa-flag' },
        { id: 'pengantar', label: 'Pengantar', icon: 'fa-address-card' },
        { id: 'struktur', label: 'Struktur Organisasi', icon: 'fa-sitemap' },
    ];

    const textTabs = ['visi_misi', 'proker', 'tujuan'];

    const getLevelLabel = (level) => {
        const found = levelOptions.find(l => l.level === level);
        return found ? found.label : `Level ${level}`;
    };

    return (
        <MainLayout>
            <Head title="CRUD Informasi" />
            <div className="header-bar"><a href="#">C.R.U.D / CRUD Informasi</a></div>

            <div className="informasi-container">
                {/* TABS */}
                <div className="informasi-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="informasi-tab-btn"
                            style={{
                                borderColor: activeTab === tab.id ? '#134CBC' : '#d1d5db',
                                backgroundColor: activeTab === tab.id ? '#134CBC' : '#ffffff',
                                color: activeTab === tab.id ? '#fff' : '#555',
                            }}
                        >
                            <i className={`fa-solid ${tab.icon}`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT CARD */}
                <div style={{ background: '#fff', padding: 'clamp(15px, 3vw, 30px)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eaeaea', boxSizing: 'border-box', overflowX: 'auto', maxWidth: '100%' }}>

                    {/* ===== TEXT TABS (Visi Misi, Proker, Tujuan) ===== */}
                    {textTabs.includes(activeTab) && (
                        <form onSubmit={submitInfo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
                                <i className={`fa-solid ${tabs.find(t => t.id === activeTab)?.icon}`} style={{ marginRight: '8px', color: '#134CBC' }}></i>
                                Konten {tabs.find(t => t.id === activeTab)?.label}
                            </label>
                            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                                Pisahkan setiap alinea atau poin dengan menekan tombol Enter.
                            </p>
                            
                            {activeTab === 'visi_misi' ? (
                                <>
                                    <label style={{ fontWeight: 'bold', fontSize: '15px', color: '#555', marginTop: '10px' }}>Visi</label>
                                    <textarea
                                        value={formInfo.data.visi}
                                        onChange={e => formInfo.setData('visi', e.target.value)}
                                        style={{ width: '100%', height: '150px', padding: '15px', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'vertical', fontSize: '15px', lineHeight: '1.6', outline: 'none', boxSizing: 'border-box' }}
                                        placeholder="Tulis isi Visi di sini..."
                                    />
                                    
                                    <label style={{ fontWeight: 'bold', fontSize: '15px', color: '#555', marginTop: '10px' }}>Misi</label>
                                    <textarea
                                        value={formInfo.data.misi}
                                        onChange={e => formInfo.setData('misi', e.target.value)}
                                        style={{ width: '100%', height: '200px', padding: '15px', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'vertical', fontSize: '15px', lineHeight: '1.6', outline: 'none', boxSizing: 'border-box' }}
                                        placeholder="Tulis isi Misi di sini..."
                                    />
                                </>
                            ) : (
                                <textarea
                                    value={formInfo.data[activeTab]}
                                    onChange={e => formInfo.setData(activeTab, e.target.value)}
                                    style={{ width: '100%', height: '300px', padding: '15px', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'vertical', fontSize: '15px', lineHeight: '1.6', outline: 'none', boxSizing: 'border-box' }}
                                    placeholder={`Tulis isi ${tabs.find(t => t.id === activeTab)?.label} di sini...`}
                                />
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" disabled={formInfo.processing} style={{ padding: '10px 30px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                                    {formInfo.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ===== PENGANTAR TAB ===== */}
                    {activeTab === 'pengantar' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {/* Teks Pengantar */}
                            <form onSubmit={submitInfo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <label style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
                                    <i className="fa-solid fa-pen-to-square" style={{ marginRight: '8px', color: '#134CBC' }}></i>
                                    Teks Pengantar
                                </label>
                                <textarea
                                    value={formInfo.data.pengantar}
                                    onChange={e => formInfo.setData('pengantar', e.target.value)}
                                    style={{ width: '100%', height: '200px', padding: '15px', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'vertical', fontSize: '15px', lineHeight: '1.6', outline: 'none', boxSizing: 'border-box' }}
                                    placeholder="Tulis isi pengantar di sini..."
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" disabled={formInfo.processing} style={{ padding: '10px 30px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        {formInfo.processing ? 'Menyimpan...' : 'Simpan Teks'}
                                    </button>
                                </div>
                            </form>

                            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />

                            {/* Profil Pengantar */}
                            <form onSubmit={submitProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <label style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
                                    <i className="fa-solid fa-user-tie" style={{ marginRight: '8px', color: '#134CBC' }}></i>
                                    Profil Pengantar
                                </label>

                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                    {/* Preview foto */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '120px', height: '160px', borderRadius: '8px', border: '2px dashed #cbd5e1', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', background: '#f8fafc' }}>
                                            {pengantarPreview ? (
                                                <img src={pengantarPreview} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <i className="fa-solid fa-user" style={{ fontSize: '40px', color: '#94a3b8' }}></i>
                                            )}
                                        </div>
                                        <input type="file" accept="image/*" onChange={e => formProfile.setData('pengantar_foto', e.target.files[0])} style={{ fontSize: '12px', width: '120px' }} />
                                        {formProfile.errors.pengantar_foto && <span style={{ color: 'red', fontSize: '12px' }}>{formProfile.errors.pengantar_foto}</span>}
                                    </div>

                                    {/* Fields */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '250px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '14px' }}>Nama Lengkap & Gelar</label>
                                            <input type="text" value={formProfile.data.pengantar_nama} onChange={e => formProfile.setData('pengantar_nama', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} placeholder="Contoh: Drs. Trisno Wibowo, S.Pd., MM." />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '14px' }}>Jabatan</label>
                                            <input type="text" value={formProfile.data.pengantar_jabatan} onChange={e => formProfile.setData('pengantar_jabatan', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} placeholder="Contoh: Kepala SMK Negeri 1 Boyolangu" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '14px' }}>NIP</label>
                                            <input type="text" value={formProfile.data.pengantar_nip} onChange={e => formProfile.setData('pengantar_nip', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} placeholder="Contoh: 198120115 200312 1 003" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" disabled={formProfile.processing} style={{ padding: '10px 30px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        {formProfile.processing ? 'Menyimpan...' : 'Simpan Profil'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ===== STRUKTUR TAB ===== */}
                    {activeTab === 'struktur' && (
                        <div>
                            <h2 style={{ marginBottom: '20px', color: '#333', fontSize: '20px' }}>
                                <i className="fa-solid fa-sitemap" style={{ marginRight: '8px', color: '#134CBC' }}></i>
                                Manajemen Struktur Organisasi
                            </h2>

                            {/* Level Options Management */}
                            <div className="level-mgmt-panel">
                                <div className="level-mgmt-header">
                                    <i className="fa-solid fa-layer-group"></i>
                                    <span>Pengaturan Level Jabatan</span>
                                    <span className="level-mgmt-hint">Setiap nomor level hanya bisa digunakan 1 kali</span>
                                </div>

                                {/* Existing Levels List */}
                                <div className="level-mgmt-list">
                                    {levelOptions.map(opt => (
                                        <div key={opt.level} className={`level-mgmt-item ${editingLevelKey === opt.level ? 'editing' : ''}`}>
                                            {editingLevelKey === opt.level ? (
                                                /* Edit Mode */
                                                <div className="level-mgmt-edit-row">
                                                    <div className="level-mgmt-edit-fields">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={editLevelNumber}
                                                            onChange={e => setEditLevelNumber(e.target.value)}
                                                            className="level-mgmt-input level-mgmt-input-num"
                                                            placeholder="No"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={editLevelLabel}
                                                            onChange={e => setEditLevelLabel(e.target.value)}
                                                            className="level-mgmt-input level-mgmt-input-label"
                                                            placeholder="Nama level..."
                                                        />
                                                    </div>
                                                    <div className="level-mgmt-edit-actions">
                                                        <button type="button" onClick={saveEditLevel} className="level-mgmt-btn level-mgmt-btn-save" title="Simpan">
                                                            <i className="fa-solid fa-check"></i>
                                                        </button>
                                                        <button type="button" onClick={cancelEditLevel} className="level-mgmt-btn level-mgmt-btn-cancel-edit" title="Batal">
                                                            <i className="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* View Mode */
                                                <>
                                                    <div className="level-mgmt-item-info">
                                                        <span className="level-mgmt-num">{opt.level}</span>
                                                        <span className="level-mgmt-label">{opt.label}</span>
                                                    </div>
                                                    <div className="level-mgmt-item-actions">
                                                        <button type="button" onClick={() => startEditLevel(opt)} className="level-mgmt-btn level-mgmt-btn-edit" title="Edit Level">
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                        {levelOptions.length > 1 && (
                                                            <button type="button" onClick={() => removeLevelOption(opt.level)} className="level-mgmt-btn level-mgmt-btn-delete" title="Hapus Level">
                                                                <i className="fa-solid fa-trash-can"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Level */}
                                <div className="level-mgmt-add">
                                    <div className="level-mgmt-add-fields">
                                        <input
                                            type="number"
                                            min="1"
                                            value={newLevelNumber}
                                            onChange={e => setNewLevelNumber(e.target.value)}
                                            className="level-mgmt-input level-mgmt-input-num"
                                            placeholder="No"
                                        />
                                        <input
                                            type="text"
                                            value={newLevelLabel}
                                            onChange={e => setNewLevelLabel(e.target.value)}
                                            className="level-mgmt-input level-mgmt-input-label"
                                            placeholder="Nama level baru..."
                                            onKeyDown={e => e.key === 'Enter' && addLevelOption()}
                                        />
                                    </div>
                                    <button type="button" onClick={addLevelOption} className="level-mgmt-btn level-mgmt-btn-add" disabled={!newLevelLabel.trim() || !newLevelNumber}>
                                        <i className="fa-solid fa-plus"></i>
                                        <span>Tambah</span>
                                    </button>
                                </div>
                            </div>

                            {/* Struktur Form */}
                            <form onSubmit={submitStruktur} className="struktur-form-container">
                                <h3 className="struktur-form-title">
                                    {strukturId ? '✏️ Edit Anggota' : '➕ Tambah Anggota Baru'}
                                </h3>

                                {/* Level Buttons */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Pilih Level Jabatan</label>
                                    <div className="struktur-level-selector">
                                        {levelOptions.map(opt => (
                                            <button
                                                key={opt.level}
                                                type="button"
                                                onClick={() => selectLevel(opt.level)}
                                                className={`struktur-level-btn ${selectedLevel === opt.level ? 'active' : ''}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="struktur-form-fields">
                                    <div className="struktur-form-field">
                                        <label>Jabatan / Keterangan <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input type="text" value={formStruktur.data.jabatan} onChange={e => formStruktur.setData('jabatan', e.target.value)} required placeholder="Contoh: Petugas Pengadministrasian BKK" />
                                    </div>
                                    <div className="struktur-form-field">
                                        <label>Nama Lengkap & Gelar <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input type="text" value={formStruktur.data.nama} onChange={e => formStruktur.setData('nama', e.target.value)} required />
                                    </div>
                                </div>
                                <div className="struktur-form-fields">
                                    <div className="struktur-form-field">
                                        <label>NIP</label>
                                        <input type="text" value={formStruktur.data.nip} onChange={e => formStruktur.setData('nip', e.target.value)} />
                                    </div>
                                    <div className="struktur-form-field">
                                        <label>Foto Profil</label>
                                        <input type="file" accept="image/*" onChange={e => formStruktur.setData('foto_profil', e.target.files[0])} />
                                        {formStruktur.errors.foto_profil && <div style={{ color: 'red', marginTop: '4px', fontSize: '12px' }}>{formStruktur.errors.foto_profil}</div>}
                                    </div>
                                </div>
                                <div className="struktur-form-actions">
                                    {strukturId && (
                                        <button type="button" onClick={resetStruktur} className="struktur-form-btn struktur-form-btn-cancel">Batal</button>
                                    )}
                                    <button type="submit" disabled={formStruktur.processing} className="struktur-form-btn struktur-form-btn-submit">
                                        {formStruktur.processing ? 'Menyimpan...' : (strukturId ? 'Update Anggota' : 'Tambah Anggota')}
                                    </button>
                                </div>
                            </form>

                            {/* Tabel Daftar Struktur */}
                            <div className="struktur-table-wrapper">
                                <table className="struktur-table">
                                    <thead>
                                        <tr>
                                            <th>Level</th>
                                            <th>Foto</th>
                                            <th>Jabatan</th>
                                            <th>Nama / NIP</th>
                                            <th style={{ textAlign: 'center' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {struktur && struktur.length > 0 ? (
                                            struktur.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <span className="struktur-level-badge">
                                                            {getLevelLabel(item.level)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {item.foto_profil ? (
                                                            <img src={`/storage/uploads/struktur/${item.foto_profil}`} alt={item.nama} className="struktur-foto" />
                                                        ) : (
                                                            <div className="struktur-foto-placeholder">
                                                                <i className="fa-solid fa-user"></i>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{item.jabatan}</td>
                                                    <td>
                                                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.nama}</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>{item.nip || '-'}</div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div className="struktur-actions">
                                                            <button onClick={() => editStruktur(item)} className="struktur-action-btn struktur-action-btn-edit" title="Edit">
                                                                <i className="fa-solid fa-pen"></i>
                                                            </button>
                                                            <button onClick={() => deleteStruktur(item.id)} className="struktur-action-btn struktur-action-btn-delete" title="Hapus">
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '15px' }}>Belum ada anggota struktur.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
