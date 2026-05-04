import { Head, Link, router } from '@inertiajs/react';
import { useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function ManagementJurusanIndex({ jurusan }) {
    const handleDelete = async (id) => {
        if (!(await confirmAction('hapus jurusan'))) return;
        router.delete(`/management/jurusan/${id}`, {
            onSuccess: () => notifyActionSuccess('hapus jurusan'),
        });
    };

    const items = useMemo(() => (jurusan?.data ? jurusan.data : (Array.isArray(jurusan) ? jurusan : [])), [jurusan]);
    const links = jurusan?.links || [];
    const from = jurusan?.from || 0;
    const to = jurusan?.to || 0;
    const total = jurusan?.total || 0;

    return (
        <MainLayout>
            <Head title="CRUD Informasi Jurusan" />
            <div className="header-bar"><a href="#">CRUD / Informasi Jurusan</a></div>

            <div style={{ padding: '20px' }}>
                <div className="job-list">
                    <Link className="job-card show" id="tambah-jurusan" href="/management/jurusan/create" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                        <div className="tambah-btn">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-plus" style={{ fontSize: '34px' }}></i>
                                <p style={{ fontWeight: 600 }}>Tambahkan Jurusan</p>
                            </div>
                        </div>
                    </Link>

                    {items.length > 0 ? items.map((item) => (
                        <div className="job-card show kegiatan-card has-footer" key={item.id_jurusan} style={{ height: 'auto' }}>
                            <div className="job-header">
                                <h3 style={{ marginLeft: 0, width: '100%', textAlign: 'center' }}>{item.jurusan}</h3>
                            </div>

                            <div className="job-detail" style={{ paddingBottom: '10px' }}>
                                <div className="kegiatan-image">
                                    {item.gambar1 ? (
                                        <img
                                            src={`/storage/uploads/jurusan/${item.gambar1}`}
                                            alt={item.jurusan}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="kegiatan-image--placeholder" aria-label="Gambar tidak tersedia">
                                            <i className="fa-solid fa-graduation-cap" style={{ fontSize: '2em', color: '#aaa' }}></i>
                                            <span>Belum ada gambar</span>
                                        </div>
                                    )}
                                </div>

                                <p className="kegiatan-desc">
                                    {item.deskripsi ? (item.deskripsi.length > 150 ? item.deskripsi.substring(0, 150) + '...' : item.deskripsi) : 'Belum ada deskripsi'}
                                </p>
                            </div>

                            <div className="job-footer" style={{ height: 60 }}>
                                <button onClick={() => handleDelete(item.id_jurusan)} className="delete-button">
                                    <i className="fa-solid fa-trash"></i>
                                    Hapus
                                </button>
                                <Link href={`/management/jurusan/${item.id_jurusan}/edit`} className="detail-button" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    Edit
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <p className="no-data">Belum ada data jurusan.</p>
                    )}
                </div>
            </div>

            {links.length > 0 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        <p>Ditampilkan <strong>{from}</strong> sampai <strong>{to}</strong> dari total <strong>{total}</strong> jurusan</p>
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
