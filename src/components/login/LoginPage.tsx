"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/../public/Logo.svg";
import { UserLogin, GuestLogin } from "./index";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = 'user' | 'guest';

interface LoginProps {
    userType?: User;
}

export function LoginPage({ userType = 'guest' }: LoginProps) {
    const redirect = useRouter();
    const [currentUserType, setCurrentUserType] = useState<User>(userType);

    const handleTabChange = (value: string) => {
        setCurrentUserType(value as User);
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-dark-primary-default">
            {/* Lado esquerdo - formulário de login */}
            <div className="w-full md:w-1/3 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-dark-primary-default border border-border rounded-md shadow-sm p-8">
                    <h1 className="text-xl text-dark-card-default font-medium mb-6">Entre na plataforma</h1>

                    <Tabs
                        defaultValue={currentUserType}
                        className="w-full mb-6"
                        onValueChange={handleTabChange}
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-transparent border border-border rounded-md items-center justify-center">
                            <TabsTrigger value="user" className="data-[state=active]:bg-secondary data-[state=active]:text-white">Usuário</TabsTrigger>
                            <TabsTrigger value="guest" className="data-[state=active]:bg-secondary data-[state=active]:text-white">Convidado</TabsTrigger>
                        </TabsList>

                        <TabsContent value="user" className="mt-4">
                            <div className="mb-6">
                                <UserLogin />
                            </div>
                        </TabsContent>

                        <TabsContent value="guest" className="mt-4">
                            <div className="mb-4">
                                <div className="relative">
                                    <GuestLogin />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="text-center mt-8">
                        <div className="flex items-center w-full my-4">
                            <div className="flex-grow border-t border-border"></div>
                            <span className="mx-4 text-sm text-gray-500">Não tem uma conta?</span>
                            <div className="flex-grow border-t border-border"></div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full py-2 mt-1 bg-gray-100 text-secondary rounded-md hover:bg-gray-200 hover:text-dark-primary-foreground hover:border-none"
                            onClick={() => redirect.push('/register/admin')}
                        >
                            Criar uma conta agora
                        </Button>
                    </div>
                </div>
            </div>

            {/* Lado direito - logo e fundo preto */}
            <div className="w-full md:w-2/3 bg-black flex flex-col items-center justify-center p-8">
                <div className="flex-1 flex items-center justify-center">
                    <Image
                        priority
                        src={Logo}
                        alt="SR. GARÇOM"
                        width={400}
                        height={120}
                    />
                </div>
                <div className="text-white text-center text-sm mt-auto">
                    <p>
                        Ao entrar você concorda com os <Link href="#" className="underline text-white">Termos de uso</Link> e as <Link href="#" className="underline text-white">Política de privacidade</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}