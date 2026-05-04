export default function Header() {
    return (
        <header>
            <div className="rectangle"></div>
            <div className="logo">
                <div className="logo-header">
                    <img src="/images/logo.png" alt="Logo BKK" />
                </div>
                <div className="header-text">
                    <img src="/images/tulisan-logo.png" alt="Bursa Kerja Khusus SMKN 1 Boyolangu" id="text-img" />
                </div>
            </div>
            <div className="contact-info">
                <a
                    href="https://wa.me/6287844852308"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-phone"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                    title="Hubungi via WhatsApp"
                >
                    <i className="fab fa-whatsapp"></i>
                    <div className="contact-ket">
                        <p>Call Us (Whatsapp)</p>
                        <p>+62 878-4485-2308</p>
                    </div>
                </a>
                <a
                    href="https://mail.google.com/mail/?view=cm&to=bkksmkn1boy@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-email"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                    title="Kirim Email"
                >
                    <i className="fas fa-envelope"></i>
                    <div className="contact-ket">
                        <p>Email Us</p>
                        <p>bkksmkn1boy@gmail.com</p>
                    </div>
                </a>
                <a
                    href="https://www.google.com/maps/search/SMKN+1+Boyolangu+Tulungagung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-map"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                    title="Lihat di Google Maps"
                >
                    <i className="fas fa-map-marker-alt"></i>
                    <div className="contact-ket">
                        <p>Located Us</p>
                        <p>Jl. Ki Mangun Sarkoro No.VI/3, Beji, Boyolangu</p>
                    </div>
                </a>
                <a
                    href="https://www.instagram.com/bkkesemkita_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-instagram"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                    title="Follow Instagram @bkkesemkita_official"
                >
                    <i className="fab fa-instagram"></i>
                    <div className="contact-ket">
                        <p>Instagram</p>
                        <p>@bkkesemkita_official</p>
                    </div>
                </a>
            </div>
        </header>
    );
}
