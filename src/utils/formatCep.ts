export const formatCep = (cep: string) => {
    // Remove tudo que não for número
    cep = cep.replace(/\D/g, "");

    // Formato: XXXXX-XXX
    if (cep.length > 5) {
        cep = `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
    }

    return cep;
};