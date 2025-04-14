// services/employee/index.ts
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3333";
// Interfaces
export interface IEmployee {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: "ADMIN" | "MANAGER" | "ATTENDANT";
    createdAt?: string;
}

export interface ICreateEmployeeData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role: "ADMIN" | "MANAGER" | "ATTENDANT";
    unitId: string;
}

export interface IUpdateEmployeeData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: "ADMIN" | "MANAGER" | "ATTENDANT";
}

// Formatador de roles para exibição
export const formatRole = (role: string): string => {
    const roleMap: Record<string, string> = {
        'ADMIN': 'Administrador',
        'MANAGER': 'Gerente',
        'ATTENDANT': 'Atendente'
    };
    return roleMap[role] || role;
};

// Obter todos os funcionários de uma unidade
export const getEmployeesByUnit = async (unitId: string): Promise<IEmployee[]> => {
    try {
        const token = sessionStorage.getItem('token'); // Ajuste conforme seu sistema de autenticação

        const response = await fetch(`${API_URL}/unit/${unitId}/employees`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao buscar funcionários");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Erro ao buscar funcionários:", error);
        throw error;
    }
};

// Obter funcionário por ID
export const getEmployeeById = async (id: string): Promise<IEmployee> => {
    try {
        const token = sessionStorage.getItem('token'); // Ajuste conforme seu sistema de autenticação

        const response = await fetch(`${API_URL}/employee/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao buscar funcionário");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Erro ao buscar funcionário:", error);
        throw error;
    }
};

// Criar funcionário
export const createEmployee = async (data: ICreateEmployeeData): Promise<IEmployee> => {
    try {
        const token = sessionStorage.getItem('token'); // Ajuste conforme seu sistema de autenticação

        const response = await fetch(`${API_URL}/employee/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao criar funcionário");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Erro ao criar funcionário:", error);
        throw error;
    }
};

// Atualizar funcionário
export const updateEmployee = async (id: string, data: IUpdateEmployeeData): Promise<IEmployee> => {
    try {
        const token = sessionStorage.getItem('token'); // Ajuste conforme seu sistema de autenticação

        const response = await fetch(`${API_URL}/employee/${id}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao atualizar funcionário");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Erro ao atualizar funcionário:", error);
        throw error;
    }
};

// Excluir funcionário
export const deleteEmployee = async (id: string): Promise<void> => {
    try {
        const token = sessionStorage.getItem('token'); // Ajuste conforme seu sistema de autenticação

        const response = await fetch(`${API_URL}/employee/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao excluir funcionário");
        }
    } catch (error: any) {
        console.error("Erro ao excluir funcionário:", error);
        throw error;
    }
};