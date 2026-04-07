import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function Beranda() {
    const { auth } = usePage().props;
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('show');
                });
            }, { threshold: 0.1 });
            observer.observe(contentRef.current);
            return () => observer.disconnect();
        }
    }, []);

    return (
        <MainLayout className="beranda-page">
            <Head title="Beranda" />
            <div className="container">
                <section className="hero">
                    <div className="hero-content" ref={contentRef}>
                        <h1>Bursa Kerja Khusus <br /> SMKN 1 Boyolangu</h1>
                        <hr />
                        <div className="tagline"></div>
                        <p className="tagline">DREAM - ACTION - SUCCESS</p>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="video-button" target="_blank" rel="noreferrer">
                            Video Tutorial<i className="fa-regular fa-circle-play"></i>
                        </a>

                        {!auth?.user && (
                            <div className="login-options">
                                <Link href="/login/admin" className="login-card">
                                    <img src="/images/managementlogin.png" alt="Management Icon" className="icon" />
                                    <span>Management</span>
                                </Link>
                                <Link href="/login/siswa" className="login-card">
                                    <img src="/images/siswalogin.png" alt="Siswa/Alumni Icon" className="icon" />
                                    <span>Siswa / Alumni</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                <footer>
                    <p>&copy; 2024 Bursa Kerja Khusus SMKN 1 Boyolangu. All Rights Reserved.</p>
                </footer>
            </div>
        </MainLayout>
    );
}
