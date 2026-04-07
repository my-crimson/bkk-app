import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Pengantar() {
    return (
        <MainLayout>
            <Head title="Pengantar" />
            <div className="header-bar">
                <a href="#">HOME / Pengantar</a>
            </div>
            <div style={{ padding: '30px' }}>
                <h2 style={{ fontSize: '33px', fontWeight: 800, color: '#333', marginBottom: '20px' }}>
                    PENGANTAR
                </h2>
                <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#555' }}>
                    Selamat datang di website resmi Bursa Kerja Khusus (BKK) SMKN 1 Boyolangu. BKK merupakan
                    lembaga yang dibentuk untuk mempertemukan pencari kerja dengan pemberi kerja. BKK berperan
                    penting dalam menyalurkan lulusan SMK ke dunia usaha dan industri yang membutuhkan tenaga
                    kerja terampil dan profesional.
                </p>
            </div>
        </MainLayout>
    );
}
