import React from 'react';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-contact-info">
                    <a href="https://wa.me/6287844852308" target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                        <i className="fab fa-whatsapp"></i>
                        <div className="footer-contact-text">
                            <p>Call Us (Whatsapp)</p>
                            <p>+62 878-4485-2308</p>
                        </div>
                    </a>
                    <a href="https://mail.google.com/mail/?view=cm&to=bkksmkn1boy@gmail.com" target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                        <i className="fas fa-envelope"></i>
                        <div className="footer-contact-text">
                            <p>Email Us</p>
                            <p>bkksmkn1boy@gmail.com</p>
                        </div>
                    </a>
                    <a href="https://www.google.com/maps/search/SMKN+1+Boyolangu+Tulungagung" target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <div className="footer-contact-text">
                            <p>Located Us</p>
                            <p>Jl. Ki Mangun Sarkoro No.VI/3, Beji, Boyolangu</p>
                        </div>
                    </a>
                    <a href="https://www.instagram.com/bkkesemkita_official" target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                        <i className="fab fa-instagram"></i>
                        <div className="footer-contact-text">
                            <p>Instagram</p>
                            <p>@bkkesemkita_official</p>
                        </div>
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Bursa Kerja Khusus SMKN 1 Boyolangu. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
