import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Detail({ lowker }) {
    // Check if lowongan has expired
    const isExpired = lowker.tgl_ditutup && new Date(lowker.tgl_ditutup) < new Date(new Date().toDateString());

    return (
        <MainLayout>
            <Head title={`Detail - ${lowker.judul_lowker}`} />
            <div className="header-bar"><a href="#">Lowongan Kerja / Detail</a></div>
            <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '15px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                    {/* Header Section */}
                    <div style={{ borderBottom: '2px solid #f0f0f5', paddingBottom: '20px', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h1 style={{ color: '#134CBC', fontSize: '32px', margin: '0 0 10px 0', fontWeight: 'bold' }}>{lowker.judul_lowker}</h1>
                            <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '15px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fa-solid fa-building" style={{color: '#3590FA'}}></i> {lowker.perusahaan?.nama}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fa-solid fa-location-dot" style={{color: '#e56911'}}></i> {lowker.lokasi}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', textAlign: 'right' }}>
                            {isExpired && (
                                <div style={{ background: '#ffebee', color: '#dc3545', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', border: '1px solid #ffcdd2', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="fa-solid fa-clock-rotate-left"></i> DITUTUP
                                </div>
                            )}
                            <div style={{ background: '#f8f9fa', padding: '10px 15px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '13px', color: '#555' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <i className="fa-regular fa-calendar-check" style={{ color: '#28a745', width: '14px' }}></i>
                                    <span>Posting: <strong>{lowker.tgl_posting}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isExpired ? '#dc3545' : '#555' }}>
                                    <i className="fa-regular fa-calendar-xmark" style={{ color: isExpired ? '#dc3545' : '#e56911', width: '14px' }}></i>
                                    <span>Batas Akhir: <strong>{lowker.tgl_ditutup}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                        <div style={{ background: '#f8f9fa', padding: '18px', borderRadius: '10px', borderLeft: '4px solid #134CBC', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(19,76,188,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#134CBC', fontSize: '18px' }}>
                                <i className="fa-solid fa-money-bill-wave"></i>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '13px', color: '#777', fontWeight: '600', textTransform: 'uppercase' }}>Gaji</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{lowker.gaji || 'Tidak dicantumkan'}</p>
                            </div>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '18px', borderRadius: '10px', borderLeft: '4px solid #3590FA', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(53,144,250,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#3590FA', fontSize: '18px' }}>
                                <i className="fa-solid fa-graduation-cap"></i>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '13px', color: '#777', fontWeight: '600', textTransform: 'uppercase' }}>Jurusan</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{lowker.jurusan?.jurusan || 'Semua Jurusan'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi & Persyaratan */}
                    <div style={{ marginBottom: '35px' }}>
                        <h3 style={{ color: '#134CBC', borderBottom: '2px solid #f0f0f5', paddingBottom: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px' }}>
                            <i className="fa-solid fa-file-lines"></i> Deskripsi Pekerjaan
                        </h3>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#444', fontSize: '15px' }}>
                            {lowker.deskripsi}
                        </div>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ color: '#134CBC', borderBottom: '2px solid #f0f0f5', paddingBottom: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px' }}>
                            <i className="fa-solid fa-list-check"></i> Persyaratan
                        </h3>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#444', fontSize: '15px' }}>
                            {lowker.persyaratan}
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {isExpired ? (
                            <button style={{ padding: '14px 25px', background: '#e0e0e0', color: '#666', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'not-allowed', flex: 1, minWidth: '200px' }}>
                                PENDAFTARAN DITUTUP
                            </button>
                        ) : (
                            <Link href={`/loker/${lowker.id_lowker}/persyaratan`} style={{ flex: 1, textDecoration: 'none', minWidth: '200px' }}>
                                <button style={{ padding: '14px 25px', background: '#134CBC', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%', transition: 'all 0.3s', boxShadow: '0 4px 10px rgba(19,76,188,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <i className="fa-solid fa-paper-plane"></i> LAMAR SEKARANG
                                </button>
                            </Link>
                        )}
                        <Link href="/loker" style={{ textDecoration: 'none' }}>
                            <button style={{ padding: '14px 30px', background: 'white', color: '#333', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#f0f0f0'; e.currentTarget.style.borderColor = '#999'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#ccc'; }}
                            >
                                <i className="fa-solid fa-arrow-left"></i> KEMBALI
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
