import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function StrukturOrganisasi() {
    return (
        <MainLayout>
            <Head title="Struktur Organisasi BKK" />
            <div className="header-bar"><a href="#">TENTANG KAMI / Struktur Organisasi</a></div>
            <div style={{ padding: '30px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '33px', fontWeight: 800, color: '#333', marginBottom: '20px' }}>
                    STRUKTUR ORGANISASI BKK SMKN 1 BOYOLANGU
                </h2>
                <img src="/images/strukturorg.png" alt="Struktur Organisasi" style={{ maxWidth: '80%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
            </div>
        </MainLayout>
    );
}
