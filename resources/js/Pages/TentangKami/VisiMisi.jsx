import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function VisiMisi() {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
            }, { threshold: 0.1 });
            observer.observe(ref.current);
            return () => observer.disconnect();
        }
    }, []);

    return (
        <MainLayout>
            <Head title="Visi Misi BKK" />
            <div className="container">
                <div className="header-bar">
                    <a href="#">TENTANG KAMI / Visi Misi</a>
                </div>
                <section className="visi-misi" ref={ref}>
                    <h2>VISI BKK SMKN 1 BOYOLANGU</h2>
                    <p>Terwujudnya Bursa Kerja Khusus (BKK) yang mampu menjembatani pencari dan pemberi kerja serta menyalurkan tamatan yang dapat memenuhi tuntutan kebutuhan Usaha dan Industri memasuki Era Global.</p>
                    <h2>MISI BKK SMKN 1 BOYOLANGU</h2>
                    <ol>
                        <li>Menjadi pusat informasi lowongan pekerjaan yang aktual bagi siswa dan alumni SMKN 1 Boyolangu.</li>
                        <li>Menjalin kerjasama dengan Dunia Usaha/Industri untuk mengadakan pelatihan dan rekrutmen tenaga kerja bagi siswa dan alumni.</li>
                    </ol>
                </section>
            </div>
        </MainLayout>
    );
}
