import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function PerusahaanIndex({ perusahaan }) {
    return (
        <MainLayout>
            <Head title="Perusahaan" />
            <div className="header-bar"><a href="#">Perusahaan</a></div>
            <div className="perusahaan-container">
                <div className="perusahaan-grid">
                    {perusahaan && perusahaan.length > 0 ? perusahaan.map((p) => (
                        <div className="perusahaan-card" key={p.id_perusahaan}>
                            <h3>{p.nama}</h3>
                            <p><i className="fa-solid fa-location-dot" style={{ marginRight: '8px' }}></i>{p.alamat || '-'}</p>
                            <p><i className="fa-solid fa-envelope" style={{ marginRight: '8px' }}></i>{p.email || '-'}</p>
                            <p><i className="fa-solid fa-phone" style={{ marginRight: '8px' }}></i>{p.telepon || '-'}</p>
                            <p><i className="fa-solid fa-globe" style={{ marginRight: '8px' }}></i>{p.website || '-'}</p>
                            <p style={{ marginTop: '10px', color: '#888', fontSize: '13px' }}>{p.jenis_perusahaan} | {p.skala} | {p.jumlah_karyawan} karyawan</p>
                            {p.deskripsi_perusahaan && <p style={{ marginTop: '10px' }}>{p.deskripsi_perusahaan}</p>}
                        </div>
                    )) : (
                        <p className="no-data">Belum ada data perusahaan.</p>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
