import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function GuestNav() {
    const { url } = usePage();
    const [mobileActive, setMobileActive] = useState(false);
    const [openDropdown, setOpenDropdown] = useState('');

    const toggleDropdown = (e, menu) => {
        e.preventDefault();
        setOpenDropdown(openDropdown === menu ? '' : menu);
    };

    const isActive = (paths, exact = false) => {
        const check = (path) => {
            if (path === '/') return url === '/';
            return exact ? url === path : url.startsWith(path);
        };

        if (Array.isArray(paths)) {
            return paths.some(check) ? 'active' : '';
        }

        return check(paths) ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-mobile-logo">
                <img src="/images/logo.png" alt="Logo BKK" className="logo-icon" />
                <img src="/images/tulisan-logo.png" alt="Bursa Kerja Khusus" className="logo-text" />
            </div>
            <div className={`hamburger ${mobileActive ? 'active' : ''}`} onClick={() => setMobileActive(!mobileActive)}>
                <div className="hamburger-lines">
                    <span className="line line1"></span>
                    <span className="line line2"></span>
                    <span className="line line3"></span>
                </div>
            </div>

            <ul className={`navbar-container ${mobileActive ? 'mobile-active' : ''}`}>

                {/* HOME */}
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

                <li><Link className={isActive('/informasi-jurusan')} href="/informasi-jurusan">INFORMASI JURUSAN</Link></li>
                <li><Link className={isActive('/perusahaan')} href="/perusahaan">PERUSAHAAN</Link></li>
                <li><Link className={isActive('/loker')} href="/loker">LOWONGAN KERJA</Link></li>

                {/* LOGIN */}
                <li className={openDropdown === 'login' ? 'dropdown-open' : ''}>
                    <a 
                        className={isActive(['/login/siswa', '/login/management'])} 
                        href="#"
                        onClick={(e) => toggleDropdown(e, 'login')}
                    >
                        LOGIN <i className={`fa-solid fa-chevron-${openDropdown === 'login' ? 'up' : 'down'}`}></i>
                    </a>
                    <ul className="dropdown">
                        <li><Link className={isActive('/login/siswa')} href="/login/siswa">Siswa / Alumni</Link></li>
                        <li><Link className={isActive('/login/management')} href="/login/management">Management</Link></li>
                    </ul>
                </li>

            </ul>

    
        </nav>
    );
}