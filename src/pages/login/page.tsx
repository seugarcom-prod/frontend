"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "../../../public/Logo.svg";
import { Label } from "@/components/ui/label";
import LoginForm from "./LoginForm";

type User = 'user' | 'guest';

interface LoginProps {
    initialUserType?: User;
}

export default function Login({ initialUserType = 'guest' }: LoginProps) {
    const [currentUserType, setCurrentUserType] = useState<User>(initialUserType);

    const toggleLoginType = () => {
        setCurrentUserType(current => current === 'guest' ? 'user' : 'guest');
    }

    return (
        <div className="max-w-full h-screen flex flex-col justify-center items-center">
            <div className="flex flex-col w-full justify-center items-center">
                <Card className="mb-8">
                    <CardContent className="p-6 justify-center items-center">
                        <Image
                            priority
                            src={Logo}
                            alt="Seja bem vindo ao Seu Garçom!"
                            width={320}
                        />
                    </CardContent>
                </Card>
                <div className="flex flex-col w-80 h-auto py-4 justify-start items-start">
                    <h1 className="text-2xl">Entre na plataforma</h1>
                </div>
                <div className="flex flex-row py-2 gap-4 justify-between items-center">
                    <Label className="text-md">{currentUserType === 'guest' ? 'Possui cadastro' : 'Não tenho cadastro'}</Label>
                    <Button
                        onClick={toggleLoginType}
                        type="button"
                    >
                        {currentUserType === 'guest' ? 'Entrar como usuário' : 'Entrar como convidado'}
                    </Button>
                </div>
                <LoginForm key={currentUserType} userType={currentUserType} />
            </div>
        </div>
    );
}