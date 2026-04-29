import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function GuestNav() {
    const { url } = usePage();
    const [mobileActive, setMobileActive] = useState(false);
    const [homeTapCount, setHomeTapCount] = useState(0);

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

    useEffect(() => {
        if (homeTapCount >= 10) {
            setHomeTapCount(0);
            router.visit('/login/management');
            return;
        }

        if (homeTapCount === 0) return;

        const timer = setTimeout(() => setHomeTapCount(0), 3000);
        return () => clearTimeout(timer);
    }, [homeTapCount]);

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={() => setMobileActive(!mobileActive)}>
                <i className="fa-solid fa-bars"></i>
            </div>

            <ul className={`navbar-container ${mobileActive ? 'mobile-active' : ''}`}>

                {/* HOME */}
                <li>
                    <a
                        className={isActive(['/', '/pengantar', '/informasi-kegiatan'])}
                        href="#"
                        onClick={() => setHomeTapCount((count) => count + 1)}
                    >
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

                <li><Link className={isActive('/login/siswa')} href="/login/siswa">LOGIN</Link></li>

                <li><Link className={isActive('/informasi-jurusan')} href="/informasi-jurusan">INFORMASI JURUSAN</Link></li>
                <li><Link className={isActive('/perusahaan')} href="/perusahaan">PERUSAHAAN</Link></li>
                <li><Link className={isActive('/loker')} href="/loker">LOWONGAN KERJA</Link></li>

            </ul>
        </nav>
    );
}