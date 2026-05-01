import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Tujuan({ informasi }) {
    return (
        <MainLayout>
            <Head title="Tujuan BKK" />
            <div className="header-bar"><a href="#">TENTANG KAMI / Tujuan</a></div>
            <div className="visi-misi show" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {informasi?.tujuan || 'Belum ada data Tujuan.'}
            </div>
        </MainLayout>
    );
}
