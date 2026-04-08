import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AdminNav() {
    const { url } = usePage();
    const [mobileActive, setMobileActive] = useState(false);

    const isActive = (paths) => {
        if (Array.isArray(paths)) {
            return paths.some(p => p === '/' ? url === '/' : url.includes(p)) ? 'active' : '';
        }
        return paths === '/' ? (url === '/' ? 'active' : '') : (url.includes(paths) ? 'active' : '');
    };

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
                <li className="logout-left">
                    <a href="#" onClick={handleLogout} title="Logout" aria-label="Logout">
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </a>
                </li>

                <li>
                    <a className={isActive(['/', '/pengantar', '/informasi-kegiatan'])} href="#">
                        HOME<i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
                        <li><Link className={isActive('/')} href="/">Halaman Utama</Link></li>
                        <li><Link className={isActive('/pengantar')} href="/pengantar">Pengantar</Link></li>
                        <li><Link className={isActive('/informasi-kegiatan')} href="/informasi-kegiatan">Informasi Kegiatan BKK</Link></li>
                    </ul>
                </li>

                <li><Link className={isActive('/admin/tracer-study')} href="/admin/tracer-study">TRACER STUDY</Link></li>
                <li><Link className={isActive('/informasi-jurusan')} href="/informasi-jurusan">INFORMASI JURUSAN</Link></li>
                <li><Link className={isActive('/perusahaan')} href="/perusahaan">PERUSAHAAN</Link></li>
                <li><Link className={isActive('/loker')} href="/loker">LOWONGAN KERJA</Link></li>

                <li>
                    <a className={isActive(['/admin/rekap-alumni', '/admin/rekap-loker'])} href="#">
                        REKAP<i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
                        <li><Link className={isActive('/admin/rekap-alumni')} href="/admin/rekap-alumni">Rekap Alumni</Link></li>
                        <li><Link className={isActive('/admin/rekap-loker')} href="/admin/rekap-loker">Rekap Lowongan Kerja</Link></li>
                    </ul>
                </li>

                <li className="crud-dropdown">
                    <a className={isActive(['/admin/perusahaan', '/admin/loker', '/admin/berita'])} href="#">
                        C.R.U.D<i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
                        <li><Link className={isActive('/admin/berita')} href="/admin/berita">CRUD Kegiatan BKK</Link></li>
                        <li><Link className={isActive('/admin/perusahaan')} href="/admin/perusahaan">CRUD Perusahaan</Link></li>
                        <li><Link className={isActive('/admin/loker')} href="/admin/loker">CRUD Lowongan Kerja</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}
