import { useEffect, useRef, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Header from '../Components/Navbar/Header';
import GuestNav from '../Components/Navbar/GuestNav';
import ManagementNav from '../Components/Navbar/ManagementNav';
import AlumniNav from '../Components/Navbar/AlumniNav';

export default function MainLayout({ children, className = '' }) {
    const { auth, flash, mustChangePassword } = usePage().props;
    const [confirmState, setConfirmState] = useState({ open: false, message: '', resolver: null });
    const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
    const [showPasswordWarning, setShowPasswordWarning] = useState(false);
    const toastTimeoutRef = useRef(null);

    const renderNavbar = () => {
        if (!auth?.user) return <GuestNav />;
        if (auth.user.role === 'management') return <ManagementNav />;
        if (auth.user.role === 'alumni') return <AlumniNav />;
        return <GuestNav />;
    };

    const showToast = (type, message) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        setToast({ show: true, type, message });
        toastTimeoutRef.current = setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 3000);
    };

    // Pop-up peringatan ubah password
    useEffect(() => {
        if (
            mustChangePassword &&
            auth?.user?.role === 'alumni' &&
            !sessionStorage.getItem('pw_warning_dismissed')
        ) {
            setShowPasswordWarning(true);
        }
    }, []);

    const handlePasswordWarningOk = () => {
        sessionStorage.setItem('pw_warning_dismissed', '1');
        setShowPasswordWarning(false);
        router.visit('/profil');
    };

    useEffect(() => {
        const handleConfirm = (event) => {
            const { message, resolve } = event.detail || {};
            setConfirmState({ open: true, message: message || '', resolver: resolve || null });
        };

        const handleNotify = (event) => {
            const { type = 'success', message = '' } = event.detail || {};
            if (message) showToast(type, message);
        };

        window.addEventListener('app:confirm-action', handleConfirm);
        window.addEventListener('app:notify-action', handleNotify);

        return () => {
            window.removeEventListener('app:confirm-action', handleConfirm);
            window.removeEventListener('app:notify-action', handleNotify);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (flash?.success) showToast('success', flash.success);
        if (flash?.error) showToast('error', flash.error);
    }, [flash?.success, flash?.error]);

    const handleConfirmClose = (confirmed) => {
        if (confirmState.resolver) confirmState.resolver(confirmed);
        setConfirmState({ open: false, message: '', resolver: null });
    };

    return (
        <div className={className}>
            {toast.show && (
                <div className={`floating-notif ${toast.type}`}>{toast.message}</div>
            )}

            {/* Pop-up Peringatan Ubah Password */}
            {showPasswordWarning && (
                <div className="pw-warning-overlay">
                    <div className="pw-warning-modal">
                        <div className="pw-warning-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h3 className="pw-warning-title">Peringatan Keamanan</h3>
                        <p className="pw-warning-text">
                            Anda masih menggunakan <strong>NISN</strong> sebagai password.
                            Demi keamanan akun Anda, segera ubah password melalui halaman profil.
                        </p>
                        <button
                            type="button"
                            className="pw-warning-btn"
                            onClick={handlePasswordWarningOk}
                        >
                            OK, Ubah Password
                        </button>
                    </div>
                </div>
            )}

            {confirmState.open && (
                <div className="action-confirm-overlay" onClick={() => handleConfirmClose(false)}>
                    <div className="action-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Konfirmasi Aksi</h3>
                        <p>{confirmState.message}</p>
                        <div className="action-confirm-actions">
                            <button type="button" className="btn-cancel" onClick={() => handleConfirmClose(false)}>
                                Batal
                            </button>
                            <button type="button" className="btn-ok" onClick={() => handleConfirmClose(true)}>
                                Ya, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Header />
            {renderNavbar()}
            {children}
        </div>
    );
}
