"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function UserLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const isMobile = useMediaQuery("(max-width: 768px)");

    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    // Define login mutation with React Query
    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Credenciais inválidas.");
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Store the session token (if needed)
            if (data.sessionToken) {
                localStorage.setItem("session", data.sessionToken);
            }

            // Redirect to appropriate route
            router.push(data.redirectRoute || "/admin");
        },
        onError: (error) => {
            setError(error instanceof Error ? error.message : "Erro no login. Verifique suas credenciais.");
            console.error("Erro no login:", error);
        }
    });

    const handleUserLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <form onSubmit={handleUserLogin} id="login-user" className="w-full">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="password" className={isMobile ? "sr-only" : "text-primary"}>Email</Label>
                    <Input
                        type="email"
                        id="user-email"
                        name="email"
                        placeholder="Digite seu e-mail"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 border border-border rounded-md text-primary"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="password" className={isMobile ? "sr-only" : "text-primary"}>Senha</Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Digite sua senha"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border border-border rounded-md text-primary"
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="flex justify-between items-center mt-6">
                <Button
                    type="submit"
                    variant="ghost"
                    onClick={() => router.push("/recover-password")}
                    className="text-sm text-dark-primary-foreground hover:underline hover:border-none"
                >
                    Esqueceu sua senha?
                </Button>
                <Button
                    type="submit"
                    className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-gray-800 inline-flex items-center"
                    disabled={loginMutation.isPending}
                    aria-disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    <ArrowRight className="ml-2" />
                </Button>
            </div>
        </form>
    );
}