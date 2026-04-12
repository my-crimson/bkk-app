import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function GuestNav() {
    const { url } = usePage();
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

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={() => setMobileActive(!mobileActive)}>
                <i className="fa-solid fa-bars"></i>
            </div>

            <ul className={`navbar-container ${mobileActive ? 'mobile-active' : ''}`}>

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
                        TENTANG KAMI
                    </a>
                    <ul className="dropdown">
                        <li><Link className={isActive('/visi-misi')} href="/visi-misi">Visi Misi</Link></li>
                        <li><Link className={isActive('/proker')} href="/proker">Program Kerja</Link></li>
                        <li><Link className={isActive('/tujuan')} href="/tujuan">Tujuan</Link></li>
                        <li><Link className={isActive('/struktur-organisasi')} href="/struktur-organisasi">Struktur Organisasi</Link></li>
                    </ul>
                </li>

                {/* LOGIN */}
                <li>
                    <a href="#">LOGIN</a>
                    <ul className="dropdown">
                        <li><Link href="/login/admin">Management</Link></li>
                        <li><Link href="/login/siswa">Siswa / Alumni</Link></li>
                    </ul>
                </li>

                <li><Link className={isActive('/informasi-jurusan')} href="/informasi-jurusan">INFORMASI JURUSAN</Link></li>
                <li><Link className={isActive('/perusahaan')} href="/perusahaan">PERUSAHAAN</Link></li>
                <li><Link className={isActive('/loker')} href="/loker">LOWONGAN KERJA</Link></li>

            </ul>
        </nav>
    );
}