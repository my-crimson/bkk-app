import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function StrukturOrganisasi({ struktur, informasi }) {
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

    const DEFAULT_LEVELS = [
        { level: 1, label: 'Pelindung' },
        { level: 2, label: 'Pembina' },
        { level: 3, label: 'Penanggungjawab' },
        { level: 4, label: 'Ketua BKK' },
        { level: 5, label: 'Petugas' },
    ];
    
    const levelOptions = informasi?.level_options && informasi.level_options.length > 0
        ? informasi.level_options
        : DEFAULT_LEVELS;

    const levels = {};
    if (struktur) {
        struktur.forEach(item => {
            if (!levels[item.level]) levels[item.level] = [];
            levels[item.level].push(item);
        });
    }
    
    const sortedLevels = Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <MainLayout>
            <Head title="Struktur Organisasi BKK" />
            
            <div className="header-bar">
                <a href="#">TENTANG KAMI / Struktur Organisasi</a>
            </div>
            
            <div className="main-container" style={{ 
                padding: '60px 20px', 
                textAlign: 'center', 
                background: '#f8fafc', 
                minHeight: '100vh',
                overflowX: 'hidden' 
            }}>
                <div 
                    ref={ref}
                    style={{ 
                        opacity: '0',
                        transform: 'translateY(30px)',
                        transition: 'all 0.8s ease-out'
                    }}
                >
                    <h2 className="title-responsive" style={{ 
                        fontSize: '32px', 
                        fontWeight: 800, 
                        color: '#1e293b', 
                        marginBottom: '10px', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px' 
                    }}>
                        Struktur Organisasi BKK
                    </h2>
                    
                    <div style={{ 
                        width: '60px', 
                        height: '4px', 
                        backgroundColor: '#3b82f6', 
                        margin: '0 auto 50px auto',
                        borderRadius: '2px'
                    }}></div>

                    <div className="org-chart-wrapper" style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '40px' 
                    }}>
                        {sortedLevels.length > 0 ? (
                            sortedLevels.map((level, index) => (
                                <div key={level} className="level-row" style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    position: 'relative', 
                                    width: '100%' 
                                }}>
   
                                    {index > 0 && (
                                        <div className="line-vertical" style={{ width: '2px', height: '40px', background: '#cbd5e1', position: 'absolute', top: '-40px' }}></div>
                                    )}
                                    
                                    <div className="cards-container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px', position: 'relative' }}>

                                        {index > 0 && levels[level].length > 1 && (
                                            <div className="line-horizontal" style={{ position: 'absolute', top: '-20px', left: '50px', right: '50px', height: '2px', background: '#cbd5e1' }}></div>
                                        )}

                                        {levels[level].map(item => (
                                            <div key={item.id} className="card-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
                                                {index > 0 && (
                                                    <div className="line-connector" style={{ width: '2px', height: '20px', background: '#cbd5e1', marginBottom: '0px', display: levels[level].length > 1 ? 'block' : 'none' }}></div>
                                                )}

                                                <div className="org-card" style={{ 
                                                    background: '#ffffff', 
                                                    border: '1px solid #e2e8f0', 
                                                    borderRadius: '16px', 
                                                    padding: '25px', 
                                                    width: '260px', 
                                                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    transition: 'all 0.3s ease',
                                                    zIndex: 2
                                                }}>
                                                    <div className="jabatan-badge" style={{ 
                                                        background: '#134CBC', 
                                                        color: 'white', 
                                                        padding: '6px 16px', 
                                                        borderRadius: '20px', 
                                                        fontSize: '11px', 
                                                        fontWeight: 'bold', 
                                                        textTransform: 'uppercase',
                                                        marginBottom: '15px',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {item.jabatan}
                                                    </div>

                                                    <div className="photo-frame" style={{ 
                                                        width: '80px', 
                                                        height: '80px', 
                                                        borderRadius: '50%', 
                                                        background: '#f1f5f9', 
                                                        border: '3px solid #e2e8f0',
                                                        display: 'flex', 
                                                        justifyContent: 'center', 
                                                        alignItems: 'center',
                                                        marginBottom: '12px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {item.foto_profil ? (
                                                            <img src={`/storage/uploads/struktur/${item.foto_profil}`} alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <i className="fa-solid fa-user" style={{ fontSize: '30px', color: '#94a3b8' }}></i>
                                                        )}
                                                    </div>
                                                    
                                                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#334155', margin: '0 0 5px 0', textAlign: 'center' }}>
                                                        {item.nama}
                                                    </h3>
                                                    
                                                    {item.nip && (
                                                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                                                            NIP. {item.nip}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '50px', color: '#64748b', fontSize: '18px' }}>
                                Struktur organisasi belum tersedia.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .org-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                    border-color: #134CBC !important;
                }

                @media (max-width: 768px) {
                    .title-responsive {
                        font-size: 22px !important;
                    }
                    .org-card {
                        width: 220px !important;
                        padding: 20px !important;
                    }
                    /* Sembunyikan garis di mobile agar tidak berantakan jika card stack */
                    .line-horizontal, .line-vertical {
                        display: none;
                    }
                    .org-chart-wrapper {
                        gap: 20px !important;
                    }
                    .cards-container {
                        gap: 15px !important;
                    }
                }

                @media (max-width: 480px) {
                    .org-card {
                        width: 100% !important;
                        max-width: 280px;
                    }
                }

            `}</style>
        </MainLayout>
    );
}