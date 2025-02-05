import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface formTwoProps {
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
}

export default function RestaurantUnitFormTwo({
    cep,
    complement,
    number,
    street
}: formTwoProps) {
    return (
        <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                    type="text"
                    name="cep"
                    placeholder="Nome do responsável legal"
                    value={cep}
                />
            </div>
            <div className="flex flex-row justify-between w-full gap-2">
                <div className="flex flex-col gap-2 w-3/4">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                        type="text"
                        name="street"
                        placeholder="Digite o nome da rua"
                        value={street}
                    />
                </div>
                <div className="flex flex-col gap-2 w-1/3">
                    <Label htmlFor="number">Número</Label>
                    <Input
                        type="text"
                        name="number"
                        placeholder="Número"
                        value={number}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                    type="text"
                    name="complement"
                    placeholder="Ex.: Vizinho ao prédio verde com preto."
                    value={complement}
                />
            </div>
        </form>
    );
}