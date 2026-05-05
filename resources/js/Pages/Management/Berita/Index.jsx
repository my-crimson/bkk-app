import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function ManagementBeritaIndex({ berita, filters }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleDelete = async (id) => {
        if (!(await confirmAction('hapus kegiatan'))) return;
        router.delete(`/management/berita/${id}`, {
            onSuccess: () => {
                notifyActionSuccess('hapus kegiatan');
                setSelectedItem(null);
            },
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        router.get('/management/berita', {
            search: form.get('search'),
            tanggal: form.get('tanggal'),
        }, { preserveState: true, preserveScroll: true });
    };

    const cards = useMemo(() => (berita?.data ? berita.data : (Array.isArray(berita) ? berita : [])), [berita]);
    const links = berita?.links || [];
    const from = berita?.from || 0;
    const to = berita?.to || 0;
    const total = berita?.total || 0;

    useEffect(() => {
        if (!selectedItem) return;
        const handleEsc = (e) => { if (e.key === 'Escape') setSelectedItem(null); };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleEsc); };
    }, [selectedItem]);

    return (
        <MainLayout>
            <Head title="CRUD Kegiatan BKK" />
            <div className="header-bar"><a href="#">CRUD / Kegiatan BKK</a></div>

            <div style={{ padding: '20px' }}>
                {/* FILTER */}
                <div className="search-container" style={{ margin: '15px 0' }}>
                    <form className="search" onSubmit={handleFilter}>
                        <label htmlFor="search-kegiatan">Pencarian:</label>
                        <input id="search-kegiatan" name="search" className="search-input" placeholder="Judul kegiatan..." defaultValue={filters?.search || ''} />
                        <label htmlFor="tanggal-kegiatan">Tanggal:</label>
                        <input type="date" id="tanggal-kegiatan" name="tanggal" className="search-input" defaultValue={filters?.tanggal || ''} />
                        <button className="search-button" type="submit">
                            <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '5px' }}></i> Cari
                        </button>
                    </form>
                </div>

                <div className="job-list">
                    {/* Tambah Card */}
                    <Link
                        id="tambah-kegiatan"
                        className="kegiatan-card clickable show"
                        href="/management/berita/create"
                        style={{
                            cursor: 'pointer', textDecoration: 'none',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            background: '#f8fafc', border: '2px dashed #cbd5e1',
                            boxShadow: 'none',
                        }}
                    >
                        <i className="fa-solid fa-plus" style={{ fontSize: '32px', color: '#134CBC', marginBottom: '10px' }}></i>
                        <p style={{ fontWeight: 600, color: '#134CBC', fontSize: '14px', margin: 0 }}>Tambahkan Kegiatan</p>
                    </Link>

                    {cards.length > 0 ? cards.map((item) => (
                        <div
                            className="kegiatan-card clickable show"
                            key={item.id_berita}
                            onClick={() => setSelectedItem(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="kegiatan-card-header">
                                <h3 className="kegiatan-card-title">{item.judul}</h3>
                            </div>

                            <div className="kegiatan-image">
                                {item.gambar ? (
                                    <img
                                        src={`/storage/uploads/kegiatan/${item.gambar}`}
                                        alt={item.judul}
                                        loading="lazy"
                                        decoding="async"
                                        onLoad={(e) => {
                                            const img = e.target;
                                            if (img.naturalHeight > img.naturalWidth) {
                                                img.classList.add('portrait');
                                            } else {
                                                img.classList.add('landscape');
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="kegiatan-image--placeholder" aria-label="Gambar tidak tersedia">
                                        <i className="fa-regular fa-image"></i>
                                        <span>tidak tersedia</span>
                                    </div>
                                )}
                            </div>

                            <div className="kegiatan-content-preview">
                                <p className="kegiatan-desc">{item.deskripsi || ''}</p>
                                <div className="read-more-hint">
                                    <span>Lihat Detail</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="no-data">Belum ada kegiatan.</p>
                    )}
                </div>
            </div>

            {/* PAGINATION */}
            {links.length > 0 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        <p>Ditampilkan <strong>{from}</strong> sampai <strong>{to}</strong> dari total <strong>{total}</strong> kegiatan</p>
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
            )}

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
                            <h2 className="kegiatan-popup-title">{selectedItem.judul}</h2>
                            <button className="close-popup" onClick={() => setSelectedItem(null)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="kegiatan-popup-body">
                            <div className="kegiatan-popup-image-wrap">
                                {selectedItem.gambar ? (
                                    <img
                                        src={`/storage/uploads/kegiatan/${selectedItem.gambar}`}
                                        alt={selectedItem.judul}
                                        className="kegiatan-popup-image"
                                        onLoad={(e) => {
                                            const img = e.target;
                                            if (img.naturalHeight > img.naturalWidth) {
                                                img.classList.add('portrait');
                                            } else {
                                                img.classList.add('landscape');
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="kegiatan-image--placeholder">
                                        <i className="fa-regular fa-image"></i>
                                        <span>Gambar tidak tersedia</span>
                                    </div>
                                )}
                            </div>

                            <div className="kegiatan-popup-info-grid">
                                <div className="info-item">
                                    <i className="fa-regular fa-calendar-days"></i>
                                    <div className="info-text">
                                        <strong>Tanggal</strong>
                                        <span>{selectedItem.tanggal || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-users"></i>
                                    <div className="info-text">
                                        <strong>Peserta</strong>
                                        <span>{selectedItem.jml_peserta || '-'} Orang</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <div className="info-text">
                                        <strong>Lokasi</strong>
                                        <span>{selectedItem.lokasi || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="kegiatan-popup-description">
                                <h3>Deskripsi Kegiatan</h3>
                                <p>{selectedItem.deskripsi || '-'}</p>
                            </div>

                            {/* CRUD Actions */}
                            <div style={{
                                display: 'flex', gap: '12px', marginTop: '25px',
                                paddingTop: '20px', borderTop: '1px solid #e2e8f0',
                                justifyContent: 'flex-end', flexWrap: 'wrap',
                            }}>
                                <Link
                                    href={`/management/berita/${selectedItem.id_berita}/edit`}
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
                                    onClick={() => handleDelete(selectedItem.id_berita)}
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
