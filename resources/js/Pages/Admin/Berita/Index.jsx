import { Head, Link, router } from '@inertiajs/react';
import { useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function AdminBeritaIndex({ berita, filters }) {
    const handleDelete = async (id) => {
        if (!(await confirmAction('hapus kegiatan'))) return;
        router.delete(`/admin/berita/${id}`, {
            onSuccess: () => notifyActionSuccess('hapus kegiatan'),
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);

        router.get(
            '/admin/berita',
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

                {/* FILTER */}
                <div className="search-container" style={{ margin: '15px 0' }}>
                    <form className="search" onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px', padding: '10px 20px', width: 'fit-content', margin: '0 auto' }}>
                        <label htmlFor="search-kegiatan" style={{ margin: 0, fontWeight: 600 }}>Pencarian:</label>
                        <input
                            id="search-kegiatan"
                            name="search"
                            className="search-input"
                            style={{ width: '200px', height: '38px' }}
                            placeholder="Judul kegiatan..."
                            defaultValue={filters?.search || ''}
                        />

                        <label htmlFor="tanggal-kegiatan" style={{ margin: 0, fontWeight: 600 }}>Tanggal:</label>
                        <input
                            type="date"
                            id="tanggal-kegiatan"
                            name="tanggal"
                            className="search-input"
                            style={{ width: '150px', height: '38px' }}
                            defaultValue={filters?.tanggal || ''}
                        />

                        <button className="search-button" type="submit" style={{ height: '38px', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '5px' }}></i> Cari
                        </button>
                    </form>
                </div>

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
