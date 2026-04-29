import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';

export default function TracerStudyIndex({ rows = [], jurusan = [], filters = {}, summary = {} }) {
    const allowedCodes = ['RPL', 'TKI', 'TKJ', 'ANM', 'BR', 'ULW', 'AKL', 'MPLB', 'BD', 'DKV'];
    const [selectedSurvey, setSelectedSurvey] = useState(null);

    return (
        <MainLayout>
            <Head title="Tracer Study" />
            <div className="header-bar"><a href="#">Tracer Study Alumni</a></div>
            <div className="tracer-container">
                <h2 className="tracer-title">TRACER STUDY DATA ALUMNI SMKN 1 BOYOLANGU</h2>

                <div className="tracer-pill-wrap">
                    {allowedCodes.map((code) => (
                        <Link
                            key={code}
                            href={`/admin/tracer-study?jurusan=${encodeURIComponent(code)}`}
                            className={`tracer-pill ${filters.jurusan === code ? 'active' : ''}`}
                            preserveScroll
                        >
                            {code}
                        </Link>
                    ))}
                </div>

                <h3 className="tracer-year">{summary.periode_label}</h3>

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

            {selectedSurvey && (
                <div className="tracer-survey-overlay" onClick={() => setSelectedSurvey(null)}>
                    <div className="tracer-survey-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tracer-survey-header">
                            <h3>Detail Survey Alumni</h3>
                            <button type="button" onClick={() => setSelectedSurvey(null)}>x</button>
                        </div>
                        <p><strong>Nama:</strong> {selectedSurvey.nama}</p>
                        <p><strong>Jurusan:</strong> {selectedSurvey.jurusan}</p>
                        <p><strong>Tanggal Isi:</strong> {selectedSurvey.tanggal_survey}</p>
                        <p><strong>Pilihan Survey:</strong> {selectedSurvey.survey_detail?.pilihan || '-'}</p>
                        <div className="tracer-survey-box">
                            <strong>Kritik / Saran:</strong>
                            <p>{selectedSurvey.survey_detail?.kritiksaran || '-'}</p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
