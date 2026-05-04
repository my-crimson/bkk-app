import { useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AlumniNav() {
    const { url, props } = usePage();
    const { auth } = props;
    const [mobileActive, setMobileActive] = useState(false);

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
            <div className="hamburger" onClick={() => setMobileActive(!mobileActive)}>
                <i className="fa-solid fa-bars"></i>
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

                {/* HOME */}
                <li>
                    <a className={isActive(['/', '/pengantar', '/informasi-kegiatan'])} href="#">
                        HOME <i className="fa-solid fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown">
                        <li><Link className={isActive('/', true)} href="/">Halaman Utama</Link></li>
                        <li><Link className={isActive('/pengantar')} href="/pengantar">Pengantar</Link></li>
                        <li><Link className={isActive('/informasi-kegiatan')} href="/informasi-kegiatan">Informasi Kegiatan BKK</Link></li>
                    </ul>
                </li>

                {/* ABOUT */}
                <li>
                    <a className={isActive(['/visi-misi','/proker','/tujuan','/struktur-organisasi'])} href="#">
                        TENTANG KAMI <i className="fa-solid fa-chevron-down"></i>
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