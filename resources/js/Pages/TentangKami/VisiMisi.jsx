import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function VisiMisi({ informasi }) {
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
                <section className="visi-misi" ref={ref} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {informasi?.visi_misi || 'Belum ada data Visi Misi.'}
                </section>
            </div>
        </MainLayout>
    );
}
