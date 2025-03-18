"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface AdminCredentialsFormProps {
    formData: {
        email: string;
        password: string;
        confirmPassword: string;
    };
    updateFormData: (data: Partial<{
        email: string;
        password: string;
        confirmPassword: string;
    }>) => void;
}

export default function AdminCredentialsForm({ formData, updateFormData }: AdminCredentialsFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validação básica para o email
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Validação básica para a senha
    const validatePassword = (password: string) => {
        return password.length >= 6;
    };

    // Validação para confirmar senha
    const validateConfirmPassword = () => {
        return formData.password === formData.confirmPassword;
    };

    // Estados para exibir mensagens de erro
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Handlers de validação
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        updateFormData({ email });

        if (email && !validateEmail(email)) {
            setEmailError('Digite um email válido');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        updateFormData({ password });

        if (password && !validatePassword(password)) {
            setPasswordError('A senha deve ter pelo menos 6 caracteres');
        } else {
            setPasswordError('');
        }

        // Validar também a confirmação da senha se já tiver sido preenchida
        if (formData.confirmPassword && password !== formData.confirmPassword) {
            setConfirmPasswordError('As senhas não conferem');
        } else if (formData.confirmPassword) {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPassword = e.target.value;
        updateFormData({ confirmPassword });

        if (confirmPassword && formData.password !== confirmPassword) {
            setConfirmPasswordError('As senhas não conferem');
        } else {
            setConfirmPasswordError('');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-1">Informações de acesso</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Informe os dados para acessar sua loja em nossa plataforma.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <Label htmlFor="email" className="block mb-2">
                        E-mail
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleEmailChange}
                        placeholder="Digite seu melhor e-mail"
                        className={`w-full ${emailError ? 'border-red-500' : ''}`}
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>

                <div className="relative">
                    <Label htmlFor="password" className="block mb-2">
                        Senha
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handlePasswordChange}
                            placeholder="Digite sua senha de acesso"
                            className={`w-full pr-10 ${passwordError ? 'border-red-500' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>

                <div className="relative">
                    <Label htmlFor="confirmPassword" className="block mb-2">
                        Confirme sua senha
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Repita sua senha de acesso"
                            className={`w-full pr-10 ${confirmPasswordError ? 'border-red-500' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showConfirmPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
                </div>
            </div>
        </div>
    );
}