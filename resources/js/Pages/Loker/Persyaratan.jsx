import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Persyaratan({ lowker }) {
    return (
        <MainLayout>
            <Head title={`Persyaratan - ${lowker.judul_lowker}`} />
            <div className="header-bar"><a href="#">Lowongan Kerja / Persyaratan</a></div>
            <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '10px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#134CBC', marginBottom: '15px' }}>{lowker.judul_lowker}</h2>
                    <p><strong>Perusahaan:</strong> {lowker.perusahaan?.nama}</p>
                    <hr style={{ margin: '20px 0' }} />
                    <h3>Persyaratan</h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#555' }}>
                        {lowker.kualifikasi}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
