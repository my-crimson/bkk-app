import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function LokerIndex({ lowker, jurusanList, filters }) {
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
        }, { threshold: 0.1 });
        cardsRef.current.forEach(el => { if (el) observer.observe(el); });
        return () => observer.disconnect();
    }, [lowker]);

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/loker', {
            jurusan: formData.get('jurusan'),
            lokasi: formData.get('lokasi'),
        });
    };

    const data = lowker?.data || [];
    const links = lowker?.links || [];
    const from = lowker?.from || 0;
    const to = lowker?.to || 0;
    const total = lowker?.total || 0;

    return (
        <MainLayout>
            <Head title="Lowongan Kerja" />
            <div className="header-bar"><a href="#">Lowongan Kerja</a></div>

            <div className="search-container">
                <form method="GET" className="search" onSubmit={handleFilter}>
                    <label htmlFor="jurusan">Pencarian:</label>
                    <select id="jurusan" name="jurusan" className="search-select" defaultValue={filters?.jurusan || ''}>
                        <option value="">SEMUA KATEGORI/JURUSAN</option>
                        {jurusanList && jurusanList.map((j, i) => (
                            <option key={i} value={j}>{j}</option>
                        ))}
                    </select>
                    <input type="text" className="search-input" name="lokasi" placeholder="Masukkan Lokasi" defaultValue={filters?.lokasi || ''} />
                    <button className="search-button" type="submit">Cari</button>
                </form>
            </div>

            <div className="job-list">
                {data.length > 0 ? data.map((row, idx) => (
                    <div className="job-card" key={row.id_lowker} ref={el => cardsRef.current[idx] = el}>
                        <div className="job-header">
                            <h3>{row.perusahaan?.nama}</h3>
                        </div>
                        <div className="job-detail">
                            <ul>
                                <li><i className="fa-solid fa-building"></i>{row.perusahaan?.nama}</li>
                                <li><i className="fa-solid fa-location-dot"></i>{row.lokasi}</li>
                                <li><i className="fa-regular fa-clock"></i>{row.tgl_posting}</li>
                                <li style={{ color: 'red' }}>exp date: {row.tgl_ditutup}</li>
                            </ul>
                            <p className="job-role">{row.judul_lowker}</p>
                            <div className="line"></div>
                            <div className="job-tags">
                                <p>{row.jurusan?.jurusan}</p>
                            </div>
                        </div>
                        <div className="job-footer">
                            <Link href={`/loker/${row.id_lowker}`}>
                                <button className="detail-button"><i className="fas fa-info-circle"></i> DETAIL</button>
                            </Link>
                        </div>
                    </div>
                )) : (
                    <p className="no-data">Tidak ada lowongan kerja yang tersedia.</p>
                )}
            </div>

            <div className="pagination-container">
                <div className="pagination-info">
                    <p>Ditampilkan <strong>{from}</strong> sampai <strong>{to}</strong> dari total <strong>{total}</strong> lowongan</p>
                </div>
                <div className="pagination">
                    {links.map((link, i) => (
                        <Link key={i} href={link.url || '#'}
                            className={`${link.active ? 'active' : ''} ${link.label.includes('Previous') || link.label.includes('Next') ? 'navigate' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            preserveScroll />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
