import { Head, router, Link } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/helpers/actionPopup';

export default function ManagementPerusahaanIndex({ perusahaan, filters = {} }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleDelete = async (id) => {
        if (await confirmAction('menghapus perusahaan ini')) {
            router.delete(`/management/perusahaan/${id}`, {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    notifyActionSuccess('menghapus perusahaan');
                    setSelectedItem(null);
                },
            });
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/management/perusahaan', {
            search: formData.get('search') || '',
            skala: formData.get('skala') || '',
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const rows = useMemo(() => perusahaan?.data || [], [perusahaan]);
    const links = perusahaan?.links || [];
    const from = perusahaan?.from || 0;
    const to = perusahaan?.to || 0;
    const total = perusahaan?.total || 0;

    useEffect(() => {
        if (!selectedItem) return;
        const handleEsc = (e) => { if (e.key === 'Escape') setSelectedItem(null); };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleEsc); };
    }, [selectedItem]);

    return (
        <MainLayout>
            <Head title="CRUD Perusahaan" />

            <div className="header-bar">
                <a href="#">CRUD / Perusahaan</a>
            </div>

            <div className="search-container">
                <form className="search" onSubmit={handleFilter}>
                    <label htmlFor="search-perusahaan">Pencarian:</label>
                    <input id="search-perusahaan" name="search" className="search-input" defaultValue={filters?.search || ''} />
                    <label htmlFor="skala-perusahaan">Skala Perusahaan:</label>
                    <select id="skala-perusahaan" name="skala" className="search-select" defaultValue={filters?.skala || ''}>
                        <option value="">-- Semua Jenis --</option>
                        <option value="lokal">Lokal</option>
                        <option value="Provinsi">Provinsi</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Internasional</option>
                    </select>
                    <button className="search-button" type="submit">Cari</button>
                </form>
            </div>

            <div className="perusahaan-admin-wrap">
                <div className="perusahaan-admin-grid">
                    {/* Tambah Card */}
                    <Link
                        className="perusahaan-add-card"
                        href="/management/perusahaan/create"
                        style={{ minHeight: '180px' }}
                    >
                        <i className="fa-solid fa-plus"></i>
                        <p>Tambahkan Perusahaan</p>
                    </Link>

                    {rows.length > 0 ? rows.map((p) => (
                        <div
                            className="perusahaan-admin-card"
                            key={p.id_perusahaan}
                            onClick={() => setSelectedItem(p)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="perusahaan-card-image" style={{ height: '140px', minHeight: '140px' }}>
                                {p.gambar ? (
                                    <img
                                        src={`/storage/gambar_perusahaan/${p.gambar}`}
                                        alt={p.nama}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="perusahaan-card-image-fallback" style={{ minHeight: '140px' }}>
                                        <i className="fa-solid fa-building" style={{ fontSize: '36px', color: '#cbd5e1' }}></i>
                                    </div>
                                )}
                            </div>

                            <div className="perusahaan-card-info">
                                <h3>{p.nama}</h3>
                                <p><i className="fa-solid fa-location-dot"></i>{p.alamat || '-'}</p>
                                <p><i className="fa-solid fa-briefcase"></i>{p.jenis || '-'}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="no-data">Belum ada data perusahaan.</p>
                    )}
                </div>

                <div className="pagination-container">
                    <div className="pagination-info">
                        <p>
                            Ditampilkan <strong>{from}</strong> sampai <strong>{to}</strong> dari total <strong>{total}</strong> perusahaan
                        </p>
                    </div>
                    <div className="pagination">
                        {links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`${link.active ? 'active' : ''} ${String(link.label).includes('Previous') || String(link.label).includes('Next') ? 'navigate' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* POPUP DETAIL */}
            {selectedItem && (
                <div
                    className="kegiatan-popup-overlay"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedItem(null)}
                >
                    <div className="kegiatan-popup-card" onClick={(e) => e.stopPropagation()}>
                        <div className="kegiatan-popup-header">
                            <h2 className="kegiatan-popup-title">{selectedItem.nama}</h2>
                            <button className="close-popup" onClick={() => setSelectedItem(null)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="kegiatan-popup-body">
                            {/* Logo/Image */}
                            {selectedItem.gambar && (
                                <div className="kegiatan-popup-image-wrap">
                                    <img
                                        src={`/storage/gambar_perusahaan/${selectedItem.gambar}`}
                                        alt={selectedItem.nama}
                                        className="kegiatan-popup-image landscape"
                                    />
                                </div>
                            )}

                            {/* Info Grid */}
                            <div className="kegiatan-popup-info-grid">
                                <div className="info-item">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <div className="info-text">
                                        <strong>Alamat</strong>
                                        <span>{selectedItem.alamat || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-phone"></i>
                                    <div className="info-text">
                                        <strong>Kontak</strong>
                                        <span>{selectedItem.kontak || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-envelope"></i>
                                    <div className="info-text">
                                        <strong>Email</strong>
                                        <span>{selectedItem.email || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-globe"></i>
                                    <div className="info-text">
                                        <strong>Website</strong>
                                        <span>{selectedItem.website || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-briefcase"></i>
                                    <div className="info-text">
                                        <strong>Jenis</strong>
                                        <span>{selectedItem.jenis || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-chart-bar"></i>
                                    <div className="info-text">
                                        <strong>Skala</strong>
                                        <span>{selectedItem.skala || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            {selectedItem.deskripsi && (
                                <div className="kegiatan-popup-description">
                                    <h3>Deskripsi Perusahaan</h3>
                                    <p>{selectedItem.deskripsi}</p>
                                </div>
                            )}

                            {/* CRUD Actions */}
                            <div style={{
                                display: 'flex', gap: '12px', marginTop: '25px',
                                paddingTop: '20px', borderTop: '1px solid #e2e8f0',
                                justifyContent: 'flex-end', flexWrap: 'wrap',
                            }}>
                                <Link
                                    href={`/management/perusahaan/${selectedItem.id_perusahaan}/edit`}
                                    style={{
                                        padding: '10px 24px', background: '#1487f7', color: '#fff',
                                        border: 'none', borderRadius: '8px', fontWeight: 600,
                                        fontSize: '14px', textDecoration: 'none',
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    }}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(selectedItem.id_perusahaan)}
                                    style={{
                                        padding: '10px 24px', background: '#ef4444', color: '#fff',
                                        border: 'none', borderRadius: '8px', fontWeight: 600,
                                        fontSize: '14px', cursor: 'pointer',
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    }}
                                >
                                    <i className="fa-solid fa-trash"></i> Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}