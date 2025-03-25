"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGuestLogin } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";
import { formatCpf } from "@/utils";
import { isValidCPF } from "@/utils/CpfValidate";

interface GuestLoginProps {
    onLoginSuccess?: () => void;
}

export function GuestLogin({ onLoginSuccess }: GuestLoginProps) {
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");

    const { mutate: guestLogin, isPending: isLoading, error } = useGuestLogin();

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCPF = formatCpf(e.target.value);
        setCpf(formattedCPF);
    };


    const handleGuestLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar CPF
        if (!isValidCPF(cpf)) {
            alert("CPF inválido");
            return;
        }

        // Validar email
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Email inválido");
            return;
        }

        guestLogin(
            { cpf, email },
            {
                onSuccess: () => {
                    if (onLoginSuccess) {
                        onLoginSuccess();
                    }
                }
            }
        );
    };

    return (
        <form onSubmit={handleGuestLogin}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                        id="cpf"
                        placeholder="Digite seu CPF"
                        required
                        value={cpf}
                        onChange={handleCPFChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error instanceof Error ? error.message : "Erro ao fazer login como convidado"}
                    </div>
                )}

                <div className="flex items-center justify-between py-4">
                    <div />
                    <Button
                        type="submit"
                        className="w-36 bg-primary text-secondary hover:bg-gray-300 hover:text-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </form>
    );
}