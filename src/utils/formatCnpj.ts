// Função para formatar o CNPJ
export const formatCnpj = (value: string): string => {
    // Remove todos os caracteres não numéricos
    const cnpjDigits = value.replace(/\D/g, '');

    // Limita ao máximo de 14 dígitos
    const limitedCnpj = cnpjDigits.slice(0, 14);

    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    if (limitedCnpj.length <= 2) {
        return limitedCnpj;
    } else if (limitedCnpj.length <= 5) {
        return `${limitedCnpj.slice(0, 2)}.${limitedCnpj.slice(2)}`;
    } else if (limitedCnpj.length <= 8) {
        return `${limitedCnpj.slice(0, 2)}.${limitedCnpj.slice(2, 5)}.${limitedCnpj.slice(5)}`;
    } else if (limitedCnpj.length <= 12) {
        return `${limitedCnpj.slice(0, 2)}.${limitedCnpj.slice(2, 5)}.${limitedCnpj.slice(5, 8)}/${limitedCnpj.slice(8)}`;
    } else {
        return `${limitedCnpj.slice(0, 2)}.${limitedCnpj.slice(2, 5)}.${limitedCnpj.slice(5, 8)}/${limitedCnpj.slice(8, 12)}-${limitedCnpj.slice(12)}`;
    }
};

// Validador de CNPJ
export const isValidCnpj = (cnpj: string): boolean => {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, '');

    // Verificar se tem 14 dígitos
    if (cnpj.length !== 14) return false;

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }
    let digit = 11 - (sum % 11);
    let firstVerifier = digit > 9 ? 0 : digit;

    // Validação do segundo dígito verificador
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }
    digit = 11 - (sum % 11);
    let secondVerifier = digit > 9 ? 0 : digit;

    return (
        parseInt(cnpj.charAt(12)) === firstVerifier &&
        parseInt(cnpj.charAt(13)) === secondVerifier
    );
};

// Handler unificado para todos os campos de CNPJ
export const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, updateFormData: (data: any) => void) => {
    const value = e.target.value;
    // Formatando o valor
    const formattedValue = formatCnpj(value);

    // Atualizar apenas se o comprimento formatado for maior ou se estiver apagando
    if (formattedValue.length >= e.target.value.length || value.length < e.target.value.length) {
        updateFormData({ [fieldName]: formattedValue });
    }
};

// Handlers específicos, reusando a função comum
export const handleCnpjPart1Change = (e: React.ChangeEvent<HTMLInputElement>, updateFormData: (data: any) => void) => {
    handleCnpjChange(e, 'cnpjPart1', updateFormData);
};

export const handleCnpjPart2Change = (e: React.ChangeEvent<HTMLInputElement>, updateFormData: (data: any) => void) => {
    handleCnpjChange(e, 'cnpjPart2', updateFormData);
};

export const handleCnpjPart3Change = (e: React.ChangeEvent<HTMLInputElement>, updateFormData: (data: any) => void) => {
    handleCnpjChange(e, 'cnpjPart3', updateFormData);
};

// Para o telefone, mantemos a mesma lógica do código original
export const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, updateFormData: (data: any) => void) => {
    const formattedPhone = formatPhone(e.target.value);
    updateFormData({ phone: formattedPhone });
};