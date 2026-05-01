import { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function AdminNav() {
    const { url } = usePage();
    const [mobileActive, setMobileActive] = useState(false);
    const [notifCount, setNotifCount] = useState(0);
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const [notifs, setNotifs] = useState([]);
    const notifRef = useRef(null);

    // ================= ACTIVE HELPER =================
    const isActive = (paths, options = {}) => {
        const { exact = false, excludeAdmin = false } = options;

        const check = (path) => {
            if (excludeAdmin && url.startsWith('/admin')) return false;
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
            const res = await axios.get('/admin/notifications/pending-count');
            setNotifCount(res.data.count || 0);
        } catch (e) { /* ignore */ }
    };

    const fetchNotifs = async () => {
        try {
            const res = await axios.get('/admin/notifications');
            setNotifs(res.data);
        } catch (e) { /* ignore */ }
    };

    const handleResolve = async (id) => {
        if (!(await confirmAction('reset password siswa ini'))) return;
        try {
            const res = await axios.post(`/admin/notifications/${id}/resolve`);
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
        }, 10000); // Poll every 10s

        return () => clearInterval(interval);
    }, [showNotifPanel]);

    // Close notif panel on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifPanel(false);
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

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={() => setMobileActive(!mobileActive)}>
                <i className="fa-solid fa-bars"></i>
            </div>

            <ul className={`navbar-container ${mobileActive ? 'mobile-active' : ''}`}>

                {/* LOGOUT + NOTIF */}
                <li className="logout-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <a href="#" onClick={handleLogout} title="Logout" style={{ color: '#fff', fontSize: '18px' }}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </a>

                    {/* Notification Bell */}
                    <div ref={notifRef} style={{ position: 'relative' }}>
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

                        {/* Notification Panel */}
                        {showNotifPanel && (
                            <div style={{
                                position: 'absolute', top: '35px', left: 0, width: '360px',
                                background: '#fff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                zIndex: 9999, overflow: 'hidden',
                            }}>
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
                            </div>
                        )}
                    </div>
                </li>

                {/* ================= HOME ================= */}
                <li>
                    <a className={isActive(['/', '/informasi-kegiatan'])} href="#">
                        HOME <i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
                        <li>
                            <Link className={isActive('/', { exact: true })} href="/">
                                Halaman Utama
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/informasi-kegiatan')} href="/informasi-kegiatan">
                                Informasi Kegiatan BKK
                            </Link>
                        </li>
                    </ul>
                </li>


                {/* ================= TRACER ================= */}
                <li>
                    <Link className={isActive('/admin/tracer-study')} href="/admin/tracer-study">
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
                <li>
                    <a className={isActive(['/admin/rekap-alumni', '/admin/rekap-loker'])} href="#">
                        REKAP <i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
                        <li>
                            <Link className={isActive('/admin/rekap-alumni')} href="/admin/rekap-alumni">
                                Rekap Alumni
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/admin/rekap-loker')} href="/admin/rekap-loker">
                                Rekap Lowongan Kerja
                            </Link>
                        </li>
                    </ul>
                </li>

                {/* ================= CRUD ================= */}
                <li className="crud-dropdown">
                    <a className={isActive(['/admin/perusahaan', '/admin/loker', '/admin/berita', '/admin/jurusan', '/admin/informasi', '/admin/alumni'])} href="#">
                        C.R.U.D <i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
                        <li>
                            <Link className={isActive('/admin/informasi')} href="/admin/informasi">
                                CRUD Informasi
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/admin/berita')} href="/admin/berita">
                                CRUD Kegiatan BKK
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/admin/perusahaan')} href="/admin/perusahaan">
                                CRUD Perusahaan
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/admin/loker')} href="/admin/loker">
                                CRUD Lowongan Kerja
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/admin/jurusan')} href="/admin/jurusan">
                                CRUD Informasi Jurusan
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/admin/alumni')} href="/admin/alumni">
                                CRUD Siswa/Alumni
                            </Link>
                        </li>
                    </ul>
                </li>

            </ul>
        </nav>
    );
}