import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function ManagementJurusanIndex({ jurusan }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleDelete = async (id) => {
        if (!(await confirmAction('hapus jurusan'))) return;
        router.delete(`/management/jurusan/${id}`, {
            onSuccess: () => {
                notifyActionSuccess('hapus jurusan');
                setSelectedItem(null);
            },
        });
    };

    const items = useMemo(() => (jurusan?.data ? jurusan.data : (Array.isArray(jurusan) ? jurusan : [])), [jurusan]);
    const links = jurusan?.links || [];
    const from = jurusan?.from || 0;
    const to = jurusan?.to || 0;
    const total = jurusan?.total || 0;

    useEffect(() => {
        if (!selectedItem) return;
        const handleEsc = (e) => { if (e.key === 'Escape') setSelectedItem(null); };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleEsc); };
    }, [selectedItem]);

    const parseProspek = (text) => {
        if (!text) return [];
        return text.split('\n').filter(line => line.trim() !== '');
    };

    return (
        <MainLayout>
            <Head title="CRUD Informasi Jurusan" />
            <div className="header-bar"><a href="#">CRUD / Informasi Jurusan</a></div>

            <div className="jurusan-container">
                <div className="jurusan-grid">
                    {/* Tambah Card */}
                    <Link
                        id="tambah-jurusan"
                        href="/management/jurusan/create"
                        className="jurusan-card show"
                        style={{
                            cursor: 'pointer', textDecoration: 'none',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            background: '#f8fafc', border: '2px dashed #cbd5e1',
                            boxShadow: 'none', opacity: 1, transform: 'none',
                            minHeight: '180px',
                        }}
                    >
                        <i className="fa-solid fa-plus" style={{ fontSize: '32px', color: '#134CBC', marginBottom: '10px' }}></i>
                        <p style={{ fontWeight: 600, color: '#134CBC', fontSize: '14px', margin: 0 }}>Tambahkan Jurusan</p>
                    </Link>

                    {items.length > 0 ? items.map((item) => (
                        <div
                            key={item.id_jurusan}
                            className="jurusan-card show"
                            onClick={() => setSelectedItem(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="jurusan-image">
                                {item.gambar1 ? (
                                    <img
                                        src={`/storage/uploads/jurusan/${item.gambar1}`}
                                        alt={item.jurusan}
                                    />
                                ) : (
                                    <div className="image-placeholder">
                                        <i className="fa-solid fa-graduation-cap"></i>
                                    </div>
                                )}
                                <div className="image-overlay">
                                    <span>Lihat Detail</span>
                                </div>
                            </div>

                            <div className="jurusan-info">
                                <h3>{item.jurusan}</h3>
                                <p>{item.deskripsi ? (item.deskripsi.length > 80 ? item.deskripsi.substring(0, 80) + '...' : item.deskripsi) : 'Belum ada deskripsi.'}</p>
                                <button className="btn-selengkapnya">
                                    Lihat Detail <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="no-data-wrapper">
                            <p>Belum ada data jurusan.</p>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {jurusan?.links && (
                    <div className="pagination">
                        {jurusan.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                className={`page-btn ${link.active ? 'active' : ''}`}
                                onClick={() => {
                                    if (link.url) {
                                        router.visit(link.url, { preserveScroll: false, preserveState: true });
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* POPUP DETAIL */}
            {selectedItem && (
                <div className="jurusan-modal active">
                    <div className="modal-overlay" onClick={() => setSelectedItem(null)}></div>
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setSelectedItem(null)}>&times;</button>

                        <div className="modal-header">
                            <h2>{selectedItem.jurusan}</h2>
                        </div>

                        <div className="modal-body">
                            <div className="modal-gallery">
                                {selectedItem.gambar1 && (
                                    <img src={`/storage/uploads/jurusan/${selectedItem.gambar1}`} alt="Preview 1" />
                                )}
                                {selectedItem.gambar2 && (
                                    <img src={`/storage/uploads/jurusan/${selectedItem.gambar2}`} alt="Preview 2" />
                                )}
                            </div>

                            <div className="modal-text">
                                <h3>Tentang Jurusan</h3>
                                <p>{selectedItem.deskripsi || 'Belum ada deskripsi.'}</p>

                                {parseProspek(selectedItem.prospek_kerja).length > 0 && (
                                    <div className="prospek-section">
                                        <h3><i className="fa-solid fa-briefcase"></i> Prospek Kerja</h3>
                                        <ul>
                                            {parseProspek(selectedItem.prospek_kerja).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* CRUD Actions */}
                            <div style={{
                                display: 'flex', gap: '12px', marginTop: '25px',
                                paddingTop: '20px', borderTop: '1px solid #e2e8f0',
                                justifyContent: 'flex-end', flexWrap: 'wrap',
                            }}>
                                <Link
                                    href={`/management/jurusan/${selectedItem.id_jurusan}/edit`}
                                    style={{
                                        padding: '10px 24px', background: '#1487f7', color: '#fff',
                                        border: 'none', borderRadius: '8px', fontWeight: 600,
                                        fontSize: '14px', textDecoration: 'none',
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(selectedItem.id_jurusan)}
                                    style={{
                                        padding: '10px 24px', background: '#ef4444', color: '#fff',
                                        border: 'none', borderRadius: '8px', fontWeight: 600,
                                        fontSize: '14px', cursor: 'pointer',
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        transition: 'all 0.2s',
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
