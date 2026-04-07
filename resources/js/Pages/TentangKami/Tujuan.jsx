import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Tujuan() {
    return (
        <MainLayout>
            <Head title="Tujuan BKK" />
            <div className="header-bar"><a href="#">TENTANG KAMI / Tujuan</a></div>
            <div className="visi-misi show">
                <h2>TUJUAN BKK SMKN 1 BOYOLANGU</h2>
                <ol>
                    <li>Sebagai wadah dalam mempertemukan tamatan dengan pencari kerja.</li>
                    <li>Memberikan layanan kepada tamatan sesuai dengan bakat, minat, dan kemampuannya.</li>
                    <li>Sebagai wadah dalam mempersiapkan, menampung dan menyalurkan tenaga kerja lulusan SMKN 1 Boyolangu.</li>
                    <li>Menjalin hubungan kerjasama dengan lembaga pemerintah dan swasta dalam hal penempatan lulusan.</li>
                </ol>
            </div>
        </MainLayout>
    );
}
