import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';

export default function InformasiKegiatan({ berita, filters }) {

    const data = berita?.data
        ? berita.data
        : (Array.isArray(berita) ? berita : []);

    const links = berita?.links || [];
    const from = berita?.from || 0;
    const to = berita?.to || 0;
    const total = berita?.total || 0;

    const [selectedKegiatan, setSelectedKegiatan] = useState(null);

    /* =========================
       FILTER
    ========================= */
    const handleFilter = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);

        router.get(
            '/informasi-kegiatan',
            {
                search: form.get('search'),
                tanggal: form.get('tanggal'),
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    /* =========================
       POPUP ESC
    ========================= */
    useEffect(() => {
        if (!selectedKegiatan) return undefined;

        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setSelectedKegiatan(null);
            }
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
                <a href="#">
                    HOME / Informasi Kegiatan BKK
                </a>
            </div>

            <div className="kegiatan-container">

                {/* =========================
                   FILTER
                ========================= */}
                <div className="search-container" style={{ margin: '15px 0' }}>
                    <form className="search" onSubmit={handleFilter}>

                        <label htmlFor="search-kegiatan">Pencarian:</label>
                        <input
                            id="search-kegiatan"
                            name="search"
                            className="search-input"
                            placeholder="Cari kegiatan..."
                            defaultValue={filters?.search || ''}
                        />

                        <label htmlFor="tanggal-kegiatan">Tanggal:</label>
                        <input
                            type="date"
                            id="tanggal-kegiatan"
                            name="tanggal"
                            className="search-input"
                            defaultValue={filters?.tanggal || ''}
                        />

                        <button className="search-button" type="submit">
                            <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '5px' }}></i> Cari
                        </button>

                    </form>
                </div>

                {/* =========================
                   CARD LIST
                ========================= */}
                <div className="job-list">
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <div
                                className="kegiatan-card clickable show"
                                key={item.id_berita}
                                onClick={() => setSelectedKegiatan(item)}
                            >

                                {/* HEADER */}
                                <div className="kegiatan-card-header">
                                    <h3 className="kegiatan-card-title">
                                        {item.judul}
                                    </h3>
                                </div>

                                {/* IMAGE */}
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
                                        <div className="kegiatan-image--placeholder">
                                            <i className="fa-regular fa-image"></i>
                                            <span>
                                                Gambar tidak tersedia
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* CONTENT */}
                                <div className="kegiatan-content-preview">
                                    <p className="kegiatan-desc">
                                        {item.deskripsi || 'Tidak ada deskripsi tersedia.'}
                                    </p>

                                    <div className="read-more-hint">
                                        <span>
                                            Lihat Detail
                                        </span>

                                        <i className="fa-solid fa-arrow-right"></i>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data-wrapper">
                            <p className="no-data">
                                Belum ada informasi kegiatan.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* =========================
            PAGINATION
            ========================= */}
            {berita?.links && (
                    <div className="pagination">
                        {berita.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                className={`page-btn ${link.active ? 'active' : ''}`}
                                onClick={() => {
                                    if (link.url) {
                                        router.visit(link.url, {
                                            preserveScroll: true,
                                            preserveState: true,
                                        });
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
            )}

            {/* =========================
               POPUP DETAIL
            ========================= */}
            {selectedKegiatan && (
                <div
                    className="kegiatan-popup-overlay"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedKegiatan(null)}
                >

                    <div
                        className="kegiatan-popup-card"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}
                        <div className="kegiatan-popup-header">

                            <h2 className="kegiatan-popup-title">
                                {selectedKegiatan.judul}
                            </h2>

                            <button
                                className="close-popup"
                                onClick={() => setSelectedKegiatan(null)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>

                        {/* BODY */}
                        <div className="kegiatan-popup-body">

                            {/* IMAGE */}
                            <div className="kegiatan-popup-image-wrap">
                                {selectedKegiatan.gambar ? (
                                    <img
                                        src={`/storage/uploads/kegiatan/${selectedKegiatan.gambar}`}
                                        alt={selectedKegiatan.judul}
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
                                        <span>
                                            Gambar tidak tersedia
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* INFO */}
                            <div className="kegiatan-popup-info-grid">

                                <div className="info-item">
                                    <i className="fa-regular fa-calendar-days"></i>

                                    <div className="info-text">
                                        <strong>Tanggal</strong>

                                        <span>
                                            {selectedKegiatan.tanggal || '-'}
                                        </span>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <i className="fa-solid fa-users"></i>

                                    <div className="info-text">
                                        <strong>Peserta</strong>

                                        <span>
                                            {selectedKegiatan.jml_peserta || '-'} Orang
                                        </span>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <i className="fa-solid fa-location-dot"></i>

                                    <div className="info-text">
                                        <strong>Lokasi</strong>

                                        <span>
                                            {selectedKegiatan.lokasi || '-'}
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* DESCRIPTION */}
                            <div className="kegiatan-popup-description">
                                <h3>
                                    Deskripsi Kegiatan
                                </h3>

                                <p>
                                    {selectedKegiatan.deskripsi || '-'}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            )}
        </MainLayout>
    );
}