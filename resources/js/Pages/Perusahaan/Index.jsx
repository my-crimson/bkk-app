import { Head, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useState, useEffect } from 'react';

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

        /* Overlay Detail di Carousel */
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

        /* Navigation Buttons */
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

        /* =========================================
           CSS POPUP MODERN & RAPI (BARU)
           ========================================= */
        .popup-overlay {
            display: none; 
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5); 
            backdrop-filter: blur(4px); /* Efek blur pada background */
            z-index: 100;
            align-items: center; /* Menengahkan vertikal */
            justify-content: center; /* Menengahkan horizontal */
        }
        .popup-overlay.active { 
            display: flex; 
        }

        .company-popup {
            display: flex;
            flex-direction: column;
            width: 90vw;
            max-width: 800px; /* Lebar maksimal agar tidak terlalu memanjang di PC */
            max-height: 90vh;
            background: #ffffff;
            border-radius: 16px; /* Sudut melengkung yang modern */
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
            z-index: 101;
            opacity: 0;
            transform: scale(0.9); /* Skala awal untuk efek zoom-in */
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden; /* Memastikan isinya mengikuti lengkungan border */
        }

        /* Trigger untuk memunculkan popup */
        .popup-overlay.active .company-popup {
            opacity: 1;
            transform: scale(1);
        }

        /* Tombol Close Modern */
        .company-popup .close-popup button {
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
        .company-popup .close-popup button:hover {
            background: #ef4444; /* Warna merah saat di-hover */
            color: white;
            transform: rotate(90deg); /* Efek putaran kecil */
        }

        /* Header Popup */
        .company-header-popup {
            padding: 30px 40px 25px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }

        .company-title-popup h1 {
            margin: 0 0 8px 0;
            color: #0f172a;
            font-size: 24px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
        }

        .company-desc-popup p {
            margin: 0;
            font-size: 14.5px;
            color: #64748b;
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            font-weight: 400;
        }

        /* Konten Detail Popup */
        .company-detail-popup {
            padding: 25px 40px 35px;
            overflow-y: auto; /* Bisa discroll jika konten terlalu panjang */
        }

        .company-detail-popup table {
            width: 100%;
            border-collapse: collapse;
        }

        .company-detail-popup td {
            padding: 14px 0;
            border-bottom: 1px dashed #cbd5e1;
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            color: #334155;
        }

        /* Menghilangkan garis di baris paling bawah */
        .company-detail-popup tr:last-child td {
            border-bottom: none;
        }

        .company-detail-popup .company-detail-left {
            width: 35%;
            font-weight: 600;
            color: #475569;
        }

        .company-detail-popup .company-detail-right {
            width: 65%;
        }
    `}</style>
);

export default function PerusahaanIndex({ perusahaan = [], filters = {} }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activePopup, setActivePopup] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false); 

    const total = perusahaan.length;
    const useCarousel = total >= 7;

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/perusahaan', {
            search: formData.get('search') || '',
            skala: formData.get('skala') || '',
        }, { 
            preserveState: true, 
            replace: true 
        });
    };

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev + 1) % total);
        setTimeout(() => setIsTransitioning(false), 700);
    };

    const handlePrev = () => {
        if (isTransitioning) return;
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

            {total === 0 ? (
                <p style={{ textAlign: 'center', padding: '50px' }}>Tidak ada data.</p>
            ) : useCarousel ? (
                <div 
                    className="company-container"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="company-list">
                        {perusahaan.map((p, index) => {
                            const slotClass = getSlotClass(index);
                            const isFocus = slotClass === 'slot-3';

                            return (
                                <div
                                    key={p.id_perusahaan}
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
                        <button 
                            className="nav-btn" 
                            onClick={handlePrev}
                            disabled={isTransitioning}
                        >
                            ❮
                        </button>
                        <button 
                            className="nav-btn" 
                            onClick={handleNext}
                            disabled={isTransitioning}
                        >
                            ❯
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '40px' }}>
                    {perusahaan.map(p => (
                        <div key={p.id_perusahaan} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3>{p.nama}</h3>
                            <button onClick={() => setActivePopup(p)} className="detail-btn" style={{marginTop: '10px'}}>Detail</button>
                        </div>
                    ))}
                </div>
            )}

            {/* --- BAGIAN SEARCH --- */}
            <div className="search-container">
                <form className="search" onSubmit={handleFilter}>
                    <label htmlFor="search-perusahaan">Pencarian:</label>
                    <input
                        id="search-perusahaan"
                        name="search"
                        className="search-input"
                        placeholder="Nama perusahaan..."
                        defaultValue={filters?.search || ''}
                    />

                    <label htmlFor="skala-perusahaan">Skala:</label>
                    <select
                        id="skala-perusahaan"
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

            {/* --- BAGIAN POPUP DETAIL --- */}
            {activePopup && (
                <div className="popup-overlay active" onClick={() => setActivePopup(null)}>
                    <div className="company-popup" onClick={e => e.stopPropagation()}>
                        
                        <div className="close-popup">
                            <button onClick={() => setActivePopup(null)}>&times;</button>
                        </div>
                        
                        <div className="company-header-popup">
                            <div className="company-title-popup">
                                <h1>{activePopup.nama || 'Nama Perusahaan'}</h1>
                            </div>
                            <div className="company-desc-popup">
                                <p>{activePopup.deskripsi || 'Deskripsi perusahaan belum tersedia.'}</p>
                            </div>
                        </div>

                        <div className="company-detail-popup">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="company-detail-left">Nama Perusahaan</td>
                                        <td className="company-detail-right">: {activePopup.nama || '-'}</td>
                                    </tr>
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
                                        <td className="company-detail-left">Jenis Perusahaan</td>
                                        <td className="company-detail-right">: {activePopup.jenis || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="company-detail-left">Skala Perusahaan</td>
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