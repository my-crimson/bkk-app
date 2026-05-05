import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function Beranda() {
    const { auth } = usePage().props;
    const contentRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1, 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, observerOptions);

        if (contentRef.current) {
            observer.observe(contentRef.current);
        }

        return () => {
            if (contentRef.current) {
                observer.unobserve(contentRef.current);
            }
        };
    }, []);

    return (
        <MainLayout className="beranda-page">
            <Head title="Beranda" />

            {/* Container utama dengan background image dari CSS */}
            <div className="container">
                <section className="hero">
                    {/* Ref diletakkan di sini untuk memicu animasi fade-in/up */}
                    <div className="hero-content" ref={contentRef}>
                        <h1>
                            Bursa Kerja Khusus <br /> 
                            <span>SMKN 1 Boyolangu</span>
                        </h1>
                        
                        <hr />
                        
                        <p className="tagline">DREAM - ACTION - SUCCESS</p>

                        <a 
                            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                            className="video-button" 
                            target="_blank" 
                            rel="noreferrer"
                        >
                            Video Tutorial
                            <i className="fa-regular fa-circle-play"></i>
                        </a>

                        {/* Opsi Login hanya muncul jika user belum terautentikasi */}
                        {!auth?.user && (
                            <div className="login-options">
                                <Link href="/login/management" className="login-card">
                                    <img 
                                        src="/images/managementlogin.png" 
                                        alt="Management Icon" 
                                        className="icon" 
                                    />
                                    <span>Management</span>
                                </Link>

                                <Link href="/login/siswa" className="login-card">
                                    <img 
                                        src="/images/siswalogin.png" 
                                        alt="Siswa/Alumni Icon" 
                                        className="icon" 
                                    />
                                    <span>Siswa / Alumni</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}