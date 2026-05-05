import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function ManagementNav() {
    const { url, props } = usePage();
    const auth = props.auth;
    const [mobileActive, setMobileActive] = useState(false);
    const [openDropdown, setOpenDropdown] = useState('');
    const [notifCount, setNotifCount] = useState(0);

    // Profile / logout state (mobile)
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    const profilePanelRef = useRef(null);

    // Notification state
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const [notifs, setNotifs] = useState([]);

    // Separate refs for desktop and mobile notif
    const desktopNotifRef = useRef(null);
    const mobileNotifRef = useRef(null);

    // ================= PROFILE IMAGE =================
    const profileImage = useMemo(() => {
        const gambar = auth?.user?.gambar;
        if (!gambar) return null;
        if (gambar.startsWith('http')) return gambar;
        return `/storage/${gambar}`;
    }, [auth?.user?.gambar]);

    const initial = (auth?.user?.nama || auth?.user?.username || 'M').charAt(0).toUpperCase();

    // ================= DROPDOWN =================
    const toggleDropdown = (e, menu) => {
        e.preventDefault();
        setOpenDropdown(openDropdown === menu ? '' : menu);
    };

    // ================= ACTIVE HELPER =================
    const isActive = (paths, options = {}) => {
        const { exact = false, excludeAdmin = false } = options;

        const check = (path) => {
            if (excludeAdmin && url.startsWith('/management')) return false;
            if (path === '/') return url === '/';
            return exact ? url === path : url.startsWith(path);
        };

        if (Array.isArray(paths)) {
            return paths.some(check) ? 'active' : '';
        }

        return check(paths) ? 'active' : '';
    };

    // ================= LOGOUT =================
    const handleLogout = async (e) => {
        e.preventDefault();
        if (!(await confirmAction('logout'))) return;
        router.post('/logout', {
            onSuccess: () => notifyActionSuccess('logout'),
        });
    };

    // ================= NOTIFICATIONS =================
    const fetchNotifCount = async () => {
        try {
            const res = await axios.get('/management/notifications/pending-count');
            setNotifCount(res.data.count || 0);
        } catch (e) { /* ignore */ }
    };

    const fetchNotifs = async () => {
        try {
            const res = await axios.get('/management/notifications');
            setNotifs(res.data);
        } catch (e) { /* ignore */ }
    };

    const handleResolve = async (id) => {
        if (!(await confirmAction('reset password siswa ini'))) return;
        try {
            const res = await axios.post(`/management/notifications/${id}/resolve`);
            if (res.data.success) {
                notifyActionSuccess('reset password');
                fetchNotifs();
                fetchNotifCount();
            }
        } catch (e) { /* ignore */ }
    };

    useEffect(() => {
        fetchNotifCount();
        if (showNotifPanel) fetchNotifs();

        const interval = setInterval(() => {
            fetchNotifCount();
            if (showNotifPanel) fetchNotifs();
        }, 10000);

        return () => clearInterval(interval);
    }, [showNotifPanel]);

    // Close desktop notif on outside click
    useEffect(() => {
        const handler = (e) => {
            if (desktopNotifRef.current && !desktopNotifRef.current.contains(e.target)) {
                setShowNotifPanel(false);
            }
            if (mobileNotifRef.current && !mobileNotifRef.current.contains(e.target)) {
                setShowNotifPanel(false);
            }
            if (profilePanelRef.current && !profilePanelRef.current.contains(e.target)) {
                setShowProfilePanel(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // ================= SHARED NOTIF PANEL CONTENT =================
    const NotifPanelContent = () => (
        <>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <i className="fa-solid fa-bell" style={{ marginRight: '8px', color: '#134CBC' }}></i>
                    Notifikasi
                </h4>
                {notifCount > 0 && (
                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                        {notifCount} pending
                    </span>
                )}
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifs.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        <i className="fa-solid fa-check-circle" style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}></i>
                        Tidak ada notifikasi
                    </div>
                ) : (
                    notifs.map(n => (
                        <div key={n.id} style={{
                            padding: '12px 16px', borderBottom: '1px solid #f1f5f9',
                            background: n.status === 'pending' ? '#fefce8' : '#fff',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                                    {n.status === 'pending' && <i className="fa-solid fa-circle" style={{ color: '#ef4444', fontSize: '8px', marginRight: '6px' }}></i>}
                                    {n.alumni?.nama || 'Unknown'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                    Request reset password • {formatTime(n.created_at)}
                                </div>
                            </div>
                            {n.status === 'pending' ? (
                                <button onClick={() => handleResolve(n.id)} style={{
                                    padding: '5px 12px', background: '#134CBC', color: '#fff', border: 'none',
                                    borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}>
                                    <i className="fa-solid fa-key" style={{ marginRight: '4px' }}></i>Reset
                                </button>
                            ) : (
                                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    <i className="fa-solid fa-check" style={{ marginRight: '3px' }}></i>Selesai
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );

    return (
        <nav className="navbar" style={{ position: 'relative' }}>
            <div className="navbar-mobile-logo">
                <img src="/images/logo.png" alt="Logo BKK" className="logo-icon" />
                <img src="/images/tulisan-logo.png" alt="Bursa Kerja Khusus" className="logo-text" />
            </div>

            {/* ===== MOBILE: Notif Bell di sebelah hamburger ===== */}
            <div className="management-mobile-notif" ref={mobileNotifRef}>
                <button
                    className="mgmt-mobile-bell-btn"
                    onClick={(e) => { e.stopPropagation(); setShowNotifPanel(!showNotifPanel); setShowProfilePanel(false); }}
                    title="Notifikasi"
                >
                    <i className="fa-solid fa-bell"></i>
                    {notifCount > 0 && (
                        <span className="mgmt-notif-badge">{notifCount}</span>
                    )}
                </button>

                {/* Panel notifikasi mobile — di luar ul agar tidak terpotong */}
                {showNotifPanel && (
                    <div className="mgmt-mobile-notif-panel">
                        <NotifPanelContent />
                    </div>
                )}
            </div>

            <div className={`hamburger ${mobileActive ? 'active' : ''}`} onClick={() => setMobileActive(!mobileActive)}>
                <div className="hamburger-lines">
                    <span className="line line1"></span>
                    <span className="line line2"></span>
                    <span className="line line3"></span>
                </div>
            </div>

            <ul className={`navbar-container ${mobileActive ? 'mobile-active' : ''}`}>

                {/* ===== MOBILE ONLY: Profile Section ===== */}
                <li className="management-profile-section" ref={profilePanelRef}>
                    <div
                        className="mgmt-profile-row"
                        onClick={() => { setShowProfilePanel(!showProfilePanel); setShowNotifPanel(false); }}
                    >
                        <div className="profile-info-wrapper">
                            <div className="profile-icon">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profil" className="profile-icon-img" />
                                ) : (
                                    <span className="profile-icon-initial">{initial}</span>
                                )}
                            </div>
                            <div className="profile-text-mobile">
                                <span className="profile-name">
                                    {auth?.user?.nama || auth?.user?.username || 'Management'}
                                </span>
                                <span className="profile-label">
                                    {auth?.user?.role || 'Management'}
                                </span>
                            </div>
                        </div>
                        <i className={`fa-solid fa-chevron-${showProfilePanel ? 'up' : 'down'} mgmt-profile-chevron`}></i>
                    </div>

                    {/* Logout panel */}
                    {showProfilePanel && (
                        <div className="mgmt-logout-panel">
                            <a href="#" onClick={handleLogout} className="mgmt-logout-btn">
                                <i className="fa-solid fa-right-from-bracket"></i>
                                Logout
                            </a>
                        </div>
                    )}
                </li>

                {/* Garis pemisah hanya muncul di Mobile */}
                <hr className="profile-divider-mobile" />

                {/* ===== DESKTOP ONLY: Logout + Notif ===== */}
                <li className="logout-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <a href="#" onClick={handleLogout} title="Logout" style={{ color: '#fff', fontSize: '18px' }}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </a>

                    {/* Notification Bell */}
                    <div ref={desktopNotifRef} style={{ position: 'relative' }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); setShowNotifPanel(!showNotifPanel); }} title="Notifikasi"
                            style={{ position: 'relative', fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center' }}
                        >
                            <i className="fa-solid fa-bell"></i>
                            {notifCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-6px', right: '-8px',
                                    background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 'bold',
                                    width: '18px', height: '18px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 0 6px rgba(239,68,68,0.5)',
                                    animation: 'pulse 2s infinite',
                                }}>
                                    {notifCount}
                                </span>
                            )}
                        </a>

                        {/* Notification Panel (desktop) */}
                        {showNotifPanel && (
                            <div style={{
                                position: 'absolute', top: '35px', left: 0, width: '360px',
                                background: '#fff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                zIndex: 9999, overflow: 'hidden',
                            }}>
                                <NotifPanelContent />
                            </div>
                        )}
                    </div>
                </li>

                {/* ================= HOME ================= */}
                <li className={openDropdown === 'home' ? 'dropdown-open' : ''}>
                    <a
                        className={isActive(['/', '/pengantar', '/informasi-kegiatan'])}
                        href="#"
                        onClick={(e) => toggleDropdown(e, 'home')}
                    >
                        HOME <i className={`fa-solid fa-chevron-${openDropdown === 'home' ? 'up' : 'down'}`}></i>
                    </a>
                    <ul className="dropdown">
                        <li><Link className={isActive('/', true)} href="/">Halaman Utama</Link></li>
                        <li><Link className={isActive('/pengantar')} href="/pengantar">Pengantar</Link></li>
                        <li><Link className={isActive('/informasi-kegiatan')} href="/informasi-kegiatan">Informasi Kegiatan BKK</Link></li>
                    </ul>
                </li>

                {/* ABOUT */}
                <li className={openDropdown === 'about' ? 'dropdown-open' : ''}>
                    <a
                        className={isActive(['/visi-misi','/proker','/tujuan','/struktur-organisasi'])}
                        href="#"
                        onClick={(e) => toggleDropdown(e, 'about')}
                    >
                        TENTANG KAMI <i className={`fa-solid fa-chevron-${openDropdown === 'about' ? 'up' : 'down'}`}></i>
                    </a>
                    <ul className="dropdown">
                        <li><Link className={isActive('/visi-misi')} href="/visi-misi">Visi Misi</Link></li>
                        <li><Link className={isActive('/proker')} href="/proker">Program Kerja</Link></li>
                        <li><Link className={isActive('/tujuan')} href="/tujuan">Tujuan</Link></li>
                        <li><Link className={isActive('/struktur-organisasi')} href="/struktur-organisasi">Struktur Organisasi</Link></li>
                    </ul>
                </li>

                {/* ================= TRACER ================= */}
                <li>
                    <Link className={isActive('/management/tracer-study')} href="/management/tracer-study">
                        TRACER STUDY
                    </Link>
                </li>

                {/* ================= JURUSAN ================= */}
                <li>
                    <Link className={isActive('/informasi-jurusan')} href="/informasi-jurusan">
                        INFORMASI JURUSAN
                    </Link>
                </li>

                {/* ================= PERUSAHAAN ================= */}
                <li>
                    <Link
                        className={isActive('/perusahaan', { excludeAdmin: true })}
                        href="/perusahaan"
                    >
                        PERUSAHAAN
                    </Link>
                </li>

                {/* ================= LOKER ================= */}
                <li>
                    <Link
                        className={isActive('/loker', { excludeAdmin: true })}
                        href="/loker"
                    >
                        LOWONGAN KERJA
                    </Link>
                </li>

                {/* ================= REKAP ================= */}
                <li className={openDropdown === 'rekap' ? 'dropdown-open' : ''}>
                    <a
                        className={isActive(['/management/rekap-alumni', '/management/rekap-loker'])}
                        href="#"
                        onClick={(e) => toggleDropdown(e, 'rekap')}
                    >
                        REKAP <i className={`fa-solid fa-chevron-${openDropdown === 'rekap' ? 'up' : 'down'}`}></i>
                    </a>
                    <ul className="dropdown">
                        <li>
                            <Link className={isActive('/management/rekap-alumni')} href="/management/rekap-alumni">
                                Rekap Alumni
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/management/rekap-loker')} href="/management/rekap-loker">
                                Rekap Lowongan Kerja
                            </Link>
                        </li>
                    </ul>
                </li>

                {/* ================= CRUD ================= */}
                <li className={`crud-dropdown ${openDropdown === 'crud' ? 'dropdown-open' : ''}`}>
                    <a
                        className={isActive(['/management/perusahaan', '/management/loker', '/management/berita', '/management/jurusan', '/management/informasi', '/management/alumni'])}
                        href="#"
                        onClick={(e) => toggleDropdown(e, 'crud')}
                    >
                        C.R.U.D <i className={`fa-solid fa-chevron-${openDropdown === 'crud' ? 'up' : 'down'}`}></i>
                    </a>
                    <ul className="dropdown">
                        <li>
                            <Link className={isActive('/management/informasi')} href="/management/informasi">
                                CRUD Informasi
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/management/berita')} href="/management/berita">
                                CRUD Kegiatan BKK
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/management/perusahaan')} href="/management/perusahaan">
                                CRUD Perusahaan
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/management/loker')} href="/management/loker">
                                CRUD Lowongan Kerja
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/management/jurusan')} href="/management/jurusan">
                                CRUD Informasi Jurusan
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/management/alumni')} href="/management/alumni">
                                CRUD Siswa & Management
                            </Link>
                        </li>
                    </ul>
                </li>

            </ul>
        </nav>
    );
}