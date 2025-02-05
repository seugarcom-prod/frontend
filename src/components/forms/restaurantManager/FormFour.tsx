import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface formFourProps {
    email?: string;
    password?: string;
}

export default function RestaurantManagerFormFour({ email, password }: formFourProps) {

    return (
        <form>
            <div className="flex flex-col w-80 py-4 justify-center">
                <div className="flex flex-col gap-6 w-full justify-center">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="fullName">E-mail</Label>
                            <Input
                                type="text"
                                name="email"
                                placeholder="Digite seu melhor e-mail"
                                value={email}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="CPF">Senha</Label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Digite sua senha de acesso"
                                value={password}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="CPF">Confirme sua senha</Label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Repita sua senha de acesso"
                                value={password}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}