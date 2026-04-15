import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Persyaratan({ lowker }) {
    const { flash, auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        id_lowker: lowker.id_lowker,
        file_lamaran: null,
    });

    // Check if lowongan has expired
    const isExpired = lowker.tgl_ditutup && new Date(lowker.tgl_ditutup) < new Date(new Date().toDateString());

    const submit = (e) => {
        e.preventDefault();

        if (isExpired) {
            alert('Lowongan ini sudah ditutup dan tidak dapat dilamar lagi.');
            return;
        }
        
        // Check if user is logged in
        if (!auth?.user) {
            alert('Anda harus login terlebih dahulu untuk melamar');
            window.location.href = '/login/siswa';
            return;
        }

        if (auth?.user?.role !== 'alumni') {
            alert('Hanya siswa/alumni yang dapat melamar lowongan ini.');
            return;
        }
        
        // Submit dengan Inertia
        post('/lamaran', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <MainLayout>
            <Head title={`Persyaratan - ${lowker.judul_lowker}`} />
            <div className="header-bar"><a href="#">Lowongan Kerja / Persyaratan</a></div>
            <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '10px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {flash?.success && <div className="alert alert-success">{flash.success}</div>}
                    {flash?.error && <div className="alert alert-error">{flash.error}</div>}

                    {isExpired && (
                        <div style={{
                            background: '#fff3cd',
                            border: '1px solid #ffc107',
                            color: '#856404',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>
                            ⚠️ Lowongan ini sudah ditutup pada {lowker.tgl_ditutup} dan tidak dapat dilamar lagi.
                        </div>
                    )}
                    
                    <h2 style={{ color: '#134CBC', marginBottom: '15px' }}>{lowker.judul_lowker}</h2>
                    <p><strong>Perusahaan:</strong> {lowker.perusahaan?.nama}</p>
                    <hr style={{ margin: '20px 0' }} />
                    <h3>Persyaratan</h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#555' }}>
                        {lowker.kualifikasi}
                    </div>
                    
                    <hr style={{ margin: '20px 0' }} />

                    {isExpired ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>
                                Pendaftaran Ditutup
                            </p>
                            <a href="/loker" style={{ textDecoration: 'none' }}>
                                <button className="search-button">KEMBALI KE DAFTAR LOKER</button>
                            </a>
                        </div>
                    ) : (
                        <>
                            <h3 style={{ color: '#134CBC' }}>Formulir Lamaran</h3>
                            <form onSubmit={submit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                        Upload CV/lamaran (PDF/DOC/DOCX)
                                    </label>
                                    <input 
                                        type="file" 
                                        accept=".pdf,.doc,.docx"
                                        required
                                        onChange={e => setData('file_lamaran', e.target.files[0])}
                                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                    {errors.file_lamaran && <span style={{ color: 'red', fontSize: '12px' }}>{errors.file_lamaran}</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        type="submit" 
                                        className="detail-button"
                                        disabled={processing}
                                        style={{ cursor: processing ? 'not-allowed' : 'pointer' }}
                                    >
                                        {processing ? 'Loading...' : 'LAMAR SEKARANG'}
                                    </button>
                                    <a href={`/loker/${lowker.id_lowker}`} style={{ textDecoration: 'none' }}>
                                        <button type="button" className="search-button">KEMBALI</button>
                                    </a>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
