import bcrypt from 'bcryptjs';

export class PasswordUtils {
    // Número de rounds para o salt. Quanto maior, mais seguro, mas mais lento
    private static readonly SALT_ROUNDS = 12;

    /**
     * Gera um hash seguro para a senha fornecida
     * @param password - A senha em texto puro
     * @returns Promise com o hash da senha
     */
    static async hashPassword(password: string): Promise<string> {
        try {
            // Gera um salt único
            const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
            // Cria o hash com o salt
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            console.error('Erro ao gerar hash da senha:', error);
            throw new Error('Falha ao processar a senha');
        }
    }

    /**
     * Compara uma senha em texto puro com um hash
     * @param password - A senha em texto puro
     * @param hashedPassword - O hash armazenado da senha
     * @returns Promise<boolean> - true se a senha corresponder ao hash
     */
    static async comparePassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.error('Erro ao comparar senhas:', error);
            throw new Error('Falha ao verificar a senha');
        }
    }

    /**
     * Valida se a senha atende aos requisitos mínimos de segurança
     * @param password - A senha a ser validada
     * @returns objeto com resultado da validação e mensagem de erro se houver
     */
    static validatePassword(password: string): {
        isValid: boolean;
        message?: string
    } {
        if (password.length < 8) {
            return {
                isValid: false,
                message: 'A senha deve ter pelo menos 8 caracteres'
            };
        }

        // Verifica se contém pelo menos um número
        if (!/\d/.test(password)) {
            return {
                isValid: false,
                message: 'A senha deve conter pelo menos um número'
            };
        }

        // Verifica se contém pelo menos uma letra maiúscula
        if (!/[A-Z]/.test(password)) {
            return {
                isValid: false,
                message: 'A senha deve conter pelo menos uma letra maiúscula'
            };
        }

        // Verifica se contém pelo menos uma letra minúscula
        if (!/[a-z]/.test(password)) {
            return {
                isValid: false,
                message: 'A senha deve conter pelo menos uma letra minúscula'
            };
        }

        // Verifica se contém pelo menos um caractere especial
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return {
                isValid: false,
                message: 'A senha deve conter pelo menos um caractere especial'
            };
        }

        return { isValid: true };
    }
}