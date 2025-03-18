"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function GuestLogin() {
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    // Define guest login mutation with React Query
    const guestLoginMutation = useMutation({
        mutationFn: async (credentials: { cpf: string; email: string }) => {
            const response = await fetch(`${apiUrl}/guest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Erro no login de convidado.");
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Store the session token
            if (data.sessionToken) {
                localStorage.setItem("session", data.sessionToken);
            }

            // Redirect to appropriate route
            router.push(data.redirectRoute || "/admin");
        },
        onError: (error) => {
            setError(error instanceof Error ? error.message : "Erro no login de convidado. Verifique seus dados.");
            console.error("Erro no login de convidado:", error);
        }
    });

    const handleGuestLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        guestLoginMutation.mutate({ cpf, email });
    };

    // CPF mask function
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Remove caracteres não numéricos
        value = value.replace(/\D/g, '');

        // Aplica a máscara: XXX.XXX.XXX-XX
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }

        setCpf(value);
    };

    return (
        <form onSubmit={handleGuestLogin} id="login-guest" className="w-full">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="guest-cpf" className="text-gray-700">CPF</Label>
                    <Input
                        type="text"
                        id="guest-cpf"
                        name="cpf"
                        placeholder="Digite seu CPF"
                        required
                        value={cpf}
                        onChange={handleCpfChange}
                        maxLength={14}
                        className="p-3 border border-border rounded-md text-secondary"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="guest-email" className="text-gray-700">Email</Label>
                    <Input
                        type="email"
                        id="guest-email"
                        name="email"
                        placeholder="Digite seu e-mail"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 border border-border rounded-md text-secondary"
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="flex justify-end items-center mt-6">
                <Button
                    type="submit"
                    className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-gray-800 inline-flex items-center"
                    disabled={guestLoginMutation.isPending}
                    aria-disabled={guestLoginMutation.isPending}
                >
                    {guestLoginMutation.isPending ? "Entrando..." : "Entrar"}
                    <ArrowRight className="ml-2" />
                </Button>
            </div>
        </form>
    );
}