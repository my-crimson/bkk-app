import { usePage, Link } from '@inertiajs/react';
import Header from '../Components/Navbar/Header';
import GuestNav from '../Components/Navbar/GuestNav';
import AdminNav from '../Components/Navbar/AdminNav';
import AlumniNav from '../Components/Navbar/AlumniNav';

export default function MainLayout({ children, className = '' }) {
    const { auth, flash } = usePage().props;

    const renderNavbar = () => {
        if (!auth?.user) return <GuestNav />;
        if (auth.user.role === 'admin') return <AdminNav />;
        if (auth.user.role === 'alumni') return <AlumniNav />;
        return <GuestNav />;
    };

    return (
        <div className={className}>
            {flash?.success && (
                <div className="floating-notif success">{flash.success}</div>
            )}
            {flash?.error && (
                <div className="floating-notif error">{flash.error}</div>
            )}
            <Header />
            {renderNavbar()}
            {children}
        </div>
    );
}
