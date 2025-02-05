"use client"

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserLogin } from "../pages/login/actions";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type User = 'user' | 'guest';

interface LoginFormProps {
    userType: User;
}

export default function LoginForm({ userType }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpf, setCpf] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [error, setError] = useState("");
    const { pending } = useFormStatus();

    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleUserLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Credenciais inválidas.");
            }

            const data = await response.json();
            router.push(data.redirectRoute); // Redireciona o usuário
        } catch (error) {
            setError("Erro no login. Verifique suas credenciais.");
            console.error("Erro no login:", error);
        }
    };

    const handleGuestLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/guest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cpf, email: guestEmail }),
            });

            if (!response.ok) {
                throw new Error("Erro no login de convidado.");
            }

            const data = await response.json();
            router.push(data.redirectRoute); // Redireciona o convidado
        } catch (error) {
            setError("Erro no login de convidado. Verifique seus dados.");
            console.error("Erro no login de convidado:", error);
        }
    };

    return (
        <div>
            {userType === "guest" ? (
                <form onSubmit={handleGuestLogin} id={`login-form-${userType}`} >
                    <div className="flex flex-col w-80 h-auto py-4 justify-center">
                        <div className="flex flex-col gap-6 w-full h-auto justify-center">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    placeholder="Digite seu CPF"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="guest-email">Email</Label>
                                <Input
                                    type="email"
                                    id="guest-email"
                                    name="email"
                                    placeholder="Digite seu e-mail"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-80 h-auto justify-between items-center py-4">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => router.push('/restaurant/register')}
                        >
                            Criar uma conta
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={pending}
                            aria-disabled={pending}
                        >
                            {pending ? "Entrando..." : "Entrar"}
                            <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleUserLogin} id={`login-form-${userType}`}>
                    <div className="flex flex-col w-80 h-auto py-4 justify-center">
                        <div className="flex flex-col gap-6 w-full h-auto justify-center">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="user-email">E-mail</Label>
                                <Input
                                    type="email"
                                    id="user-email"
                                    name="email"
                                    placeholder="Digite seu e-mail"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Digite sua senha"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-80 h-auto justify-between items-center py-4">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => router.push('/restaurant/register')}
                        >
                            Criar uma conta
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={pending}
                            aria-disabled={pending}
                        >
                            {pending ? "Entrando..." : "Entrar"}
                            <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}