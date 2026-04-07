import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Proker() {
    return (
        <MainLayout>
            <Head title="Program Kerja BKK" />
            <div className="header-bar"><a href="#">TENTANG KAMI / Program Kerja</a></div>
            <div className="visi-misi show">
                <h2>PROGRAM KERJA BKK SMKN 1 BOYOLANGU</h2>
                <ol>
                    <li>Mendata pencari kerja (alumni) yang belum mendapatkan pekerjaan.</li>
                    <li>Mendata lowongan kesempatan kerja yang diterima dari perusahaan/instansi.</li>
                    <li>Mengadakan bimbingan karir bagi siswa kelas XII.</li>
                    <li>Mengadakan rekrutmen dan seleksi tenaga kerja.</li>
                    <li>Mengirimkan tenaga kerja ke perusahaan/instansi yang membutuhkan.</li>
                    <li>Mengadakan verifikasi data alumni.</li>
                    <li>Membuat laporan kegiatan BKK secara periodik.</li>
                </ol>
            </div>
        </MainLayout>
    );
}
