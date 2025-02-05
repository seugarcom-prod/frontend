import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface formOneProps {
    cpf?: string;
    fullName?: string;
}

export default function RestaurantManagerFormOne({ cpf, fullName }: formOneProps) {

    return (
        <form>
            <div className="flex flex-col w-80 py-4 justify-center">
                <div className="flex flex-col gap-6 w-full justify-center">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="fullName">Nome completo</Label>
                            <Input
                                type="text"
                                name="fullName"
                                placeholder="Nome do responsável legal"
                                value={fullName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="CPF">CPF</Label>
                            <Input
                                type="text"
                                name="cpf"
                                placeholder="Digite o CPF do responsável"
                                value={cpf}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}