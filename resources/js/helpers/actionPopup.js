export function confirmAction(actionLabel) {
    return new Promise((resolve) => {
        window.dispatchEvent(new CustomEvent('app:confirm-action', {
            detail: {
                message: `Apakah anda yakin akan melakukan aksi berikut: ${actionLabel}?`,
                resolve,
            },
        }));
    });
}

export function notifyActionSuccess(actionLabel) {
    window.dispatchEvent(new CustomEvent('app:notify-action', {
        detail: {
            type: 'success',
            message: `Anda telah berhasil melakukan aksi ${actionLabel}.`,
        },
    }));
}

export function notifyActionError(message) {
    window.dispatchEvent(new CustomEvent('app:notify-action', {
        detail: {
            type: 'error',
            message: message,
        },
    }));
}
