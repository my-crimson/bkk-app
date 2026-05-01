import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Proker({ informasi }) {
    return (
        <MainLayout>
            <Head title="Program Kerja BKK" />
            <div className="header-bar"><a href="#">TENTANG KAMI / Program Kerja</a></div>
            <div className="visi-misi show" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {informasi?.proker || 'Belum ada data Program Kerja.'}
            </div>
        </MainLayout>
    );
}
