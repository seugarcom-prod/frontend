/**
 * Formata uma data para exibição em diversos formatos
 * @param date Data a ser formatada
 * @param format Formato desejado: 'short', 'long', 'datetime', 'time'
 * @param locale Localização para formatação (padrão: pt-BR)
 * @returns Data formatada
 */
export const formatDate = (
    date: Date | string | number | undefined,
    format: 'short' | 'long' | 'datetime' | 'time' = 'short',
    locale: string = 'pt-BR'
): string => {
    if (!date) return '-';

    const dateObj = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    // Verifica se a data é válida
    if (isNaN(dateObj.getTime())) {
        return '-';
    }

    try {
        switch (format) {
            case 'short':
                // Formato: DD/MM/YYYY
                return dateObj.toLocaleDateString(locale);

            case 'long':
                // Formato: 7 de janeiro de 2023
                return dateObj.toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

            case 'datetime':
                // Formato: DD/MM/YYYY HH:MM
                return dateObj.toLocaleDateString(locale) + ' ' +
                    dateObj.toLocaleTimeString(locale, {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

            case 'time':
                // Formato: HH:MM
                return dateObj.toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit'
                });

            default:
                return dateObj.toLocaleDateString(locale);
        }
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return String(dateObj);
    }
};