import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function RekapLoker({ lowker }) {
    return (
        <MainLayout>
            <Head title="Rekap Lowongan Kerja" />
            <div className="header-bar"><a href="#">Rekap / Lowongan Kerja</a></div>
            <div className="rekap-container">
                <h2 style={{ margin: '20px 0', fontWeight: 800, color: '#333' }}>REKAP LOWONGAN KERJA</h2>
                <table className="rekap-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Judul</th>
                            <th>Perusahaan</th>
                            <th>Jurusan</th>
                            <th>Lokasi</th>
                            <th>Tanggal Posting</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowker && lowker.length > 0 ? lowker.map((l, i) => (
                            <tr key={l.id_lowker}>
                                <td>{i + 1}</td>
                                <td>{l.judul_lowker}</td>
                                <td>{l.perusahaan?.nama || '-'}</td>
                                <td>{l.jurusan?.jurusan || '-'}</td>
                                <td>{l.lokasi}</td>
                                <td>{l.tgl_posting}</td>
                                <td>{l.status}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Belum ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}
