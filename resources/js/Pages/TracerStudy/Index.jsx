import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function TracerStudyIndex({ surveys, alumni, jurusan }) {
    return (
        <MainLayout>
            <Head title="Tracer Study" />
            <div className="header-bar"><a href="#">Tracer Study</a></div>
            <div className="tracer-container">
                <h2 style={{ margin: '20px 0', fontWeight: 800, color: '#333' }}>DATA TRACER STUDY</h2>
                <table className="rekap-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Alumni</th>
                            <th>Jurusan</th>
                            <th>Pilihan Survey</th>
                            <th>Keterangan</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {surveys && surveys.length > 0 ? surveys.map((s, i) => (
                            <tr key={s.id_survey}>
                                <td>{i + 1}</td>
                                <td>{s.alumni?.nama || '-'}</td>
                                <td>{s.alumni?.jurusan?.jurusan || '-'}</td>
                                <td>{s.pilihan_survey}</td>
                                <td>{s.kritiksaran || '-'}</td>
                                <td>{s.tgl_dibuat}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Belum ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}
