import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { useState, useEffect, useRef } from 'react';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function ManagementLokerIndex({ lowker, jurusanList, filters }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
        }, { threshold: 0.1 });
        cardsRef.current.forEach(el => { if (el) observer.observe(el); });
        return () => observer.disconnect();
    }, [lowker]);

    useEffect(() => {
        if (!selectedItem) return;
        const handleEsc = (e) => { if (e.key === 'Escape') setSelectedItem(null); };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleEsc); };
    }, [selectedItem]);

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/management/loker', {
            jurusan: formData.get('jurusan'),
            lokasi: formData.get('lokasi')
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = async (id) => {
        if (!(await confirmAction('hapus lowongan kerja'))) return;
        router.delete(`/management/loker/${id}`, {
            onSuccess: () => {
                notifyActionSuccess('hapus lowongan kerja');
                setSelectedItem(null);
            },
        });
    };

    const data = lowker?.data || [];
    const links = lowker?.links || [];
    const from = lowker?.from || 0;
    const to = lowker?.to || 0;
    const total = lowker?.total || 0;

    const isExpired = (tgl) => tgl && new Date(tgl) < new Date(new Date().toDateString());

    return (
        <MainLayout>
            <Head title="CRUD Lowongan Kerja" />
            <div className="header-bar"><a href="#">Lowongan Kerja</a></div>

            <div className="search-container">
                <form className="search" onSubmit={handleFilter}>
                    <label htmlFor="jurusan">Pencarian:</label>
                    <select id="jurusan" name="jurusan" className="search-select" defaultValue={filters?.jurusan || ''}>
                        <option value="">SEMUA KATEGORI/JURUSAN</option>
                        {jurusanList?.map((j, i) => <option key={i} value={j}>{j}</option>)}
                    </select>
                    <input type="text" className="search-input" name="lokasi" placeholder="Masukkan Lokasi" defaultValue={filters?.lokasi || ''} />
                    <button className="search-button" type="submit">Cari</button>
                </form>
            </div>

            <div className="job-list">
                {/* Tambah Card */}
                <div
                    id="tambah-loker"
                    className="job-card show"
                    style={{
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        background: '#f8fafc', border: '2px dashed #cbd5e1',
                        boxShadow: 'none', height: 'auto', minHeight: '200px',
                    }}
                >
                    <Link href="/management/loker/create" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-plus" style={{ fontSize: '32px', color: '#134CBC' }}></i>
                        <p style={{ fontWeight: 600, color: '#134CBC', fontSize: '14px', margin: 0 }}>Tambahkan Lowongan</p>
                    </Link>
                </div>

                {data.map((row, idx) => (
                    <div
                        className="job-card"
                        key={row.id_lowker}
                        ref={el => cardsRef.current[idx] = el}
                        onClick={() => setSelectedItem(row)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="job-header">
                            <h3>{row.perusahaan?.nama}</h3>
                        </div>
                        <div className="job-detail">
                            <ul>
                                <li><i className="fa-solid fa-building"></i>{row.perusahaan?.nama}</li>
                                <li><i className="fa-solid fa-location-dot"></i>{row.lokasi}</li>
                                <li><i className="fa-regular fa-clock"></i>{row.tgl_posting}</li>
                                <li style={{ color: isExpired(row.tgl_ditutup) ? 'red' : '#e56911' }}>exp: {row.tgl_ditutup}</li>
                            </ul>
                            <p className="job-role">{row.judul_lowker}</p>
                            <div className="line"></div>
                            <div className="job-tags"><p>{row.jurusan?.jurusan}</p></div>
                        </div>
                        <div className="job-footer">
                            <button className="detail-button" onClick={(e) => { e.stopPropagation(); setSelectedItem(row); }}>
                                <i className="fas fa-info-circle"></i> DETAIL
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            {links.length > 0 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        <p>Ditampilkan <strong>{from}</strong> sampai <strong>{to}</strong> dari total <strong>{total}</strong> lowongan kerja</p>
                    </div>
                    <div className="pagination">
                        {links.map((link, i) => (
                            <Link key={i} href={link.url || '#'}
                                className={`${link.active ? 'active' : ''} ${link.label.includes('Previous') || link.label.includes('Next') ? 'navigate' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
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
                            <h2 className="kegiatan-popup-title">{selectedItem.judul_lowker}</h2>
                            <button className="close-popup" onClick={() => setSelectedItem(null)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="kegiatan-popup-body">
                            {/* Info Grid */}
                            <div className="kegiatan-popup-info-grid">
                                <div className="info-item">
                                    <i className="fa-solid fa-building"></i>
                                    <div className="info-text">
                                        <strong>Perusahaan</strong>
                                        <span>{selectedItem.perusahaan?.nama || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <div className="info-text">
                                        <strong>Lokasi</strong>
                                        <span>{selectedItem.lokasi || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-money-bill-wave"></i>
                                    <div className="info-text">
                                        <strong>Gaji</strong>
                                        <span>{selectedItem.gaji || 'Tidak dicantumkan'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                    <div className="info-text">
                                        <strong>Jurusan</strong>
                                        <span>{selectedItem.jurusan?.jurusan || 'Semua Jurusan'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-regular fa-calendar-check"></i>
                                    <div className="info-text">
                                        <strong>Posting</strong>
                                        <span>{selectedItem.tgl_posting || '-'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <i className="fa-regular fa-calendar-xmark"></i>
                                    <div className="info-text">
                                        <strong>Batas Akhir</strong>
                                        <span style={{ color: isExpired(selectedItem.tgl_ditutup) ? '#dc3545' : 'inherit' }}>
                                            {selectedItem.tgl_ditutup || '-'}
                                            {isExpired(selectedItem.tgl_ditutup) && ' (DITUTUP)'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="kegiatan-popup-description">
                                <h3>Deskripsi Pekerjaan</h3>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedItem.deskripsi || '-'}</p>
                            </div>

                            {selectedItem.persyaratan && (
                                <div className="kegiatan-popup-description" style={{ marginTop: '15px' }}>
                                    <h3>Persyaratan</h3>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedItem.persyaratan}</p>
                                </div>
                            )}

                            {/* CRUD Actions */}
                            <div style={{
                                display: 'flex', gap: '12px', marginTop: '25px',
                                paddingTop: '20px', borderTop: '1px solid #e2e8f0',
                                justifyContent: 'flex-end', flexWrap: 'wrap',
                            }}>
                                <Link
                                    href={`/management/loker/${selectedItem.id_lowker}/edit`}
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
                                    onClick={() => handleDelete(selectedItem.id_lowker)}
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
