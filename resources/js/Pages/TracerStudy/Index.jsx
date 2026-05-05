import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';

export default function TracerStudyIndex({ rows = [], jurusan = [], filters = {}, summary = {} }) {
    const allowedCodes = ['RPL', 'TKI', 'TKJ', 'ANM', 'PSPT', 'ULW', 'AKL', 'MPLB', 'BD', 'DKV'];
    const [selectedSurvey, setSelectedSurvey] = useState(null);

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/management/tracer-study', {
            search: formData.get('search') || '',
            jurusan: filters.jurusan || '',
            status: formData.get('status') || '',
        }, { preserveState: true, replace: true });
    };

    return (
        <MainLayout>
            <Head title="Tracer Study" />
            <div className="header-bar"><a href="#">Tracer Study Alumni</a></div>
            <div className="tracer-container">
                <h2 className="tracer-title">TRACER STUDY DATA ALUMNI SMKN 1 BOYOLANGU</h2>

                <div className="tracer-pill-wrap">
                    {allowedCodes.map((code) => {
                        const params = new URLSearchParams();
                        params.set('jurusan', code);
                        if (filters.search) params.set('search', filters.search);
                        if (filters.status) params.set('status', filters.status);
                        return (
                            <Link
                                key={code}
                                href={`/management/tracer-study?${params.toString()}`}
                                className={`tracer-pill ${filters.jurusan === code ? 'active' : ''}`}
                                preserveScroll
                            >
                                {code}
                            </Link>
                        );
                    })}
                </div>

                <div className="search-container">
                    <form className="search" onSubmit={handleFilter}>
                        <label htmlFor="search-tracer">Pencarian:</label>
                        <input
                            id="search-tracer"
                            name="search"
                            className="search-input"
                            placeholder="Cari nama alumni..."
                            defaultValue={filters?.search || ''}
                        />
                        <label htmlFor="status-tracer">Status:</label>
                        <select
                            id="status-tracer"
                            name="status"
                            className="search-select"
                            defaultValue={filters?.status || ''}
                        >
                            <option value="">-- Semua Status --</option>
                            <option value="sudah">Sudah Mengisi</option>
                            <option value="belum">Belum Mengisi</option>
                        </select>
                        <button className="search-button" type="submit">Cari</button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
                    <h3 style={{ display: 'inline-block', fontSize: '36px', color: '#134CBC', fontWeight: '900', borderBottom: '4px solid #3590FA', paddingBottom: '10px', margin: 0 }}>
                        {summary.periode_label}
                    </h3>
                </div>

                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table className="rekap-table tracer-table">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Jurusan</th>
                            <th>Status Survey</th>
                            <th>Tanggal Survey</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length > 0 ? rows.map((r) => (
                            <tr key={r.id_alumni}>
                                <td>{r.no}</td>
                                <td>{r.nama}</td>
                                <td>{r.jurusan}</td>
                                <td>
                                    <span className={`tracer-status ${r.status_color}`}>
                                        {r.status_survey}
                                    </span>
                                </td>
                                <td>{r.tanggal_survey}</td>
                                <td>
                                    {r.survey_detail ? (
                                        <button
                                            type="button"
                                            className="tracer-detail-btn"
                                            onClick={() => setSelectedSurvey(r)}
                                        >
                                            Lihat Isi Survey
                                        </button>
                                    ) : (
                                        <span style={{ color: '#8f9aa8', fontSize: '13px' }}>-</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Belum ada data.</td></tr>
                        )}
                        <tr className="tracer-total-row">
                            <td colSpan="2">Jumlah Alumni :</td>
                            <td>{summary.total_alumni || 0}</td>
                            <td colSpan="3">
                                Sudah Mengisi: {summary.sudah_mengisi || 0} | Belum Mengisi: {summary.belum_mengisi || 0}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedSurvey && (
                <div className="tracer-survey-overlay" onClick={() => setSelectedSurvey(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
                    <div className="tracer-survey-modal" onClick={(e) => e.stopPropagation()} style={{ background: 'white', padding: '35px', borderRadius: '15px', width: '100%', maxWidth: '550px', boxShadow: '0 15px 40px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease-out' }}>
                        <div className="tracer-survey-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f5', paddingBottom: '15px', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, color: '#134CBC', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                                <i className="fa-solid fa-clipboard-list" style={{ color: '#3590FA' }}></i> Detail Survey Alumni
                            </h3>
                            <button type="button" onClick={() => setSelectedSurvey(null)} style={{ background: '#ffebee', color: '#dc3545', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#ffcdd2'} onMouseOut={(e) => e.currentTarget.style.background = '#ffebee'}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div style={{ marginBottom: '25px', fontSize: '15px', lineHeight: '1.8' }}>
                            <div style={{ display: 'flex', borderBottom: '1px dashed #e0e0e0', paddingBottom: '10px', marginBottom: '10px' }}>
                                <strong style={{ minWidth: '140px', color: '#666' }}>Nama</strong>
                                <span style={{ color: '#333', fontWeight: 'bold' }}>: {selectedSurvey.nama}</span>
                            </div>
                            <div style={{ display: 'flex', borderBottom: '1px dashed #e0e0e0', paddingBottom: '10px', marginBottom: '10px' }}>
                                <strong style={{ minWidth: '140px', color: '#666' }}>Jurusan</strong>
                                <span style={{ color: '#333' }}>: {selectedSurvey.jurusan}</span>
                            </div>
                            <div style={{ display: 'flex', borderBottom: '1px dashed #e0e0e0', paddingBottom: '10px', marginBottom: '10px' }}>
                                <strong style={{ minWidth: '140px', color: '#666' }}>Waktu Isi Survey</strong>
                                <span style={{ color: '#134CBC', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    : <i className="fa-regular fa-clock"></i> {selectedSurvey.tanggal_survey}
                                </span>
                            </div>
                            <div style={{ display: 'flex', borderBottom: '1px dashed #e0e0e0', paddingBottom: '10px', marginBottom: '10px', alignItems: 'center' }}>
                                <strong style={{ minWidth: '140px', color: '#666' }}>Pilihan Survey</strong>
                                <span style={{ display: 'flex', alignItems: 'center' }}>: 
                                    <span style={{ marginLeft: '8px', background: '#d4edda', color: '#155724', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #c3e6cb' }}>
                                        {selectedSurvey.survey_detail?.pilihan || '-'}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="tracer-survey-box" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #3590FA', borderRight: '1px solid #eee', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                            <strong style={{ display: 'block', marginBottom: '10px', color: '#333', fontSize: '15px' }}>
                                <i className="fa-solid fa-comment-dots" style={{color: '#3590FA', marginRight: '6px'}}></i> Kritik / Saran:
                            </strong>
                            <p style={{ margin: 0, color: '#555', fontStyle: 'italic', lineHeight: '1.6', fontSize: '14px' }}>
                                "{selectedSurvey.survey_detail?.kritiksaran || '-'}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
