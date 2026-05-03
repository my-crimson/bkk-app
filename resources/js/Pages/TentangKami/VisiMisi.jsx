import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function VisiMisi({ informasi }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => { 
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    } 
                });
            }, { threshold: 0.1 });
            
            observer.observe(ref.current);
            return () => observer.disconnect();
        }
    }, []);

    return (
        <MainLayout>
            <Head title="Visi Misi BKK" />
            
            <div className="header-bar">
                <a href="#">TENTANG KAMI / Visi Misi</a>
            </div>

            {/* Container Utama */}
            <div className="responsive-container" style={{ 
                padding: '60px 20px', 
                backgroundColor: '#f8fafc', 
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div 
                    ref={ref}
                    style={{ 
                        width: '100%',
                        maxWidth: '900px', 
                        opacity: '0',
                        transform: 'translateY(20px)',
                        transition: 'all 0.8s ease-out'
                    }}
                >
                    {/* Judul Utama */}
                    <h2 className="responsive-title" style={{ 
                        fontSize: '30px', 
                        fontWeight: 800, 
                        color: '#1e293b', 
                        marginBottom: '10px', 
                        textAlign: 'center',
                        textTransform: 'uppercase'
                    }}>
                        VISI & MISI
                    </h2>

                    <div style={{ 
                        width: '60px', 
                        height: '4px', 
                        backgroundColor: '#3b82f6', 
                        margin: '0 auto 40px auto',
                        borderRadius: '2px'
                    }}></div>

                    {/* Kontainer Isi */}
                    <div className="content-box" style={{ 
                        background: '#ffffff',
                        padding: '40px', 
                        borderRadius: '16px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0',
                        lineHeight: '1.8'
                    }}>
                        <div style={{ 
                            fontSize: '16px', 
                            color: '#555', 
                            whiteSpace: 'pre-wrap', 
                            textAlign: 'justify'
                        }}>
                            {informasi?.visi_misi || 'Belum ada data Visi Misi.'}
                        </div>
                    </div>

                    {/* Footer Sederhana */}
                    <div style={{ 
                        marginTop: '40px', 
                        textAlign: 'center', 
                        borderTop: '1px solid #e2e8f0', 
                        paddingTop: '20px' 
                    }}>
                        <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
                            Bursa Kerja Khusus SMKN 1 BOYOLANGU
                        </p>
                    </div>
                </div>
            </div>

            {/* Responssif */}
            <style>{`
                /* Pengaturan untuk Layar Kecil (HP) */
                @media (max-width: 640px) {
                    .responsive-title {
                        font-size: 24px !important;
                    }
                    .content-box {
                        padding: 20px !important; /* Padding lebih kecil di HP */
                        border-radius: 12px !important;
                    }
                    .responsive-container {
                        padding: 30px 15px !important;
                    }
                }

            `}</style>
        </MainLayout>
    );
}