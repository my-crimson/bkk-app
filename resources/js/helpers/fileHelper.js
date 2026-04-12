export const validateImage = (file, type = 'File') => {
    if (!file) return null;

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
        return `${type} harus berupa JPG atau PNG`;
    }

    if (file.size > maxSize) {
        return `${type} maksimal 2MB`;
    }

    return null;
};