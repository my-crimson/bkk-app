import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function InfoKeg({ berita }) {
    const data = berita?.data ? berita.data : (Array.isArray(berita) ? berita : []);
    const links = berita?.links || [];
    const from = berita?.from || 0;
    const to = berita?.to || 0;
    const total = berita?.total || 0;

    return (
        <MainLayout>
            <Head title="Info Kegiatan" />
            <div className="header-bar">
                <a href="#">Info Kegiatan</a>
            </div>
            <div style={{ padding: '20px' }}>
                {data && data.length > 0 ? data.map((item) => (
                    <div key={item.id_berita} style={{ marginBottom: '20px', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ color: '#134CBC' }}>{item.judul}</h3>
                        <p style={{ color: '#888', fontSize: '14px' }}>{item.tanggal} | {item.lokasi}</p>
                        <p style={{ marginTop: '10px', color: '#555' }}>{item.deskripsi}</p>
                    </div>
                )) : (
                    <p className="no-data">Belum ada info kegiatan.</p>
                )}
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
