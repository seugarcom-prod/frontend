'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import {
    getEmployeeById
} from '@/services/employee/index';

interface EmployeeFormProps {
    unitId: string;
    employeeId?: string; // Undefined para novo funcionário
    isEditMode: boolean;
}

export default function EmployeeForm({ unitId, employeeId, isEditMode }: EmployeeFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dados do formulário
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    // Erros de validação
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Carregar dados de funcionário para edição
    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (isEditMode && employeeId) {
                try {
                    setIsLoading(true);
                    const employee = await getEmployeeById(employeeId);

                    setFormData({
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        email: employee.email,
                        phone: employee.phone || '',
                        password: '',
                        confirmPassword: '',
                        role: employee.role
                    });
                } catch (error) {
                    console.error('Erro ao buscar dados do funcionário:', error);
                    setError('Não foi possível carregar os dados do funcionário.');
                    toast({
                        title: "Erro",
                        description: "Não foi possível carregar os dados do funcionário.",
                        variant: "destructive"
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchEmployeeData();
    }, [isEditMode, employeeId, toast]);

    // Atualizar dados do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(`Mudança no campo ${name}: ${value}`); // Adicione este log
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpar erro de validação quando o usuário digita
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Atualizar função selecionada
    const handleRoleChange = (value: string) => {
        console.log("Role: ", value)
        setFormData(prev => ({ ...prev, role: value }));

        // Limpar erro de validação
        if (validationErrors.role) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.role;
                return newErrors;
            });
        }
    };

    // Validar formulário
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'Nome é obrigatório';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Sobrenome é obrigatório';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email inválido';
        }

        if (!formData.role) {
            errors.role = 'Função é obrigatória';
        }

        // Validação de senha apenas para criação ou se estiver alterando a senha
        if (formData.role === 'ADMIN' || formData.role === 'MANAGER') {
            if (!isEditMode && !formData.password) {
                errors.password = 'Senha é obrigatória';
            } else if (formData.password && formData.password.length < 6) {
                errors.password = 'A senha deve ter pelo menos 6 caracteres';
            }

            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'As senhas não correspondem';
            }
        }

        setValidationErrors(errors);
        const isValid = Object.keys(errors).length === 0;
        console.log('Validação do formulário:', isValid);
        return isValid;
    };

    // Enviar formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Fundamental para impedir o comportamento padrão do form
        console.log("Formulário submetido", formData);

        if (!validateForm()) return;

        setIsSaving(true);
        setError(null);

        try {
            // Obter token da sessão
            const token = session?.token || ''; // Ajuste conforme sua implementação do NextAuth

            if (isEditMode && employeeId) {
                // Código de atualização...
            } else {
                // Criar novo funcionário
                const createData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    role: formData.role as "ADMIN" | "MANAGER" | "ATTENDANT",
                    unitId: unitId,
                    password: formData.role === 'ADMIN' || formData.role === 'MANAGER'
                        ? formData.password
                        : ""
                };

                console.log('Enviando dados:', createData);

                // Fazer requisição para a API
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/employee/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Use o token da sessão
                    },
                    body: JSON.stringify(createData)
                });

                console.log('Status da resposta:', response.status); // Debugging

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao criar funcionário");
                }

                const data = await response.json();
                console.log('Resposta:', data); // Debugging

                toast({
                    title: "Sucesso",
                    description: "Funcionário criado com sucesso."
                });

                // Redirecionar para a lista após salvar
                router.push(`/admin/units/${unitId}/employees`);
            }
        } catch (error: any) {
            console.error('Erro ao salvar funcionário:', error);
            setError(error.message || 'Ocorreu um erro ao salvar o funcionário.');
            toast({
                title: "Erro",
                description: error.message || "Não foi possível salvar o funcionário.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Voltar para a lista
    const goBack = () => {
        router.push(`/admin/units/${unitId}/employees`);
    };

    // Renderizar skeleton de carregamento
    if (isEditMode && isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-64"></div>
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>

                    <div>
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>

                    <div>
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={goBack}
                    className="flex items-center gap-2 pl-0 hover:pl-2"
                >
                    <ArrowLeft size={18} />
                    <span>Voltar para lista</span>
                </Button>
                <h1 className="text-2xl font-bold text-primary">
                    {isEditMode ? 'Editar Funcionário' : 'Novo Funcionário'}
                </h1>
            </div>

            {error && (
                <Card className="bg-red-50 border-red-100 mb-6">
                    <CardContent className="p-4 text-red-800">
                        <p>{error}</p>
                    </CardContent>
                </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Nome <span className="text-red-500">*</span></Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Nome"
                            className={validationErrors.firstName ? "border-red-500" : ""}
                        />
                        {validationErrors.firstName && (
                            <p className="text-red-500 text-sm">{validationErrors.firstName}</p>
                        )}
                    </div>

                    {/* Sobrenome */}
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Sobrenome <span className="text-red-500">*</span></Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Sobrenome"
                            className={validationErrors.lastName ? "border-red-500" : ""}
                        />
                        {validationErrors.lastName && (
                            <p className="text-red-500 text-sm">{validationErrors.lastName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className={validationErrors.email ? "border-red-500" : ""}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm">{validationErrors.email}</p>
                        )}
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    {/* Função */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Função <span className="text-red-500">*</span></Label>
                        <Select
                            value={formData.role}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger
                                id="role"
                                className={validationErrors.role ? "border-red-500" : ""}
                            >
                                <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="ADMIN">Administrador</SelectItem>
                                    <SelectItem value="MANAGER">Gerente</SelectItem>
                                    <SelectItem value="ATTENDANT">Atendente</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {validationErrors.role && (
                            <p className="text-red-500 text-sm">{validationErrors.role}</p>
                        )}
                    </div>
                </div>

                {/* Senha e Confirmação de Senha - Apenas para ADMIN e MANAGER */}
                {(formData.role === 'ADMIN' || formData.role === 'MANAGER') && (
                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-lg font-medium mb-4">
                            {isEditMode ? 'Alterar Senha (opcional)' : 'Definir Senha'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Senha {!isEditMode && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder={isEditMode ? "Deixe em branco para manter a atual" : "Senha"}
                                    className={validationErrors.password ? "border-red-500" : ""}
                                />
                                {validationErrors.password && (
                                    <p className="text-red-500 text-sm">{validationErrors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirmar Senha {!isEditMode && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirmar senha"
                                    className={validationErrors.confirmPassword ? "border-red-500" : ""}
                                />
                                {validationErrors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{validationErrors.confirmPassword}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Botões */}
                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Salvando...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Salvar</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}