"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

interface UserLoginProps {
    onLoginSuccess?: () => void;
}

export function UserLogin({ onLoginSuccess }: UserLoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: login, isPending: isLoading, error } = useLogin();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        login(
            { email, password },
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
        <form onSubmit={handleLogin}>
            <div className="space-y-4">
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

                <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </div>

                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error instanceof Error ? error.message : "Erro ao fazer login"}
                    </div>
                )}
                <div className="flex items-center justify-between py-4">
                    <a
                        href="#"
                        className="text-sm text-primary hover:underline"
                    >
                        Esqueceu sua senha?
                    </a>
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