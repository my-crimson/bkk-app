import { Head, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function RekapAlumni({ alumni, summary = {} }) {
    return (
        <MainLayout>
            <Head title="Rekap Alumni" />
            <div className="header-bar"><a href="#">Rekap / Alumni</a></div>
            <div className="rekap-container">
                <h2 style={{ margin: '20px 0', fontWeight: 800, color: '#333' }}>REKAP DATA ALUMNI</h2>

                <p className="rekap-note">Total alumni terdaftar: <strong>{summary.total_alumni || 0}</strong></p>

                <div style={{ overflowX: 'auto', width: '100%' }}>
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
                        {alumni && alumni.data && alumni.data.length > 0 ? alumni.data.map((a, i) => (
                            <tr key={a.id}>
                                <td>{alumni.from + i}</td>
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

                {alumni && alumni.links && alumni.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '20px', marginBottom: '20px', flexWrap: 'wrap', paddingBottom: '20px' }}>
                        {alumni.links.map((link, i) => (
                            <button
                                key={i} disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                style={{ padding: '6px 14px', borderRadius: '6px', border: link.active ? '2px solid #134CBC' : '1px solid #d1d5db', background: link.active ? '#134CBC' : '#fff', color: link.active ? '#fff' : (link.url ? '#333' : '#ccc'), cursor: link.url ? 'pointer' : 'default', fontSize: '13px' }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
