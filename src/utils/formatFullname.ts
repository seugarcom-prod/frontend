/**
 * Formata um nome e sobrenome para exibição como nome completo
 * @param firstName Nome
 * @param lastName Sobrenome
 * @param showFullName Se verdadeiro, mostra o nome completo. Se falso, mostra iniciais do sobrenome
 * @returns Nome formatado
 */
export const formatFullName = (
  firstName: string = '',
  lastName: string = '',
  showFullName: boolean = true
): string => {
  if (!firstName && !lastName) return '-';

  if (!showFullName && lastName) {
    // Formato "Nome S."
    const lastNameInitial = lastName.charAt(0).toUpperCase();
    return `${firstName} ${lastNameInitial}.`;
  }

  // Formato "Nome Sobrenome"
  return `${firstName} ${lastName}`.trim();
};