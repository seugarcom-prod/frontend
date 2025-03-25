// services/employee/services.ts
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Interface para funcionários
export interface IEmployee {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: "ADMIN" | "MANAGER" | "ATTENDANT";
    createdAt: string;
    updatedAt: string;
}

// Interface para criação de funcionários
export interface ICreateEmployeeData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role: "ADMIN" | "MANAGER" | "ATTENDANT";
    unitId: string;
}

// Interface para atualização de funcionários
export interface IUpdateEmployeeData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: "ADMIN" | "MANAGER" | "ATTENDANT";
    password?: string;
}

// Função para buscar todos os funcionários de uma unidade
export async function getEmployeesByUnit(unitId: string) {
    const token = localStorage.getItem('auth_token');

    try {
        const response = await fetch(`${API_URL}/unit/${unitId}/employees`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar funcionários');
        }

        return await response.json() as IEmployee[];
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        throw error;
    }
}

// Função para buscar um funcionário específico
export async function getEmployeeById(id: string) {
    const token = localStorage.getItem('auth_token');

    try {
        const response = await fetch(`${API_URL}/employee/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar funcionário');
        }

        return await response.json() as IEmployee;
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        throw error;
    }
}

// Função para criar um novo funcionário
export async function createEmployee(data: ICreateEmployeeData) {
    const token = localStorage.getItem('auth_token');

    try {
        const response = await fetch(`${API_URL}/employee/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar funcionário');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        throw error;
    }
}

// Função para atualizar um funcionário
export async function updateEmployee(id: string, data: IUpdateEmployeeData) {
    const token = localStorage.getItem('auth_token');

    try {
        const response = await fetch(`${API_URL}/employee/${id}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar funcionário');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        throw error;
    }
}

// Função para excluir um funcionário
export async function deleteEmployee(id: string) {
    const token = localStorage.getItem('auth_token');

    try {
        const response = await fetch(`${API_URL}/employee/${id}/delete`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao excluir funcionário');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        throw error;
    }
}

// Função para formatar nome completo
export function formatFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
}

// Função para formatar função do funcionário em português
export function formatRole(role: string): string {
    const roleMap: Record<string, string> = {
        'ADMIN': 'Administrador',
        'MANAGER': 'Gerente',
        'ATTENDANT': 'Atendente'
    };

    return roleMap[role] || role;
}

// Função para formatar data em formato brasileiro
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}