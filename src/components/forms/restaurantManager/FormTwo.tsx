import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface formTwoProps {
    cnpj?: string;
    socialName?: string;
    storeName?: string;
    phone?: string;
    specialty?: string;
}

export default function RestaurantManagerFormTwo({
    cnpj,
    phone,
    socialName,
    specialty,
    storeName
}: formTwoProps) {
    return (
        <form>
            <div className="flex flex-col w-80 justify-center">
                <div className="flex flex-col gap-6 w-full justify-center">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                                type="text"
                                name="cnpj"
                                placeholder="00.000.000/0000-00"
                                value={cnpj}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="socialName">Razão social</Label>
                            <Input
                                type="text"
                                name="cpf"
                                placeholder="Informe a razão social da loja"
                                value={socialName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="storeName">Nome da loja</Label>
                            <Input
                                type="text"
                                name="storeName"
                                placeholder="Exemplo: Sram Honesto Burger"
                                value={storeName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone">Telefone ou celular</Label>
                            <Input
                                type="text"
                                name="phone"
                                placeholder="Número de telefone ou celular da loja"
                                value={phone}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="specialty">Especialidade</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Escolha a especialidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="burgers">Hambúrguer</SelectItem>
                                    <SelectItem value="brazilian">Culinária brasileira</SelectItem>
                                    <SelectItem value="pizza">Pizza</SelectItem>
                                    <SelectItem value="italian">Culinária italiana</SelectItem>
                                    <SelectItem value="japanese">Culinária japonesa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}