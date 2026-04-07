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
                <div className="contact-phone">
                    <i className="fas fa-phone-alt"></i>
                    <div className="contact-ket">
                        <p>Call Us</p>
                        <p>+6281-xxx-xxx-xxx</p>
                    </div>
                </div>
                <div className="contact-email">
                    <i className="fas fa-envelope"></i>
                    <div className="contact-ket">
                        <p>Email Us</p>
                        <p>bkksmkn1boyolangu@gmail.com</p>
                    </div>
                </div>
                <div className="contact-map">
                    <i className="fas fa-map-marker-alt"></i>
                    <div className="contact-ket">
                        <p>Located Us</p>
                        <p>Jl. Ki Mangun Sarkoro No.VI/3, Beji, Boyolangu</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
