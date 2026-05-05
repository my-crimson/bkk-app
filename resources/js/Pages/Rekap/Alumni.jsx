import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function RekapAlumni({ alumni, summary = {}, jurusan = [], filters = {} }) {
    const [filterData, setFilterData] = useState({
        tahun_lulus: filters.tahun_lulus || '',
        jurusan: filters.jurusan || '',
        nisn: filters.nisn || '',
        jenis_kelamin: filters.jenis_kelamin || '',
    });

    const handleFilterChange = (e) => {
        setFilterData({ ...filterData, [e.target.name]: e.target.value });
    };

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/management/rekap-alumni', filterData, { preserveState: true });
    };
    const chartJurusan = summary.chart_jurusan || [];
    const chartGender = summary.chart_gender || [];
    const chartTahunLulus = summary.chart_tahun_lulus || [];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF66B2', '#E91E63', '#009688'];

    return (
        <MainLayout>
            <Head title="Rekap Alumni" />
            <div className="header-bar"><a href="#">Rekap / Alumni</a></div>
            
            <div className="rekap-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontWeight: 800, color: '#134CBC' }}>REKAPITULASI DATA ALUMNI</h2>
                    <button className="btn-print" onClick={() => window.print()}>
                        <i className="fa-solid fa-print"></i> Cetak PDF
                    </button>
                </div>

                <div className="rekap-loker-summary" style={{ marginBottom: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '10px', borderLeft: '5px solid #134CBC', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    <p style={{ margin: 0, fontSize: '18px' }}>Total alumni: <strong style={{ color: '#134CBC', fontSize: '22px' }}>{summary.total_alumni || 0}</strong></p>
                    <p style={{ margin: 0, fontSize: '18px' }}>Laki-laki: <strong style={{ color: '#0088FE', fontSize: '22px' }}>{summary.total_laki || 0}</strong></p>
                    <p style={{ margin: 0, fontSize: '18px' }}>Perempuan: <strong style={{ color: '#00C49F', fontSize: '22px' }}>{summary.total_perempuan || 0}</strong></p>
                </div>

                <form onSubmit={applyFilter} className="rekap-loker-filter" style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        name="nisn"
                        placeholder="Cari NISN..."
                        value={filterData.nisn}
                        onChange={handleFilterChange}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '130px', flex: '1 1 auto' }}
                    />
                    <input
                        type="number"
                        name="tahun_lulus"
                        placeholder="Tahun Lulus"
                        value={filterData.tahun_lulus}
                        onChange={handleFilterChange}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '120px', flex: '1 1 auto' }}
                    />
                    <select
                        name="jurusan"
                        value={filterData.jurusan}
                        onChange={handleFilterChange}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '180px', flex: '1 1 auto' }}
                    >
                        <option value="">Semua Jurusan</option>
                        {jurusan.map((j) => (
                            <option key={j.id_jurusan} value={j.id_jurusan}>{j.jurusan}</option>
                        ))}
                    </select>
                    <select
                        name="jenis_kelamin"
                        value={filterData.jenis_kelamin}
                        onChange={handleFilterChange}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '140px', flex: '1 1 auto' }}
                    >
                        <option value="">Semua Gender</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>
                    <button type="submit" style={{ background: '#f59e0b', color: '#fff', padding: '0 20px', borderRadius: '5px', minWidth: '120px' }}>Filter Data</button>
                </form>

                {/* CHARTS SECTION */}
                <div className="rekap-chart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {/* Bar Chart: Alumni per Jurusan */}
                    <div className="rekap-chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Data Alumni per Jurusan</h3>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={chartJurusan}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="label" 
                                        tickFormatter={(value) => {
                                            if (value.toLowerCase().includes('animasi')) return 'ANIM';
                                            if (value.toLowerCase().includes('broadcasting')) return 'BR';
                                            const match = value.match(/\(([^)]+)\)/);
                                            return match ? match[1] : (value.length > 10 ? value.substring(0, 10) + '...' : value);
                                        }}
                                        tick={{ fontSize: 10, angle: -90, textAnchor: 'end' }} 
                                        height={60} 
                                        interval={0} 
                                    />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="value" name="Jumlah" fill="#134CBC" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Gender */}
                    <div className="rekap-chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Data Jenis Kelamin</h3>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartGender}
                                        cx="50%"
                                        cy="50%"
                                        startAngle={90}
                                        endAngle={-270}
                                        labelLine={{ length: 10, length2: 5 }}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={70}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartGender.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Cards: Sebaran Tahun Lulus */}
                <div className="rekap-tahun-lulus-wrap" style={{ marginBottom: '40px' }}>
                    <h3 className="rekap-loker-subtitle print-page-break" style={{ marginBottom: '15px', color: '#333' }}>Data Berdasarkan Tahun Lulus</h3>
                    <div className="rekap-loker-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                        {chartTahunLulus.map((item) => (
                            <div className="rekap-loker-card" key={item.label} style={{ background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: '4px solid #FF8042' }}>
                                <h4 style={{ margin: '0 0 5px', color: '#FF8042', fontSize: '22px' }}>{item.label}</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#555' }}><strong>{item.value}</strong> alumni</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TABLE SECTION */}
                <h3 className="print-page-break" style={{ marginBottom: '15px', color: '#333' }}>Data Alumni Lengkap</h3>
                <div style={{ overflowX: 'auto', width: '100%', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table className="rekap-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#134CBC', color: '#fff' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>No</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Nama</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>NISN</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Jurusan</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Tahun Lulus</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Jenis Kelamin</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Agama</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>No WA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumni && alumni.data && alumni.data.length > 0 ? alumni.data.map((a, i) => (
                                <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{alumni.from + i}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{a.nama}</td>
                                    <td style={{ padding: '12px' }}>{a.nisn}</td>
                                    <td style={{ padding: '12px' }}>{a.jurusan?.jurusan || '-'}</td>
                                    <td style={{ padding: '12px' }}>{a.tahun_lulus || '-'}</td>
                                    <td style={{ padding: '12px' }}>{a.jenis_kelamin}</td>
                                    <td style={{ padding: '12px' }}>{a.agama || '-'}</td>
                                    <td style={{ padding: '12px' }}>{a.email || '-'}</td>
                                    <td style={{ padding: '12px' }}>{a.no_wa || '-'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>Belum ada data alumni.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {alumni && alumni.links && alumni.links.length > 3 && (
                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '20px', marginBottom: '20px', flexWrap: 'wrap', paddingBottom: '20px' }}>
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
