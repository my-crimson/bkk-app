import { Head, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useState, useEffect } from 'react';

// --- STYLING TETAP (TIDAK DIUBAH) ---
const CarouselStyles = () => (
    <style>{`
        .header-bar {
            background-color: #d1f0ff;
            padding: 10px 20px;
            text-align: left;
            font-size: 14px;
            font-weight: 500;
        }
        .header-bar a {
            color: #002366;
            text-decoration: none;
            margin-right: 40px;
        }

        .company-container {
            width: 100%;
            position: relative;
            padding-bottom: 50px;
            overflow: hidden;
        }

        .company-list {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 450px;
            margin: 0 auto;
            width: 100%;
            position: relative;
            perspective: 1000px;
        }

        .company-item {
            position: absolute;
            transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 0;
            cursor: pointer;
            user-select: none;
            opacity: 0;
            transform: translateX(-50%) scale(0.5);
        }

        .company-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        /* --- PEMETAAN SLOT DESAIN --- */
        .slot-0 { height: 310px; width: 220px; left: 0%; filter: brightness(0) blur(10px); opacity: 0; z-index: 0; pointer-events: none; }
        .slot-1 { height: 310px; width: 220px; left: 15%; filter: brightness(0.4) blur(1px); transform: translateX(-50%) scale(0.9); opacity: 1; z-index: 1; }
        .slot-2 { height: 323px; width: 210px; left: 32%; filter: brightness(0.6); transform: translateX(-50%) scale(0.95); opacity: 1; z-index: 2; }
        .slot-3 { height: 360px; width: 240px; left: 50%; transform: translateX(-50%) scale(1.1); filter: brightness(1); z-index: 10; opacity: 1; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
        .slot-4 { height: 323px; width: 210px; left: 68%; filter: brightness(0.6); transform: translateX(-50%) scale(0.95); opacity: 1; z-index: 2; }
        .slot-5 { height: 310px; width: 220px; left: 85%; filter: brightness(0.4) blur(1px); transform: translateX(-50%) scale(0.9); opacity: 1; z-index: 1; }
        .slot-6 { height: 310px; width: 220px; left: 100%; filter: brightness(0) blur(10px); opacity: 0; z-index: 0; pointer-events: none; }

        .company-detail {
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            color: white;
            position: absolute;
            left: 50%; bottom: 0;
            transform: translateX(-50%);
            z-index: 11;
            width: 100%;
            border-bottom-right-radius: 15px;
            border-bottom-left-radius: 15px;
            padding: 15px;
            text-align: center;
        }
        .company-detail h2 {
            font-size: 16px; margin-bottom: 8px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .detail-btn {
            border: none; background: #007bff; border-radius: 20px;
            color: white; padding: 6px 15px; font-size: 13px;
            cursor: pointer; transition: 0.3s;
        }
        .detail-btn:hover { background: #0056b3; }

        .company-controls {
            display: flex; position: absolute; top: 50%; width: 100%;
            transform: translateY(-50%); justify-content: space-between;
            padding: 0 40px; pointer-events: none; z-index: 20;
        }
        .nav-btn {
            width: 50px; height: 50px; border-radius: 50%; background: white;
            border: 1px solid #eee; color: #333; font-size: 20px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; pointer-events: all; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .nav-btn:hover { background: #007bff; color: white; transform: scale(1.1); }

        /* POPUP MODERN */
        .popup-overlay {
            display: none; 
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5); 
            backdrop-filter: blur(4px);
            z-index: 100;
            align-items: center;
            justify-content: center;
        }
        .popup-overlay.active { display: flex; }

        .company-popup {
            display: flex;
            flex-direction: column;
            width: 90vw;
            max-width: 800px;
            max-height: 90vh;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
            z-index: 101;
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            position: relative;
        }

        .popup-overlay.active .company-popup {
            opacity: 1;
            transform: scale(1);
        }

        .close-popup button {
            position: absolute;
            top: 20px;
            right: 25px;
            border: none;
            background: #f1f5f9;
            color: #64748b;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
        }
        .close-popup button:hover {
            background: #ef4444;
            color: white;
            transform: rotate(90deg);
        }

        .company-header-popup {
            padding: 30px 40px 25px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }

        .company-title-popup h1 {
            margin: 0 0 8px 0;
            color: #0f172a;
            font-size: 24px;
            font-weight: 600;
        }

        .company-detail-popup {
            padding: 25px 40px 35px;
            overflow-y: auto;
        }

        .company-detail-popup table {
            width: 100%;
            border-collapse: collapse;
        }

        .company-detail-popup td {
            padding: 14px 0;
            border-bottom: 1px dashed #cbd5e1;
            font-size: 15px;
            color: #334155;
        }

        .company-detail-left { width: 35%; font-weight: 600; color: #475569; }

        .results-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
            gap: 25px; 
            padding: 20px 5%; 
            margin-bottom: 50px;
        }
        .card-perusahaan {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            border: 1px solid #eef2f6;
            transition: 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .card-perusahaan:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .card-img { width: 100%; height: 160px; object-fit: cover; }
        .card-body { padding: 15px; }

        .search-container {
            padding: 20px 5%;
            background: #f8fafc;
            margin-bottom: 20px;
        }
        .search {
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }
        .search-input, .search-select {
            padding: 8px 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        .search-button {
            padding: 8px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
    `}</style>
);

