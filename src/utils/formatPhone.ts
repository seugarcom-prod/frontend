const formatPhone = (value: string) => {
    value = value.replace(/\D/g, '');

    if (value.length <= 2) {
        return value;
    } else if (value.length <= 6) {
        return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
        return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else {
        return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }
};