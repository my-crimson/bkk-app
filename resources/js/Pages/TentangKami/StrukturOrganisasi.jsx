import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function StrukturOrganisasi({ struktur, informasi }) {
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

    const getLevelLabel = (level) => {
        const found = levelOptions.find(l => l.level === level);
        return found ? found.label : `Level ${level}`;
    };

    // Group by level
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
            <div className="header-bar"><a href="#">TENTANG KAMI / Struktur Organisasi</a></div>
            
            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', minHeight: 'calc(100vh - 200px)' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', marginBottom: '50px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Struktur Organisasi BKK SMKN 1 Boyolangu
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
                    {sortedLevels.length > 0 ? (
                        sortedLevels.map((level, index) => (
                            <div key={level} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '100%' }}>
                                {/* Garis penghubung ke level atas */}
                                {index > 0 && (
                                    <div style={{ width: '2px', height: '40px', background: '#cbd5e1', position: 'absolute', top: '-40px' }}></div>
                                )}
                                
                                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px', position: 'relative' }}>
                                    {/* Garis horizontal jika lebih dari 1 card */}
                                    {index > 0 && levels[level].length > 1 && (
                                        <div style={{ position: 'absolute', top: '-20px', left: '15%', right: '15%', height: '2px', background: '#cbd5e1' }}></div>
                                    )}

                                    {levels[level].map(item => (
                                        <div key={item.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            {/* Garis vertikal penghubung card ke garis horizontal */}
                                            {index > 0 && levels[level].length > 1 && (
                                                <div style={{ width: '2px', height: '20px', background: '#cbd5e1', position: 'absolute', top: '-20px' }}></div>
                                            )}

                                            <div style={{ 
                                                background: '#ffffff', 
                                                border: '1px solid #e2e8f0', 
                                                borderRadius: '16px', 
                                                padding: '25px', 
                                                width: '260px', 
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                cursor: 'default'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)';
                                            }}
                                            >
                                                <div style={{ 
                                                    background: '#134CBC', 
                                                    color: 'white', 
                                                    padding: '6px 16px', 
                                                    borderRadius: '20px', 
                                                    fontSize: '12px', 
                                                    fontWeight: 'bold', 
                                                    textTransform: 'uppercase',
                                                    marginBottom: '20px',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {item.jabatan}
                                                </div>

                                                <div style={{ 
                                                    width: '90px', 
                                                    height: '90px', 
                                                    borderRadius: '50%', 
                                                    background: '#f1f5f9', 
                                                    border: '3px solid #e2e8f0',
                                                    display: 'flex', 
                                                    justifyContent: 'center', 
                                                    alignItems: 'center',
                                                    marginBottom: '15px',
                                                    overflow: 'hidden'
                                                }}>
                                                    {item.foto_profil ? (
                                                        <img src={`/storage/uploads/struktur/${item.foto_profil}`} alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <i className="fa-solid fa-user" style={{ fontSize: '36px', color: '#94a3b8' }}></i>
                                                    )}
                                                </div>
                                                
                                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 5px 0', textAlign: 'center' }}>
                                                    {item.nama}
                                                </h3>
                                                
                                                {item.nip && (
                                                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500 }}>
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
        </MainLayout>
    );
}
