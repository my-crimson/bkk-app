import { Head, Link, router } from '@inertiajs/react';
import { useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminBeritaIndex({ berita }) {
    const handleDelete = (id) => { if (confirm('Yakin ingin menghapus?')) router.delete(`/admin/berita/${id}`); };

    const cards = useMemo(() => (berita?.data ? berita.data : (Array.isArray(berita) ? berita : [])), [berita]);
    const links = berita?.links || [];
    const from = berita?.from || 0;
    const to = berita?.to || 0;
    const total = berita?.total || 0;

    return (
        <MainLayout>
            <Head title="CRUD Kegiatan BKK" />
            <div className="header-bar"><a href="#">CRUD / Kegiatan BKK</a></div>

            <div style={{ padding: '20px' }}>
                <div className="job-list">
                    <Link className="job-card show" id="tambah-kegiatan" href="/admin/berita/create" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                        <div className="tambah-btn">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-plus" style={{ fontSize: '34px' }}></i>
                                <p style={{ fontWeight: 600 }}>Tambahkan Kegiatan</p>
                            </div>
                        </div>
                    </Link>

                    {cards.length > 0 ? cards.map((item) => (
                        <div className="job-card show kegiatan-card has-footer" key={item.id_berita} style={{ height: 'auto' }}>
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

                            <div className="job-footer" style={{ height: 60 }}>
                                <button onClick={() => handleDelete(item.id_berita)} className="delete-button">
                                    <i className="fa-solid fa-trash"></i>
                                    Hapus
                                </button>
                                <Link href={`/admin/berita/${item.id_berita}/edit`} className="detail-button" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                                    <i className="fa-solid fa-bars"></i>
                                    Detail
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <p className="no-data">Belum ada kegiatan.</p>
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
        </MainLayout>
    );
}