export default function PerusahaanIndex({ perusahaan = [], carouselPerusahaan = [], filters = {} }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activePopup, setActivePopup] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false); 

    const total = carouselPerusahaan.length;
    // Carousel aktif jika minimal ada 7 data
    const useCarousel = total >= 7;

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get(window.location.pathname, {
            search: formData.get('search') || '',
            skala: formData.get('skala') || '',
        }, { 
            preserveState: true, 
            replace: true 
        });
    };

    const handleNext = () => {
        if (isTransitioning || total === 0) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev + 1) % total);
        setTimeout(() => setIsTransitioning(false), 700);
    };

    const handlePrev = () => {
        if (isTransitioning || total === 0) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev - 1 + total) % total);
        setTimeout(() => setIsTransitioning(false), 700);
    };

    useEffect(() => {
        if (!useCarousel || isPaused || total === 0) return; 
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
    }, [isPaused, useCarousel, total, isTransitioning]);

    const getSlotClass = (itemIndex) => {
        let diff = itemIndex - activeIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const slotMap = {
            '-3': 'slot-0', '-2': 'slot-1', '-1': 'slot-2',
            '0':  'slot-3',
            '1':  'slot-4',  '2':  'slot-5',  '3':  'slot-6',
        };
        return slotMap[diff] || (diff < -3 ? 'slot-0' : 'slot-6');
    };

    return (
        <MainLayout>
            <Head title="Perusahaan" />
            <CarouselStyles />

            <div className="header-bar">
                <a href="#">Daftar Perusahaan</a>
            </div>

            {/* --- SECTION 1: CAROUSEL (Hanya muncul jika >= 7 data) --- */}
            {useCarousel && total > 0 && (
                <div 
                    className="company-container"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="company-list">
                        {carouselPerusahaan.map((p, index) => {
                            const slotClass = getSlotClass(index);
                            const isFocus = slotClass === 'slot-3';

                            return (
                                <div
                                    key={`carousel-${p.id_perusahaan}`}
                                    className={`company-item ${slotClass}`}
                                    onClick={() => {
                                        if (slotClass === 'slot-1' || slotClass === 'slot-2') handlePrev();
                                        if (slotClass === 'slot-4' || slotClass === 'slot-5') handleNext();
                                    }}
                                >
                                    {p.gambar 
                                        ? <img src={`/storage/gambar_perusahaan/${p.gambar}`} alt={p.nama} />
                                        : <div style={{width:'100%', height:'100%', background:'#eee', borderRadius:'15px'}}></div>
                                    }

                                    {isFocus && (
                                        <div className="company-detail">
                                            <h2>{p.nama}</h2>
                                            <button 
                                                className="detail-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActivePopup(p);
                                                }}
                                            >
                                                <i className="fa-solid fa-eye"></i> Detail
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="company-controls">
                        <button className="nav-btn" onClick={handlePrev} disabled={isTransitioning}>❮</button>
                        <button className="nav-btn" onClick={handleNext} disabled={isTransitioning}>❯</button>
                    </div>
                </div>
            )}

            {/* --- SECTION 2: SEARCH FILTER --- */}
            <div className="search-container">
                <form className="search" onSubmit={handleFilter}>
                    <label>Pencarian:</label>
                    <input
                        name="search"
                        className="search-input"
                        placeholder="Nama perusahaan..."
                        defaultValue={filters?.search || ''}
                    />

                    <label>Skala:</label>
                    <select
                        name="skala"
                        className="search-select"
                        defaultValue={filters?.skala || ''}
                    >
                        <option value="">-- Semua Jenis --</option>
                        <option value="lokal">Lokal</option>
                        <option value="Provinsi">Provinsi</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Internasional</option>
                    </select>

                    <button className="search-button" type="submit">Cari</button>
                </form>
            </div>

            {/* --- SECTION 3: HASIL GRID --- */}
            <div className="results-grid">
                {perusahaan.length > 0 ? (
                    perusahaan.map(p => (
                        <div key={`grid-${p.id_perusahaan}`} className="card-perusahaan">
                            {p.gambar ? (
                                <img className="card-img" src={`/storage/gambar_perusahaan/${p.gambar}`} alt={p.nama} />
                            ) : (
                                <div className="card-img" style={{background: '#f1f5f9'}}></div>
                            )}
                            <div className="card-body">
                                <h3>{p.nama}</h3>
                                <p style={{fontSize: '12px', color: '#64748b'}}>{p.skala} | {p.jenis}</p>
                                <button 
                                    onClick={() => setActivePopup(p)} 
                                    className="detail-btn" 
                                    style={{marginTop: '15px', width: '100%'}}
                                >
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748b'}}>
                        Data tidak ditemukan untuk pencarian ini.
                    </div>
                )}
            </div>

            {/* --- BAGIAN POPUP DETAIL --- */}
            {activePopup && (
                <div className="popup-overlay active" onClick={() => setActivePopup(null)}>
                    <div className="company-popup" onClick={e => e.stopPropagation()}>
                        <div className="close-popup">
                            <button onClick={() => setActivePopup(null)}>&times;</button>
                        </div>
                        
                        <div className="company-header-popup">
                            <div className="company-title-popup">
                                <h1>{activePopup.nama}</h1>
                            </div>
                            <div className="company-desc-popup">
                                <p>{activePopup.deskripsi || 'Deskripsi perusahaan belum tersedia.'}</p>
                            </div>
                        </div>

                        <div className="company-detail-popup">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="company-detail-left">Alamat</td>
                                        <td className="company-detail-right">: {activePopup.alamat || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="company-detail-left">Kontak</td>
                                        <td className="company-detail-right">: {activePopup.kontak || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="company-detail-left">Email</td>
                                        <td className="company-detail-right">: {activePopup.email || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="company-detail-left">Website</td>
                                        <td className="company-detail-right">: {activePopup.website || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="company-detail-left">Jenis</td>
                                        <td className="company-detail-right">: {activePopup.jenis || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="company-detail-left">Skala</td>
                                        <td className="company-detail-right">: {activePopup.skala || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}