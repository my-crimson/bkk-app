import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function InformasiJurusanIndex() {
    const [activePopup, setActivePopup] = useState(null);

    // Dummy data repeating 7 times as per original PHP
    const cards = Array(7).fill({
        title: 'Teknik Kimia Industri',
        img1: '/images/ki 1.png',
        img2: '/images/KI 4 1.png',
        shortDesc: 'Jurusan Teknik Kimia Industri adalah salah satu bidang studi yang menggabungkan ilmu teknik dan ilmu kimia untuk mempelajari proses-proses industri yang melibatkan bahan kimia. Secara umum, teknik kimia industri memfokuskan pada pengembangan, perancangan, dan pengoperasian sistem industri yang dapat mengubah bahan mentah menjadi produk jadi melalui proses kimia dan fisik yang efisien.',
        projects: [
            'Industri perminyakan dan gas alam',
            'Pertambangan batu bara',
            'Industri semen',
            'Industri pupuk',
            'Process Engineer (Insinyur Proses): Bertanggung jawab atas desain dan pengoptimalan proses produksi',
            'Production Manager (Manajer Produksi): Mengelola proses produksi dan memastikan kualitas serta efisiensi',
            'Quality Control Analyst (Analis Kontrol Kualitas): Memastikan produk yang dihasilkan memenuhi standar kualitas',
            'Environmental Engineer (Insinyur Lingkungan): Mengelola dan meminimalkan dampak lingkungan dari proses industri',
            'Research and Development (R&D): Mengembangkan produk baru atau meningkatkan proses produksi yang sudah ada'
        ]
    });

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
    }, []);

    return (
        <MainLayout>
            <Head title="Informasi Jurusan" />
            <div className="header-bar"><a href="#">Informasi Jurusan</a></div>

            <div className="card-container">
                {cards.map((data, index) => (
                    <React.Fragment key={index}>
                        <div className="card" onClick={() => setActivePopup(index)}>
                            <div className="title"><p>{data.title}</p></div>
                            <div className="card-content">
                                <div className="foto"><img src={data.img1} alt="" /></div>
                                <div className="deskripsi">
                                    <hr />
                                    <p>{data.shortDesc}</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActivePopup(index); }}
                                        className="read-more-btn"
                                        style={{ background: 'none', padding: 0 }}
                                    >Baca Selengkapnya...</button>
                                </div>
                            </div>
                        </div>

                        <div className={`popup ${activePopup === index ? 'active' : ''}`}>
                            <div className="overlay" onClick={() => setActivePopup(null)}></div>
                            <div className="card-popup" onClick={(e) => e.stopPropagation()}>
                                <div className="title"><p>{data.title}</p></div>
                                <div className="popup-content">
                                    <div className="card-content">
                                        <div className="foto-popup">
                                            <img src={data.img1} alt="" />
                                            <img src={data.img2} alt="" />
                                        </div>
                                        <div className="deskripsi">
                                            <hr />
                                            <p>{data.shortDesc}</p>
                                            <br />
                                            <ul>
                                                <h3 style={{ marginLeft: '10px' }}>Proyek Kerja :</h3>
                                                <ul>
                                                    {data.projects.map((proj, i) => <li key={i}>{proj}</li>)}
                                                </ul>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="close-popup">
                                    <button className="close-btn" onClick={() => setActivePopup(null)}>&times;</button>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </MainLayout>
    );
}
