import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function InformasiJurusanIndex({ jurusan }) {
    const [activePopup, setActivePopup] = useState(null);

    // Ambil data paginate Laravel
    const jurusanData = jurusan?.data || [];

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.jurusan-card').forEach(c => observer.observe(c));

        return () => observer.disconnect();
    }, [jurusanData]);

    const parseProspek = (text) => {
        if (!text) return [];
        return text
            .split('\n')
            .filter(line => line.trim() !== '');
    };

    return (
        <MainLayout>
            <Head title="Informasi Jurusan" />

            <div className="header-bar">
                <a href="#">Informasi Jurusan</a>
            </div>

            <div className="jurusan-container">

                <div className="jurusan-grid">
                    {jurusanData.length > 0 ? (
                        jurusanData.map((data) => (
                            <div
                                key={data.id_jurusan}
                                className="jurusan-card"
                                onClick={() => setActivePopup(data)}
                            >
                                <div className="jurusan-image">
                                    {data.gambar1 ? (
                                        <img
                                            src={`/storage/uploads/jurusan/${data.gambar1}`}
                                            alt={data.jurusan}
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            <i className="fa-solid fa-graduation-cap"></i>
                                        </div>
                                    )}

                                    <div className="image-overlay">
                                        <span>Lihat Detail</span>
                                    </div>
                                </div>

                                <div className="jurusan-info">
                                    <h3>{data.jurusan}</h3>

                                    <p>
                                        {data.deskripsi
                                            ? data.deskripsi.substring(0, 120) + '...'
                                            : 'Belum ada deskripsi.'}
                                    </p>

                                    <button className="btn-selengkapnya">
                                        Baca Selengkapnya{' '}
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data-wrapper">
                            <p>Belum ada data informasi jurusan.</p>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {jurusan?.links && (
                    <div className="pagination">
                        {jurusan.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                className={`page-btn ${link.active ? 'active' : ''}`}
                                onClick={() => {
                                    if (link.url) {
                                        window.location.href = link.url;
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* POPUP */}
            {activePopup && (
                <div className="jurusan-modal active">

                    <div
                        className="modal-overlay"
                        onClick={() => setActivePopup(null)}
                    ></div>

                    <div className="modal-content">

                        <button
                            className="modal-close"
                            onClick={() => setActivePopup(null)}
                        >
                            &times;
                        </button>

                        <div className="modal-header">
                            <h2>{activePopup.jurusan}</h2>
                        </div>

                        <div className="modal-body">

                            <div className="modal-gallery">

                                {activePopup.gambar1 && (
                                    <img
                                        src={`/storage/uploads/jurusan/${activePopup.gambar1}`}
                                        alt="Preview 1"
                                    />
                                )}

                                {activePopup.gambar2 && (
                                    <img
                                        src={`/storage/uploads/jurusan/${activePopup.gambar2}`}
                                        alt="Preview 2"
                                    />
                                )}

                            </div>

                            <div className="modal-text">

                                <h3>Tentang Jurusan</h3>

                                <p>
                                    {activePopup.deskripsi || 'Belum ada deskripsi.'}
                                </p>

                                {parseProspek(activePopup.prospek_kerja).length > 0 && (
                                    <div className="prospek-section">

                                        <h3>
                                            <i className="fa-solid fa-briefcase"></i>
                                            {' '}Prospek Kerja
                                        </h3>

                                        <ul>
                                            {parseProspek(activePopup.prospek_kerja).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>

                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}