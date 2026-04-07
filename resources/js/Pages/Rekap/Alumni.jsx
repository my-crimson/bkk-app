import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function RekapAlumni({ alumni, jurusan }) {
    return (
        <MainLayout>
            <Head title="Rekap Alumni" />
            <div className="header-bar"><a href="#">Rekap / Alumni</a></div>
            <div className="rekap-container">
                <h2 style={{ margin: '20px 0', fontWeight: 800, color: '#333' }}>REKAP DATA ALUMNI</h2>
                <table className="rekap-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>NISN</th>
                            <th>Jurusan</th>
                            <th>Jenis Kelamin</th>
                            <th>Email</th>
                            <th>No WA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumni && alumni.length > 0 ? alumni.map((a, i) => (
                            <tr key={a.id}>
                                <td>{i + 1}</td>
                                <td>{a.nama}</td>
                                <td>{a.nisn}</td>
                                <td>{a.jurusan?.jurusan || '-'}</td>
                                <td>{a.jenis_kelamin}</td>
                                <td>{a.email || '-'}</td>
                                <td>{a.no_wa || '-'}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Belum ada data alumni.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}
