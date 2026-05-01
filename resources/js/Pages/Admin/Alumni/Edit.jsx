import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function AdminAlumniEdit({ alumni, jurusanList }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: alumni.nama || '', nisn: alumni.nisn || '', jenis_kelamin: alumni.jenis_kelamin || '',
        tempat_lahir: alumni.tempat_lahir || '', tanggal_lahir: alumni.tanggal_lahir || '',
        nik: alumni.nik || '', agama: alumni.agama || '', alamat: alumni.alamat || '',
        kelas: alumni.tahun_lulus || '', id_jurusan: alumni.id_jurusan || '',
        rt: alumni.rt || '', rw: alumni.rw || '', dusun: alumni.dusun || '',
        kelurahan: alumni.kelurahan || '', kecamatan: alumni.kecamatan || '', kode_pos: alumni.kode_pos || '',
        email: alumni.email || '', no_wa: alumni.no_wa || '',
    });

    const submit = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('update data siswa/alumni'))) return;
        put(`/admin/alumni/${alumni.id}`, {
            onSuccess: () => notifyActionSuccess('update siswa/alumni'),
        });
    };

    const labelStyle = { display: 'block', fontWeight: 600, marginBottom: '5px', fontSize: '14px' };
    const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' };
    const errStyle = { color: '#ef4444', fontSize: '12px', marginTop: '3px' };
    const required = <span style={{ color: '#ef4444' }}>*</span>;

    return (
        <MainLayout>
            <Head title="Edit Siswa/Alumni" />
            <div className="header-bar"><a href="#">CRUD / Siswa/Alumni / Edit</a></div>

            <div style={{ padding: '25px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '30px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '25px' }}>
                        <i className="fa-solid fa-user-pen" style={{ marginRight: '10px', color: '#f59e0b' }}></i>
                        Edit Data: {alumni.nama}
                    </h2>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Row 1 */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '2 1 300px' }}>
                                <label style={labelStyle}>Nama Lengkap {required}</label>
                                <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} style={inputStyle} required />
                                {errors.nama && <div style={errStyle}>{errors.nama}</div>}
                            </div>
                            <div style={{ flex: '1 1 150px' }}>
                                <label style={labelStyle}>NISN {required}</label>
                                <input type="text" value={data.nisn} onChange={e => setData('nisn', e.target.value)} style={inputStyle} required />
                                {errors.nisn && <div style={errStyle}>{errors.nisn}</div>}
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 150px' }}>
                                <label style={labelStyle}>Jenis Kelamin {required}</label>
                                <select value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)} style={inputStyle} required>
                                    <option value="">-- Pilih --</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div style={{ flex: '1 1 150px' }}>
                                <label style={labelStyle}>Tahun Lulus {required}</label>
                                <input type="number" value={data.tahun_lulus} onChange={e => setData('tahun_lulus', e.target.value)} style={inputStyle} placeholder="Mis: 2024" required />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Jurusan {required}</label>
                                <select value={data.id_jurusan} onChange={e => setData('id_jurusan', e.target.value)} style={inputStyle} required>
                                    <option value="">-- Pilih --</option>
                                    {jurusanList?.map(j => (
                                        <option key={j.id_jurusan} value={j.id_jurusan}>{j.jurusan}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Tempat Lahir {required}</label>
                                <input type="text" value={data.tempat_lahir} onChange={e => setData('tempat_lahir', e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={{ flex: '1 1 180px' }}>
                                <label style={labelStyle}>Tanggal Lahir {required}</label>
                                <input type="date" value={data.tanggal_lahir} onChange={e => setData('tanggal_lahir', e.target.value)} style={inputStyle} required />
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>NIK {required}</label>
                                <input type="text" value={data.nik} onChange={e => setData('nik', e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={{ flex: '1 1 150px' }}>
                                <label style={labelStyle}>Agama {required}</label>
                                <select value={data.agama} onChange={e => setData('agama', e.target.value)} style={inputStyle} required>
                                    <option value="">-- Pilih --</option>
                                    {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'].map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Alamat */}
                        <div>
                            <label style={labelStyle}>Alamat {required}</label>
                            <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} required />
                        </div>

                        {/* Row 5 */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 80px' }}>
                                <label style={labelStyle}>RT {required}</label>
                                <input type="number" value={data.rt} onChange={e => setData('rt', e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={{ flex: '1 1 80px' }}>
                                <label style={labelStyle}>RW {required}</label>
                                <input type="number" value={data.rw} onChange={e => setData('rw', e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={{ flex: '2 1 150px' }}>
                                <label style={labelStyle}>Dusun {required}</label>
                                <input type="text" value={data.dusun} onChange={e => setData('dusun', e.target.value)} style={inputStyle} required />
                            </div>
                        </div>

                        {/* Row 6 */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 150px' }}>
                                <label style={labelStyle}>Kelurahan {required}</label>
                                <input type="text" value={data.kelurahan} onChange={e => setData('kelurahan', e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={{ flex: '1 1 150px' }}>
                                <label style={labelStyle}>Kecamatan {required}</label>
                                <input type="text" value={data.kecamatan} onChange={e => setData('kecamatan', e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={{ flex: '1 1 100px' }}>
                                <label style={labelStyle}>Kode Pos {required}</label>
                                <input type="number" value={data.kode_pos} onChange={e => setData('kode_pos', e.target.value)} style={inputStyle} required />
                            </div>
                        </div>

                        {/* Row 7 */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Email {required}</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={{ flex: '1 1 180px' }}>
                                <label style={labelStyle}>No WA {required}</label>
                                <input type="text" value={data.no_wa} onChange={e => setData('no_wa', e.target.value)} style={inputStyle} required />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '5px' }}>
                            <Link href="/admin/alumni" style={{ padding: '10px 25px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', fontSize: '14px' }}>
                                Batal
                            </Link>
                            <button type="submit" disabled={processing} style={{ padding: '10px 25px', background: '#134CBC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                                {processing ? 'Menyimpan...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
