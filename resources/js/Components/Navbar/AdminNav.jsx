import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AdminNav() {
    const { url } = usePage();
    const [mobileActive, setMobileActive] = useState(false);

    // ================= ACTIVE HELPER =================
    const isActive = (paths, options = {}) => {
        const { exact = false, excludeAdmin = false } = options;

        const check = (path) => {
            // jika exclude admin dan sekarang di /admin → jangan aktif
            if (excludeAdmin && url.startsWith('/admin')) return false;

            // khusus home
            if (path === '/') return url === '/';

            return exact ? url === path : url.startsWith(path);
        };

        if (Array.isArray(paths)) {
            return paths.some(check) ? 'active' : '';
        }

        return check(paths) ? 'active' : '';
    };

    // ================= LOGOUT =================
    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={() => setMobileActive(!mobileActive)}>
                <i className="fa-solid fa-bars"></i>
            </div>

            <ul className={`navbar-container ${mobileActive ? 'mobile-active' : ''}`}>

                {/* LOGOUT */}
                <li className="logout-left">
                    <a href="#" onClick={handleLogout} title="Logout">
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </a>
                </li>

                {/* ================= HOME ================= */}
                <li>
                    <a className={isActive(['/', '/pengantar', '/informasi-kegiatan'])} href="#">
                        HOME <i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
                        <li>
                            <Link className={isActive('/', { exact: true })} href="/">
                                Halaman Utama
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/pengantar')} href="/pengantar">
                                Pengantar
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
                    <a className={isActive(['/admin/perusahaan', '/admin/loker', '/admin/berita'])} href="#">
                        C.R.U.D <i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
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
                    </ul>
                </li>

            </ul>
        </nav>
    );
}