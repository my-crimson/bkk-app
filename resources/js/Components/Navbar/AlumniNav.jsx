import { useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AlumniNav() {
    const { auth } = usePage().props;
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

    const profileImage = useMemo(() => {
        const gambar = auth?.user?.gambar;
        if (!gambar) return null;
        if (gambar.startsWith('http')) return gambar;
        return `/storage/${gambar}`;
    }, [auth?.user?.gambar]);

    const initial = (auth?.user?.nama || 'A').charAt(0).toUpperCase();

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

                {/* PROFILE */}
                <li>
                    <div onClick={() => window.location.href = '/profil'} className="profile-icon">
                        {profileImage ? (
                            <img src={profileImage} alt="Profil" className="profile-icon-img" />
                        ) : (
                            <span className="profile-icon-initial">{initial}</span>
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

                <li><Link className={isActive('/informasi-jurusan')} href="/informasi-jurusan">INFORMASI JURUSAN</Link></li>
                <li><Link className={isActive('/perusahaan')} href="/perusahaan">PERUSAHAAN</Link></li>
                <li><Link className={isActive('/loker')} href="/loker">LOWONGAN KERJA</Link></li>
                <li><Link className={isActive('/survey')} href="/survey">SURVEY</Link></li>

            </ul>
        </nav>
    );
}