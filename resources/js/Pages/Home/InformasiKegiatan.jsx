import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';

export default function InformasiKegiatan({ berita }) {
    const data = berita?.data ? berita.data : (Array.isArray(berita) ? berita : []);
    const links = berita?.links || [];
    const from = berita?.from || 0;
    const to = berita?.to || 0;
    const total = berita?.total || 0;
    const [selectedKegiatan, setSelectedKegiatan] = useState(null);

    useEffect(() => {
        if (!selectedKegiatan) return undefined;
        const handleEsc = (event) => {
            if (event.key === 'Escape') setSelectedKegiatan(null);
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [selectedKegiatan]);

    return (
        <MainLayout>
            <Head title="Informasi Kegiatan BKK" />
            <div className="header-bar">
                <a href="#">HOME / Informasi Kegiatan BKK</a>
            </div>
            <div style={{ padding: '20px' }}>
                <div className="job-list">
                    {data && data.length > 0 ? data.map((item) => (
                        <div
                            className="job-card show kegiatan-card"
                            key={item.id_berita}
                            style={{ height: 'auto', cursor: 'pointer' }}
                            onClick={() => setSelectedKegiatan(item)}
                        >
                            <div className="job-header">
                                <h3 style={{ marginLeft: 0, width: '100%', textAlign: 'center' }}>{item.judul}</h3>
                            </div>
                            <div className="job-detail" style={{ paddingBottom: '10px' }}>
                                <div className="kegiatan-image">
                                    {item.gambar ? (
                                        <img
                                            src={`/storage/uploads/kegiatan/${item.gambar}`}
                                            alt={item.judul}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="kegiatan-image--placeholder" aria-label="Gambar tidak tersedia">
                                            <i className="fa-regular fa-image"></i>
                                            <span>tidak tersedia</span>
                                        </div>
                                    )}
                                </div>

                                <p className="kegiatan-desc">
                                    {item.deskripsi || ''}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="no-data">Belum ada informasi kegiatan.</p>
                    )}
                </div>
            </div>

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
                                preserveScroll
                            />
                        ))}
                    </div>
                </div>
            )}

            {selectedKegiatan && (
                <div className="kegiatan-popup-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedKegiatan(null)}>
                    <div className="kegiatan-popup-card" onClick={(e) => e.stopPropagation()}>
                        <div className="kegiatan-popup-title">{selectedKegiatan.judul}</div>
                        <div className="kegiatan-popup-content">
                            <div className="kegiatan-popup-image-wrap">
                                {selectedKegiatan.gambar ? (
                                    <img
                                        src={`/storage/uploads/kegiatan/${selectedKegiatan.gambar}`}
                                        alt={selectedKegiatan.judul}
                                        className="kegiatan-popup-image"
                                    />
                                ) : (
                                    <div className="kegiatan-image--placeholder" aria-label="Gambar tidak tersedia">
                                        <i className="fa-regular fa-image"></i>
                                        <span>tidak tersedia</span>
                                    </div>
                                )}
                            </div>

                            <div className="kegiatan-popup-meta">
                                <div><i className="fa-regular fa-clock"></i><strong>Tanggal Kegiatan</strong><span>{selectedKegiatan.tanggal || '-'}</span></div>
                                <div><i className="fa-solid fa-users"></i><strong>Jumlah Peserta</strong><span>{selectedKegiatan.jml_peserta || '-'}</span></div>
                                <div><i className="fa-solid fa-location-dot"></i><strong>Lokasi</strong><span>{selectedKegiatan.lokasi || '-'}</span></div>
                            </div>

                            <div className="kegiatan-popup-description">
                                <strong>Deskripsi Kegiatan</strong>
                                <p>{selectedKegiatan.deskripsi || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
