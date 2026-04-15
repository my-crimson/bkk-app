import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function InfoKeg({ berita }) {
    return (
        <MainLayout>
            <Head title="Info Kegiatan" />
            <div className="header-bar">
                <a href="#">Info Kegiatan</a>
            </div>
            <div style={{ padding: '20px' }}>
                {berita && berita.length > 0 ? berita.map((item) => (
                    <div key={item.id_berita} style={{ marginBottom: '20px', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ color: '#134CBC' }}>{item.judul}</h3>
                        <p style={{ color: '#888', fontSize: '14px' }}>{item.tanggal} | {item.lokasi}</p>
                        <p style={{ marginTop: '10px', color: '#555' }}>{item.deskripsi}</p>
                    </div>
                )) : (
                    <p className="no-data">Belum ada info kegiatan.</p>
                )}
            </div>
        </MainLayout>
    );
}
