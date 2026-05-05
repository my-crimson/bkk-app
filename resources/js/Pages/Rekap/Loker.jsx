import { Head, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RekapLoker({
    lowker = [],
    cards = [],
    perusahaanOptions = [],
    lokasiOptions = [],
    filters = {},
    summary = {},
}) {
    const chartPerusahaan = summary.chart_perusahaan || [];
    const chartLokasi = summary.chart_lokasi || [];
    const COLORS_PERUSAHAAN = ['#134CBC', '#1e5cd4', '#2a6ce6', '#3b7cf5', '#4c8bf9'];
    const COLORS_LOKASI = ['#FF8042', '#ff945e', '#ffa67a', '#ffb796', '#ffc7b2'];

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/management/rekap-loker', {
            perusahaan: formData.get('perusahaan') || '',
            lokasi: formData.get('lokasi') || '',
            jurusan: formData.get('jurusan') || '',
            rentang: formData.get('rentang') || 'all',
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <MainLayout>
            <Head title="Rekap Lowongan Kerja" />
            <div className="header-bar"><a href="#">Rekap / Lowongan Kerja</a></div>

            <div className="rekap-loker-wrap" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="rekap-loker-title" style={{ margin: 0, fontWeight: 800, color: '#134CBC' }}>REKAPITULASI DATA LOWONGAN KERJA</h2>
                    <button className="btn-print" onClick={() => window.print()}>
                        <i className="fa-solid fa-print"></i> Cetak PDF
                    </button>
                </div>

                <div className="rekap-loker-summary" style={{ marginBottom: '30px', background: '#f8f9fa', padding: '15px', borderRadius: '10px', borderLeft: '5px solid #134CBC', display: 'flex', gap: '40px' }}>
                    <p style={{ margin: 0, fontSize: '18px' }}>Total lowongan terdaftar: <strong style={{ color: '#134CBC', fontSize: '22px' }}>{summary.total_lowongan || 0}</strong></p>
                    <p style={{ margin: 0, fontSize: '18px' }}>Total perusahaan: <strong style={{ color: '#134CBC', fontSize: '22px' }}>{summary.total_perusahaan || 0}</strong></p>
                </div>

                <form className="rekap-loker-filter" onSubmit={handleFilter}>
                    <select name="perusahaan" defaultValue={filters.perusahaan || ''}>
                        <option value="">Semua Perusahaan</option>
                        {perusahaanOptions.map((nama) => (
                            <option key={nama} value={nama}>{nama}</option>
                        ))}
                    </select>
                    <select name="lokasi" defaultValue={filters.lokasi || ''}>
                        <option value="">Semua Lokasi</option>
                        {lokasiOptions.map((lokasi) => (
                            <option key={lokasi} value={lokasi}>{lokasi}</option>
                        ))}
                    </select>
                    <select name="rentang" defaultValue={filters.rentang || 'all'}>
                        <option value="all">Terdaftar Kapan Saja</option>
                        <option value="today">Hari Ini</option>
                        <option value="7d">7 Hari Terakhir</option>
                        <option value="30d">30 Hari Terakhir</option>
                    </select>
                    <select name="jurusan" defaultValue={filters.jurusan || ''}>
                        <option value="">Semua Jurusan</option>
                        {cards.map((card) => (
                            <option key={card.kode} value={card.kode}>{card.kode}</option>
                        ))}
                    </select>
                    <button type="submit" style={{ background: '#f59e0b', color: '#fff', padding: '0 20px', borderRadius: '5px' }}>Filter Data</button>
                </form>

                {/* CHARTS SECTION */}
                <div className="rekap-chart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {/* Bar Chart: Top Perusahaan */}
                    <div className="rekap-chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Top Perusahaan (Berdasarkan Jumlah Lowongan)</h3>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={chartPerusahaan}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis 
                                        dataKey="label" 
                                        type="category" 
                                        width={110} 
                                        tick={{fontSize: 11}} 
                                        tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                                    />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="value" name="Jumlah" radius={[0, 4, 4, 0]}>
                                        {chartPerusahaan.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_PERUSAHAAN[index % COLORS_PERUSAHAAN.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart: Top Lokasi */}
                    <div className="rekap-chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Top Lokasi Lowongan</h3>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={chartLokasi}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis 
                                        dataKey="label" 
                                        type="category" 
                                        width={100} 
                                        tick={{fontSize: 11}} 
                                        tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                                    />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="value" name="Jumlah" radius={[0, 4, 4, 0]}>
                                        {chartLokasi.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_LOKASI[index % COLORS_LOKASI.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <h3 className="rekap-loker-subtitle print-page-break" style={{ marginBottom: '15px', color: '#333' }}>Data Berdasarkan Jurusan</h3>
                <div className="rekap-loker-grid">
                    {cards.map((card) => (
                        <div className="rekap-loker-card" key={card.kode}>
                            <h4>{card.kode}</h4>
                            <p><strong>{card.jumlah_lowongan}</strong> lowongan</p>
                        </div>
                    ))}
                </div>

                {/* TABLE: Data Lowongan Lengkap */}
                <h3 className="print-page-break" style={{ marginBottom: '15px', color: '#333' }}>Data Lowongan Kerja Lengkap</h3>
                <div style={{ overflowX: 'auto', width: '100%', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table className="rekap-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#134CBC', color: '#fff' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>No</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Judul Lowongan</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Perusahaan</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Lokasi</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Gaji</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Jurusan</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Tgl Posting</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowker && lowker.length > 0 ? lowker.map((l, i) => (
                                <tr key={l.id_lowker} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{i + 1}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{l.judul_lowker || '-'}</td>
                                    <td style={{ padding: '12px' }}>{l.perusahaan?.nama || '-'}</td>
                                    <td style={{ padding: '12px' }}>{l.lokasi || '-'}</td>
                                    <td style={{ padding: '12px' }}>{l.gaji || '-'}</td>
                                    <td style={{ padding: '12px' }}>{l.jurusan?.jurusan || '-'}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: l.status === 'aktif' ? '#dcfce7' : '#fee2e2', color: l.status === 'aktif' ? '#16a34a' : '#dc2626' }}>
                                            {l.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>{l.tgl_posting || '-'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Belum ada data lowongan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
