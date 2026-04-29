import { useState } from 'react';

/**
 * Reusable password input with show/hide toggle (eye icon).
 * Uses inline SVG so the icon never disappears.
 */
export default function PasswordInput({ id, name, placeholder, value, onChange, className = '', ...rest }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="password-input-wrap">
            <input
                type={visible ? 'text' : 'password'}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={className}
                {...rest}
            />
            <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setVisible((v) => !v)}
                tabIndex={-1}
                aria-label={visible ? 'Sembunyikan password' : 'Lihat password'}
            >
                {visible ? (
                    /* Eye-off icon */
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                ) : (
                    /* Eye icon */
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
}
