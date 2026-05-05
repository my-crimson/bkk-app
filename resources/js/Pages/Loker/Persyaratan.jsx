import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess, notifyActionError } from '@/Helpers/actionPopup';

export default function Persyaratan({ lowker }) {
    const { flash, auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        id_lowker: lowker.id_lowker,
        file_cv: null,
        file_lamaran: null,
    });

    // Check if lowongan has expired
    const isExpired = lowker.tgl_ditutup && new Date(lowker.tgl_ditutup) < new Date(new Date().toDateString());

    const submit = async (e) => {
        e.preventDefault();

        if (isExpired) {
            notifyActionError('Lowongan ini sudah ditutup dan tidak dapat dilamar lagi.');
            return;
        }
        
        // Check if user is logged in
        if (!auth?.user) {
            notifyActionError('Anda harus login terlebih dahulu untuk melamar');
            window.location.href = '/login/siswa';
            return;
        }

        if (auth?.user?.role !== 'alumni') {
            notifyActionError('Hanya siswa/alumni yang dapat melamar lowongan ini.');
            return;
        }
        if (!(await confirmAction('kirim lamaran'))) return;
        
        // Submit dengan Inertia
        post('/lamaran', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => notifyActionSuccess('kirim lamaran'),
        });
    };

    return (
        <MainLayout>
            <Head title={`Persyaratan - ${lowker.judul_lowker}`} />
            <div className="header-bar"><a href="#">Lowongan Kerja / Persyaratan</a></div>
            <div className="persyaratan-wrapper" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
                <div className="persyaratan-card" style={{ background: 'white', borderRadius: '15px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', boxSizing: 'border-box', overflow: 'hidden' }}>
                    {flash?.success && <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #28a745' }}>{flash.success}</div>}
                    {flash?.error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #dc3545' }}>{flash.error}</div>}

                    {isExpired && (
                        <div style={{ background: '#fff3cd', border: '1px solid #ffeb3b', color: '#856404', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '20px' }}></i> Lowongan ini sudah ditutup pada {lowker.tgl_ditutup} dan tidak dapat dilamar lagi.
                        </div>
                    )}
                    
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <h1 style={{ color: '#134CBC', fontSize: '28px', margin: '0 0 10px 0', fontWeight: 'bold', wordBreak: 'break-word' }}>{lowker.judul_lowker}</h1>
                        <p style={{ color: '#666', fontSize: '18px', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-building" style={{ color: '#3590FA' }}></i> {lowker.perusahaan?.nama}
                        </p>
                    </div>

                    <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #134CBC', marginBottom: '35px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ color: '#333', margin: '0 0 15px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-list-check" style={{ color: '#134CBC' }}></i> Persyaratan Lengkap
                        </h3>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#555', fontSize: '15px' }}>
                            {lowker.persyaratan}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div style={{ borderTop: '2px solid #f0f0f5', paddingTop: '35px' }}>
                        {isExpired ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>
                                    <i className="fa-solid fa-ban"></i> Pendaftaran Telah Ditutup
                                </p>
                                <a href="/loker" style={{ textDecoration: 'none' }}>
                                    <button style={{ padding: '12px 30px', background: '#f8f9fa', color: '#333', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                                        KEMBALI KE DAFTAR LOKER
                                    </button>
                                </a>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ color: '#134CBC', margin: '0 0 25px 0', textAlign: 'center', fontSize: '22px' }}>Formulir Lamaran</h3>
                                
                                <form onSubmit={submit} style={{ maxWidth: '800px', margin: '0 auto' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                                        {/* Box CV */}
                                        <div style={{ background: '#f4f7fb', padding: '30px 20px', borderRadius: '12px', border: '2px dashed #a0c4ff', textAlign: 'center', transition: 'all 0.3s' }}>
                                            <i className="fa-solid fa-file-pdf" style={{ fontSize: '40px', color: '#3590FA', marginBottom: '15px' }}></i>
                                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
                                                Upload CV
                                            </label>
                                            <p style={{ fontSize: '13px', color: '#777', marginBottom: '20px' }}>Format: PDF, DOC, DOCX (Maks. 5MB)</p>
                                            
                                            <input 
                                                type="file" 
                                                accept=".pdf,.doc,.docx"
                                                required
                                                onChange={e => setData('file_cv', e.target.files[0])}
                                                style={{ width: '100%', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', boxSizing: 'border-box', fontSize: '13px' }}
                                            />
                                            {errors.file_cv && <span style={{ color: '#dc3545', fontSize: '13px', display: 'block', marginTop: '10px', fontWeight: '600' }}>{errors.file_cv}</span>}
                                        </div>

                                        {/* Box Lamaran */}
                                        <div style={{ background: '#f8f9fa', padding: '30px 20px', borderRadius: '12px', border: '2px dashed #a0c4ff', textAlign: 'center', transition: 'all 0.3s' }}>
                                            <i className="fa-solid fa-file-word" style={{ fontSize: '40px', color: '#134CBC', marginBottom: '15px' }}></i>
                                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
                                                Upload Dokumen Lamaran
                                            </label>
                                            <p style={{ fontSize: '13px', color: '#777', marginBottom: '20px' }}>Format: PDF, DOC, DOCX (Maks. 5MB)</p>
                                            
                                            <input 
                                                type="file" 
                                                accept=".pdf,.doc,.docx"
                                                required
                                                onChange={e => setData('file_lamaran', e.target.files[0])}
                                                style={{ width: '100%', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', boxSizing: 'border-box', fontSize: '13px' }}
                                            />
                                            {errors.file_lamaran && <span style={{ color: '#dc3545', fontSize: '13px', display: 'block', marginTop: '10px', fontWeight: '600' }}>{errors.file_lamaran}</span>}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            style={{ flex: 1, minWidth: '200px', padding: '14px 20px', background: '#134CBC', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1, transition: 'all 0.3s', boxShadow: '0 4px 10px rgba(19,76,188,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                                        >
                                            {processing ? <><i className="fa-solid fa-spinner fa-spin"></i> MENGIRIM...</> : <><i className="fa-solid fa-paper-plane"></i> KIRIM LAMARAN</>}
                                        </button>
                                        <a href={`/loker/${lowker.id_lowker}`} style={{ textDecoration: 'none' }}>
                                            <button type="button" style={{ padding: '14px 30px', background: 'white', color: '#333', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                                BATAL
                                            </button>
                                        </a>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
