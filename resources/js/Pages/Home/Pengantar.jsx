import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function Pengantar({ informasi }) {
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
            <Head title="Pengantar" />
            <div className="header-bar">
                <a href="#">HOME / Pengantar</a>
            </div>

            {/* Container Utama:*/}
            <div className="pengantar-container" style={{ 
                padding: '40px 20px', 
                maxWidth: '900px', 
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
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
                    <h2 className="title-text" style={{ 
                        fontSize: '30px', 
                        fontWeight: 800, 
                        color: '#1e293b', 
                        marginBottom: '10px', 
                        textAlign: 'center',
                        textTransform: 'uppercase'
                    }}>
                        PENGANTAR
                    </h2>

                    <div style={{ 
                        width: '60px', 
                        height: '4px', 
                        backgroundColor: '#3b82f6', 
                        margin: '0 auto 40px auto',
                        borderRadius: '2px'
                    }}></div>

                    {/* Profil Pengantar */}
                    {informasi?.pengantar_nama && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                            {/* Foto 4x6: Ukuran tetap aman untuk mobile */}
                            <div style={{ 
                                width: '160px', 
                                height: '213px', 
                                borderRadius: '10px', 
                                border: '3px solid #e2e8f0', 
                                overflow: 'hidden', 
                                background: '#f1f5f9',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                {informasi.pengantar_foto ? (
                                    <img 
                                        src={`/storage/uploads/pengantar/${informasi.pengantar_foto}`} 
                                        alt={informasi.pengantar_nama} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <i className="fa-solid fa-user" style={{ fontSize: '60px', color: '#94a3b8' }}></i>
                                )}
                            </div>

                            <h3 className="name-text" style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '0 0 5px 0', textAlign: 'center' }}>
                                {informasi.pengantar_nama}
                            </h3>
                            {informasi.pengantar_jabatan && (
                                <p style={{ fontSize: '15px', color: '#475569', margin: '0 0 3px 0', fontWeight: 500, textAlign: 'center' }}>
                                    {informasi.pengantar_jabatan}
                                </p>
                            )}
                            {informasi.pengantar_nip && (
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, textAlign: 'center' }}>
                                    NIP. {informasi.pengantar_nip}
                                </p>
                            )}
                        </div>
                    )}


                    <div className="content-text" style={{ 
                        fontSize: '16px', 
                        lineHeight: 1.8, 
                        color: '#555', 
                        whiteSpace: 'pre-wrap', 
                        marginBottom: '40px',
                        textAlign: 'justify' 
                    }}>
                        {informasi?.pengantar || 'Belum ada data Pengantar.'}
                    </div>
                </div>
            </div>

            {/* Responsif */}
            <style>{`
                @media (max-width: 640px) {
                    .pengantar-container {
                        padding: 30px 15px !important;
                    }
                    .title-text {
                        font-size: 24px !important;
                    }
                    .name-text {
                        font-size: 18px !important;
                    }
                    .content-text {
                        font-size: 15px !important;
                        line-height: 1.6 !important;
                    }
                }
            `}</style>
        </MainLayout>
    );
}