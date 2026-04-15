import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function TracerStudyIndex({ rows = [], jurusan = [], filters = {}, summary = {} }) {
    const allowedCodes = ['RPL', 'TKJ', 'KI', 'DKV', 'ANM', 'AK', 'MP', 'BD', 'ULW', 'PSPT'];
    const codeToNames = {
        RPL: ['RPL', 'REKAYASA PERANGKAT LUNAK'],
        TKJ: ['TKJ', 'TEKNIK KOMPUTER DAN JARINGAN'],
        KI: ['KI', 'TKI', 'TEKNIK KIMIA INDUSTRI'],
        DKV: ['DKV', 'DESAIN KOMUNIKASI VISUAL'],
        ANM: ['ANM', 'ANIMASI'],
        AK: ['AK', 'AKUNTANSI'],
        MP: ['MP', 'MANAJEMEN PERKANTORAN'],
        BD: ['BD', 'BISNIS DIGITAL'],
        ULW: ['ULW', 'USAHA LAYANAN WISATA'],
        PSPT: ['PSPT', 'PERHOTELAN DAN LAYANAN PARIWISATA'],
    };

    const jurusanMap = new Map((jurusan || []).map((j) => [String(j.jurusan || '').toUpperCase(), j]));
    const jurusanPills = allowedCodes
        .map((code) => {
            const matched = (codeToNames[code] || [])
                .map((name) => jurusanMap.get(name))
                .find(Boolean);

            return matched ? { code, jurusan: matched.jurusan } : null;
        })
        .filter(Boolean);

    return (
        <MainLayout>
            <Head title="Tracer Study" />
            <div className="header-bar"><a href="#">Tracer Study</a></div>
            <div className="tracer-container">
                <h2 className="tracer-title">TRACER STUDY DATA ALUMNI SMKN 1 BOYOLANGU</h2>

                <p className="tracer-generated-at">Sinkron waktu WIB: {summary.generated_at_wib}</p>

                <div className="tracer-pill-wrap">
                    <Link href="/admin/tracer-study" className={`tracer-pill ${!filters.jurusan ? 'active' : ''}`} preserveScroll>
                        Semua
                    </Link>
                    {jurusanPills.map((j) => (
                        <Link
                            key={j.code}
                            href={`/admin/tracer-study?jurusan=${encodeURIComponent(j.jurusan)}`}
                            className={`tracer-pill ${filters.jurusan === j.jurusan ? 'active' : ''}`}
                            preserveScroll
                        >
                            {j.code}
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
                                <td>
                                    {r.tanggal_survey}
                                    {r.tanggal_survey_relative && (
                                        <div className="tracer-relative-time">{r.tanggal_survey_relative}</div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada data.</td></tr>
                        )}
                        <tr className="tracer-total-row">
                            <td colSpan="2">Jumlah Alumni :</td>
                            <td>{summary.total_alumni || 0}</td>
                            <td colSpan="2">
                                Sudah Mengisi: {summary.sudah_mengisi || 0} | Belum Mengisi: {summary.belum_mengisi || 0}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}
