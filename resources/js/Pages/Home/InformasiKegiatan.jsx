import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function InformasiKegiatan({ berita }) {
    return (
        <MainLayout>
            <Head title="Informasi Kegiatan BKK" />
            <div className="header-bar">
                <a href="#">HOME / Informasi Kegiatan BKK</a>
            </div>
            <div style={{ padding: '20px' }}>
                <div className="job-list">
                    {berita && berita.length > 0 ? berita.map((item) => (
                        <div className="job-card show" key={item.id_berita} style={{ height: 'auto' }}>
                            <div className="job-header">
                                <h3>{item.judul}</h3>
                            </div>
                            <div className="job-detail">
                                <ul>
                                    <li><i className="fa-regular fa-calendar"></i>{item.tanggal}</li>
                                    <li><i className="fa-solid fa-location-dot"></i>{item.lokasi || '-'}</li>
                                    <li><i className="fa-solid fa-users"></i>{item.jml_peserta || '-'} peserta</li>
                                </ul>
                                <p style={{ padding: '0 20px 20px', textAlign: 'left', color: '#555' }}>
                                    {item.deskripsi}
                                </p>
                            </div>
                            {item.gambar && (
                                <div style={{ padding: '10px' }}>
                                    <img src={`/storage/uploads/kegiatan/${item.gambar}`} alt={item.judul}
                                        style={{ maxWidth: '100%', borderRadius: '5px' }} />
                                </div>
                            )}
                        </div>
                    )) : (
                        <p className="no-data">Belum ada informasi kegiatan.</p>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
