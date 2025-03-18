export const formatCpf = (value: string) => {
    // Remove all non-digits
    value = value.replace(/\D/g, '');

    // Apply CPF mask: XXX.XXX.XXX-XX
    if (value.length <= 3) {
        return value;
    } else if (value.length <= 6) {
        return `${value.slice(0, 3)}.${value.slice(3)}`;
    } else if (value.length <= 9) {
        return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else {
        return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
    }
};