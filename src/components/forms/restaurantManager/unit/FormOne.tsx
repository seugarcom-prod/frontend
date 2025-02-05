import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface formOneProps {
    cnpj?: string;
    socialName?: string;
    storeName?: string;
    phone?: string;
    specialty?: string;
}

export default function RestaurantUnitFormOne({ cnpj, socialName, phone, specialty, storeName }: formOneProps) {
    const category = [
        'Hambúrguer',
        'Pizza',
        'Árabe',
        'Sorvetes',
        'Confeitaria',
        'Massas'
    ]

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
                                    {category.map((item) => (
                                        <SelectItem key={item} value={`${specialty}-${item}`}>{item}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}