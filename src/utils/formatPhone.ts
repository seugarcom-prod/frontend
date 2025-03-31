const formatPhone = (value: string): string => {
    // Remove todos os caracteres não numéricos
    const digits = value.replace(/\D/g, '');

    // Formatação para telefone brasileiro:
    // (XX) XXXXX-XXXX para celular
    // (XX) XXXX-XXXX para telefone fixo
    if (digits.length <= 10) {
        // Telefone fixo
        return digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3').trim();
    } else {
        // Celular
        return digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3').trim();
    }
};

// Função para verificar se o número é válido
const isValidPhone = (phone: string): boolean => {
    // Remove tudo que não for dígito
    const digits = phone.replace(/\D/g, '');

    // Validação básica - número de dígitos
    // Telefone fixo: 10 dígitos (com DDD)
    // Celular: 11 dígitos (com DDD)
    return digits.length === 10 || digits.length === 11;
};
