import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Header from '../Components/Navbar/Header';
import GuestNav from '../Components/Navbar/GuestNav';
import AdminNav from '../Components/Navbar/AdminNav';
import AlumniNav from '../Components/Navbar/AlumniNav';

export default function MainLayout({ children, className = '' }) {
    const { auth, flash } = usePage().props;
    const [confirmState, setConfirmState] = useState({ open: false, message: '', resolver: null });
    const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
    const toastTimeoutRef = useRef(null);

    const renderNavbar = () => {
        if (!auth?.user) return <GuestNav />;
        if (auth.user.role === 'management') return <AdminNav />;
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
