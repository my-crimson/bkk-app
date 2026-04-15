import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Detail({ lowker }) {
    // Check if lowongan has expired
    const isExpired = lowker.tgl_ditutup && new Date(lowker.tgl_ditutup) < new Date(new Date().toDateString());

    return (
        <MainLayout>
            <Head title={`Detail - ${lowker.judul_lowker}`} />
            <div className="header-bar"><a href="#">Lowongan Kerja / Detail</a></div>
            <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '10px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#134CBC', marginBottom: '15px' }}>{lowker.judul_lowker}</h2>

                    {isExpired && (
                        <div style={{
                            display: 'inline-block',
                            background: '#dc3545',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginBottom: '15px',
                        }}>
                            DITUTUP
                        </div>
                    )}

                    <p><strong>Perusahaan:</strong> {lowker.perusahaan?.nama}</p>
                    <p><strong>Jurusan:</strong> {lowker.jurusan?.jurusan}</p>
                    <p><strong>Lokasi:</strong> {lowker.lokasi}</p>
                    <p><strong>Gaji:</strong> {lowker.gaji || '-'}</p>
                    <p><strong>Tanggal Posting:</strong> {lowker.tgl_posting}</p>
                    <p>
                        <strong>Tanggal Ditutup:</strong> {lowker.tgl_ditutup}
                        {isExpired && (
                            <span style={{ color: '#dc3545', fontWeight: 'bold', marginLeft: '8px' }}>
                                (Sudah Lewat)
                            </span>
                        )}
                    </p>
                    <hr style={{ margin: '20px 0' }} />
                    <h3>Deskripsi</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{lowker.deskripsi_lowker}</p>
                    <hr style={{ margin: '20px 0' }} />
                    <h3>Persyaratan</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{lowker.kualifikasi}</p>
                    <div style={{ marginTop: '20px' }}>
                        {isExpired ? (
                            <button
                                className="detail-button"
                                disabled
                                style={{
                                    opacity: 0.5,
                                    cursor: 'not-allowed',
                                    background: '#999',
                                }}
                            >
                                PENDAFTARAN DITUTUP
                            </button>
                        ) : (
                            <Link href={`/loker/${lowker.id_lowker}/persyaratan`}>
                                <button className="detail-button">LAMAR SEKARANG</button>
                            </Link>
                        )}
                        <Link href="/loker" style={{ marginLeft: '10px' }}>
                            <button className="search-button">KEMBALI</button>
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
