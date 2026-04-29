import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function InformasiJurusanIndex({ jurusan = [] }) {
    const [activePopup, setActivePopup] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card').forEach(c => observer.observe(c));

        return () => observer.disconnect();
    }, [jurusan]);

    // Parse prospek_kerja string (newline-separated) into array
    const parseProspek = (text) => {
        if (!text) return [];
        return text.split('\n').filter(line => line.trim() !== '');
    };

    return (
        <MainLayout>
            <Head title="Informasi Jurusan" />
            <div className="header-bar"><a href="#">Informasi Jurusan</a></div>

            <div className="card-container">
                {jurusan.length > 0 ? jurusan.map((data) => (
                    <React.Fragment key={data.id_jurusan}>
                        <div className="card" onClick={() => setActivePopup(data.id_jurusan)}>
                            <div className="title"><p>{data.jurusan}</p></div>
                            <div className="card-content">
                                <div className="foto">
                                    {data.gambar1 ? (
                                        <img src={`/storage/uploads/jurusan/${data.gambar1}`} alt={data.jurusan} />
                                    ) : (
                                        <div style={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '6px' }}>
                                            <i className="fa-solid fa-graduation-cap" style={{ fontSize: '3em', color: '#ccc' }}></i>
                                        </div>
                                    )}
                                </div>
                                <div className="deskripsi">
                                    <hr />
                                    <p>{data.deskripsi || 'Belum ada deskripsi.'}</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActivePopup(data.id_jurusan); }}
                                        className="read-more-btn"
                                        style={{ background: 'none', padding: 0 }}
                                    >Baca Selengkapnya...</button>
                                </div>
                            </div>
                        </div>

                        <div className={`popup ${activePopup === data.id_jurusan ? 'active' : ''}`}>
                            <div className="overlay" onClick={() => setActivePopup(null)}></div>
                            <div className="card-popup" onClick={(e) => e.stopPropagation()}>
                                <div className="title"><p>{data.jurusan}</p></div>
                                <div className="popup-content">
                                    <div className="card-content">
                                        <div className="foto-popup">
                                            {data.gambar1 ? (
                                                <img src={`/storage/uploads/jurusan/${data.gambar1}`} alt={data.jurusan} />
                                            ) : (
                                                <div style={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '6px' }}>
                                                    <i className="fa-solid fa-graduation-cap" style={{ fontSize: '3em', color: '#ccc' }}></i>
                                                </div>
                                            )}
                                            {data.gambar2 && (
                                                <img src={`/storage/uploads/jurusan/${data.gambar2}`} alt={data.jurusan} />
                                            )}
                                        </div>
                                        <div className="deskripsi">
                                            <hr />
                                            <p>{data.deskripsi || 'Belum ada deskripsi.'}</p>
                                            <br />
                                            {parseProspek(data.prospek_kerja).length > 0 && (
                                                <ul>
                                                    <h3 style={{ marginLeft: '10px' }}>Proyek Kerja :</h3>
                                                    <ul>
                                                        {parseProspek(data.prospek_kerja).map((proj, i) => <li key={i}>{proj}</li>)}
                                                    </ul>
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="close-popup">
                                    <button className="close-btn" onClick={() => setActivePopup(null)}>&times;</button>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )) : (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Belum ada data informasi jurusan.</p>
                )}
            </div>
        </MainLayout>
    );
}
