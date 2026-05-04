import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { notifyActionSuccess, confirmAction } from '@/Helpers/actionPopup';

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
        visi_misi: informasi?.visi_misi || '',
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

    const addLevelOption = () => {
        if (!newLevelLabel.trim()) return;
        const maxLevel = Math.max(...levelOptions.map(l => l.level), 0);
        const updated = [...levelOptions, { level: maxLevel + 1, label: newLevelLabel.trim() }];
        setLevelOptions(updated);
        setNewLevelLabel('');
        // Save to DB
        router.put('/management/informasi/level-options', { level_options: updated }, { preserveScroll: true });
    };

    const removeLevelOption = (level) => {
        const updated = levelOptions.filter(l => l.level !== level);
        setLevelOptions(updated);
        router.put('/management/informasi/level-options', { level_options: updated }, { preserveScroll: true });
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
        { id: 'visi_misi', label: 'Visi Misi', icon: 'fa-bullseye' },
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

            <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                {/* TABS */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '10px 18px',
                                borderRadius: '8px',
                                border: activeTab === tab.id ? '2px solid #134CBC' : '1px solid #d1d5db',
                                cursor: 'pointer',
                                background: activeTab === tab.id ? '#134CBC' : '#ffffff',
                                color: activeTab === tab.id ? '#fff' : '#555',
                                fontWeight: 600,
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <i className={`fa-solid ${tab.icon}`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT CARD */}
                <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' }}>

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
                            <textarea
                                value={formInfo.data[activeTab]}
                                onChange={e => formInfo.setData(activeTab, e.target.value)}
                                style={{ width: '100%', height: '300px', padding: '15px', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'vertical', fontSize: '15px', lineHeight: '1.6', outline: 'none', boxSizing: 'border-box' }}
                                placeholder={`Tulis isi ${tabs.find(t => t.id === activeTab)?.label} di sini...`}
                            />
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
                            <div style={{ background: '#f0f7ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #cce5ff' }}>
                                <p style={{ fontWeight: 600, margin: '0 0 10px 0', fontSize: '14px', color: '#134CBC' }}>
                                    <i className="fa-solid fa-layer-group" style={{ marginRight: '6px' }}></i>
                                    Daftar Level Jabatan
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                    {levelOptions.map(opt => (
                                        <div key={opt.level} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '6px 12px', fontSize: '13px' }}>
                                            <span style={{ fontWeight: 600 }}>{opt.level}.</span> {opt.label}
                                            {levelOptions.length > 1 && (
                                                <button type="button" onClick={() => removeLevelOption(opt.level)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 2px', fontSize: '14px' }}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" value={newLevelLabel} onChange={e => setNewLevelLabel(e.target.value)} placeholder="Nama level baru..." style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', flex: 1, maxWidth: '250px' }} />
                                    <button type="button" onClick={addLevelOption} style={{ padding: '6px 14px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                        <i className="fa-solid fa-plus" style={{ marginRight: '4px' }}></i> Tambah Level
                                    </button>
                                </div>
                            </div>

                            {/* Struktur Form */}
                            <form onSubmit={submitStruktur} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>
                                    {strukturId ? '✏️ Edit Anggota' : '➕ Tambah Anggota Baru'}
                                </h3>

                                {/* Level Buttons */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Pilih Level Jabatan</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {levelOptions.map(opt => (
                                            <button
                                                key={opt.level}
                                                type="button"
                                                onClick={() => selectLevel(opt.level)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '6px',
                                                    border: selectedLevel === opt.level ? '2px solid #134CBC' : '1px solid #d1d5db',
                                                    background: selectedLevel === opt.level ? '#134CBC' : '#fff',
                                                    color: selectedLevel === opt.level ? '#fff' : '#555',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 250px' }}>
                                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px', fontSize: '14px' }}>Jabatan / Keterangan <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input type="text" value={formStruktur.data.jabatan} onChange={e => formStruktur.setData('jabatan', e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} placeholder="Contoh: Petugas Pengadministrasian BKK" />
                                    </div>
                                    <div style={{ flex: '1 1 250px' }}>
                                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px', fontSize: '14px' }}>Nama Lengkap & Gelar <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input type="text" value={formStruktur.data.nama} onChange={e => formStruktur.setData('nama', e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 250px' }}>
                                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px', fontSize: '14px' }}>NIP</label>
                                        <input type="text" value={formStruktur.data.nip} onChange={e => formStruktur.setData('nip', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                                    </div>
                                    <div style={{ flex: '1 1 250px' }}>
                                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px', fontSize: '14px' }}>Foto Profil</label>
                                        <input type="file" accept="image/*" onChange={e => formStruktur.setData('foto_profil', e.target.files[0])} style={{ width: '100%', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }} />
                                        {formStruktur.errors.foto_profil && <div style={{ color: 'red', marginTop: '4px', fontSize: '12px' }}>{formStruktur.errors.foto_profil}</div>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '5px' }}>
                                    {strukturId && (
                                        <button type="button" onClick={resetStruktur} style={{ padding: '8px 20px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Batal</button>
                                    )}
                                    <button type="submit" disabled={formStruktur.processing} style={{ padding: '8px 20px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                        {formStruktur.processing ? 'Menyimpan...' : (strukturId ? 'Update Anggota' : 'Tambah Anggota')}
                                    </button>
                                </div>
                            </form>

                            {/* Tabel Daftar Struktur */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                        <th style={{ padding: '10px 12px', fontSize: '13px' }}>Level</th>
                                        <th style={{ padding: '10px 12px', fontSize: '13px' }}>Foto</th>
                                        <th style={{ padding: '10px 12px', fontSize: '13px' }}>Jabatan</th>
                                        <th style={{ padding: '10px 12px', fontSize: '13px' }}>Nama / NIP</th>
                                        <th style={{ padding: '10px 12px', fontSize: '13px', textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {struktur && struktur.length > 0 ? (
                                        struktur.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '10px 12px' }}>
                                                    <span style={{ background: '#134CBC', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                                        {getLevelLabel(item.level)}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '10px 12px' }}>
                                                    {item.foto_profil ? (
                                                        <img src={`/storage/uploads/struktur/${item.foto_profil}`} alt={item.nama} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                                                    ) : (
                                                        <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                                            <i className="fa-solid fa-user"></i>
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px 12px', fontSize: '14px' }}>{item.jabatan}</td>
                                                <td style={{ padding: '10px 12px' }}>
                                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.nama}</div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>{item.nip || '-'}</div>
                                                </td>
                                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                    <button onClick={() => editStruktur(item)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button onClick={() => deleteStruktur(item.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
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
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
