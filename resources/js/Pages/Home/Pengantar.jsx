import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Pengantar({ informasi }) {
    return (
        <MainLayout>
            <Head title="Pengantar" />
            <div className="header-bar">
                <a href="#">HOME / Pengantar</a>
            </div>
            <div style={{ padding: '40px 30px', maxWidth: '900px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#1e293b', marginBottom: '25px', textAlign: 'center' }}>
                    PENGANTAR
                </h2>

                {/* Profil Pengantar */}
                {informasi?.pengantar_nama && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                        {/* Foto 4x6 */}
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
                                <img src={`/storage/uploads/pengantar/${informasi.pengantar_foto}`} alt={informasi.pengantar_nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <i className="fa-solid fa-user" style={{ fontSize: '60px', color: '#94a3b8' }}></i>
                            )}
                        </div>

                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '0 0 5px 0', textAlign: 'center' }}>
                            {informasi.pengantar_nama}
                        </h3>
                        {informasi.pengantar_jabatan && (
                            <p style={{ fontSize: '15px', color: '#475569', margin: '0 0 3px 0', fontWeight: 500 }}>
                                {informasi.pengantar_jabatan}
                            </p>
                        )}
                        {informasi.pengantar_nip && (
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                                NIP. {informasi.pengantar_nip}
                            </p>
                        )}
                    </div>
                )}

                <div style={{ fontSize: '16px', lineHeight: 1.8, color: '#555', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
                    {informasi?.pengantar || 'Belum ada data Pengantar.'}
                </div>
            </div>
        </MainLayout>
    );
}
