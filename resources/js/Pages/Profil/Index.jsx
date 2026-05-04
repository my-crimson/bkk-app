import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import PasswordInput from '../../Components/PasswordInput';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function ProfilIndex({ alumni, mustChangePassword }) {
    const { errors } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(mustChangePassword || false);

    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        nama: alumni.nama || '',
        jenis_kelamin: alumni.jenis_kelamin || '',
        nisn: alumni.nisn || '',
        tempat_lahir: alumni.tempat_lahir || '',
        tanggal_lahir: alumni.tanggal_lahir || '',
        nik: alumni.nik || '',
        agama: alumni.agama || '',
        alamat: alumni.alamat || '',
        email: alumni.email || '',
        no_wa: alumni.no_wa || '',
        rt: alumni.rt || '',
        rw: alumni.rw || '',
        dusun: alumni.dusun || '',
        kelurahan: alumni.kelurahan || '',
        kecamatan: alumni.kecamatan || '',
        kode_pos: alumni.kode_pos || '',
        gambar: null,
    });

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const profileImage = useMemo(() => {
        if (!alumni.gambar) return null;
        if (alumni.gambar.startsWith('http')) return alumni.gambar;
        return `/storage/${alumni.gambar}`;
    }, [alumni.gambar]);

    const maskedNik = useMemo(() => {
        if (!alumni.nik) return '-';
        if (alumni.nik.length <= 6) return '******';
        return alumni.nik.substring(0, 6) + '*'.repeat(alumni.nik.length - 6);
    }, [alumni.nik]);

    const submit = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('update profil'))) return;
        post('/profil', {
            forceFormData: true,
            onSuccess: () => {
                setIsEditing(false);
                notifyActionSuccess('update profil');
            },
        });
    };

    const submitPassword = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('ubah password'))) return;
        passwordForm.post('/profil/change-password', {
            onSuccess: () => {
                sessionStorage.removeItem('pw_warning_dismissed');
                notifyActionSuccess('ubah password. Silakan login kembali dengan password baru Anda.');
                setTimeout(() => {
                    router.post('/logout');
                }, 1500);
            },
        });
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('logout'))) return;
        sessionStorage.removeItem('pw_warning_dismissed');
        router.post('/logout', {
            onSuccess: () => notifyActionSuccess('logout'),
        });
    };

    return (
        <MainLayout>
            <Head title="Profil" />
            <div className="header-bar"><a href="#">Profil</a></div>
            <div className="profil-modern-wrap">
                <div className="profil-modern-hero">
                    <div className="profil-modern-avatar">
                        {profileImage ? (
                            <img src={profileImage} alt={alumni.nama} />
                        ) : (
                            <span>{(alumni.nama || 'A').charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="profil-modern-headtext">
                        <h2>{alumni.nama || '-'}</h2>
                        <p>{alumni.nisn || '-'}</p>
                        <p>
                            Siswa / Alumni Tahun{' '}
                            {alumni.tahun_lulus || '-'}
                        </p>
                    </div>
                </div>

                {/* ========== SECTION UBAH PASSWORD ========== */}
                {showChangePassword && (
                    <div className="change-pw-section">
                        <div className="change-pw-header">
                            <div className="change-pw-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            </div>
                            <div>
                                <h3>Ubah Password</h3>
                                <p>Buat password baru untuk keamanan akun Anda</p>
                            </div>
                        </div>
                        <form onSubmit={submitPassword} className="change-pw-form">
                            <div className="form-group">
                                <label>Password Baru</label>
                                <PasswordInput
                                    placeholder="Minimal 6 karakter..."
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className={errors?.password ? 'input-error' : ''}
                                />
                                {errors?.password && <span className="field-error">{errors.password}</span>}
                            </div>
                            <div className="form-group">
                                <label>Konfirmasi Password Baru</label>
                                <PasswordInput
                                    placeholder="Ulangi password baru..."
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                />
                            </div>
                            <div className="change-pw-actions">
                                <button type="submit" className="btn-save-pw" disabled={passwordForm.processing}>
                                    Simpan Password
                                </button>
                                {!mustChangePassword && (
                                    <button
                                        type="button"
                                        className="btn-cancel-pw"
                                        onClick={() => setShowChangePassword(false)}
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {!isEditing ? (
                    <>
                        <div className="profil-modern-grid">
                            <div className="profil-modern-panel">
                                <p><strong>NISN</strong><span>{alumni.nisn || '-'}</span></p>
                                <p><strong>NIK</strong><span>{maskedNik}</span></p>
                                <p><strong>Nama Lengkap</strong><span>{alumni.nama || '-'}</span></p>
                                <p><strong>Jenis Kelamin</strong><span>{alumni.jenis_kelamin || '-'}</span></p>
                                <p><strong>Tempat Tanggal Lahir</strong><span>{`${alumni.tempat_lahir || '-'}, ${alumni.tanggal_lahir || '-'}`}</span></p>
                            </div>
                            <div className="profil-modern-panel right">
                                <button
                                    type="button"
                                    className="profil-edit-mini"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                                <p><strong>Alamat</strong><span>{alumni.alamat || '-'}</span></p>
                                <p><strong>RT/RW</strong><span>{`${alumni.rt || '-'} / ${alumni.rw || '-'}`}</span></p>
                                <p><strong>Kelurahan</strong><span>{alumni.kelurahan || '-'}</span></p>
                                <p><strong>Kecamatan</strong><span>{alumni.kecamatan || '-'}</span></p>
                                <p><strong>Kode Pos</strong><span>{alumni.kode_pos || '-'}</span></p>
                                <p><strong>Agama</strong><span>{alumni.agama || '-'}</span></p>
                                <p><strong>No Tlp / Hp</strong><span>{alumni.no_wa || '-'}</span></p>
                                <p><strong>Email</strong><span>{alumni.email || '-'}</span></p>
                            </div>
                        </div>
                        <div className="profil-modern-actions">
                            {!showChangePassword && (
                                <button
                                    type="button"
                                    className="btn-change-pw"
                                    onClick={() => setShowChangePassword(true)}
                                >
                                    Ubah Password
                                </button>
                            )}
                            <button type="button" className="btn-logout" onClick={handleLogout}>Keluar</button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={submit} className="profil-edit-form">
                        <div className="profil-edit-grid">
                            <div className="form-group"><label>Nama</label><input value={data.nama} onChange={(e) => setData('nama', e.target.value)} /></div>
                            <div className="form-group"><label>NISN</label><input value={data.nisn} onChange={(e) => setData('nisn', e.target.value)} /></div>
                            <div className="form-group"><label>NIK</label><input value={data.nik} onChange={(e) => setData('nik', e.target.value)} /></div>
                            <div className="form-group"><label>Jenis Kelamin</label><select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)}><option value="">Pilih</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
                            <div className="form-group"><label>Tempat Lahir</label><input value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} /></div>
                            <div className="form-group"><label>Tanggal Lahir</label><input type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} /></div>
                            <div className="form-group"><label>Agama</label><input value={data.agama} onChange={(e) => setData('agama', e.target.value)} /></div>
                            <div className="form-group"><label>Email</label><input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} /></div>
                            <div className="form-group"><label>No WA</label><input value={data.no_wa} onChange={(e) => setData('no_wa', e.target.value)} /></div>
                            <div className="form-group"><label>RT</label><input value={data.rt} onChange={(e) => setData('rt', e.target.value)} /></div>
                            <div className="form-group"><label>RW</label><input value={data.rw} onChange={(e) => setData('rw', e.target.value)} /></div>
                            <div className="form-group"><label>Dusun</label><input value={data.dusun} onChange={(e) => setData('dusun', e.target.value)} /></div>
                            <div className="form-group"><label>Kelurahan</label><input value={data.kelurahan} onChange={(e) => setData('kelurahan', e.target.value)} /></div>
                            <div className="form-group"><label>Kecamatan</label><input value={data.kecamatan} onChange={(e) => setData('kecamatan', e.target.value)} /></div>
                            <div className="form-group"><label>Kode Pos</label><input value={data.kode_pos} onChange={(e) => setData('kode_pos', e.target.value)} /></div>
                            <div className="form-group full"><label>Alamat</label><textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} /></div>
                            <div className="form-group full"><label>Foto Profil</label><input type="file" accept="image/*" onChange={(e) => setData('gambar', e.target.files[0])} /></div>
                        </div>
                        <div className="profil-modern-actions">
                            <button type="submit" className="btn-save" disabled={processing}>Simpan Perubahan</button>
                            <button type="button" className="btn-logout" onClick={handleLogout}>Keluar</button>
                        </div>
                    </form>
                )}
            </div>
        </MainLayout>
    );
}
