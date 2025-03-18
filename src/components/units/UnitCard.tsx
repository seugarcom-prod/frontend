import { Checkbox } from "@/components/ui/checkbox";
import { Ban, Flame, SquareX } from "lucide-react";

// Define o tipo para status da unidade
export type UnitStatus = "active" | "outOfHours" | "inactive";

// Interface do componente
export interface UnitCardProps {
  id: string;
  name: string;
  manager: string;
  cnpj: string;
  status: UnitStatus;
  isTopSeller?: boolean;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}

export default function UnitCard({
  id,
  name,
  manager,
  cnpj,
  status,
  isTopSeller = false,
  isSelected,
  onToggleSelection
}: UnitCardProps) {

  // Renderiza o indicador de status apropriado baseado no tipo de status
  const renderStatusIndicator = () => {
    switch (status) {
      case "active":
        if (isTopSeller) {
          return (
            <div className="flex items-center gap-2 text-amber-500 text-sm">
              <Flame />
              <span>Número #1 em vendas no mês</span>
            </div>
          );
        }
        return null;

      case "outOfHours":
        return (
          <div className="flex items-center gap-2 text-red-500 text-sm my-1">
            <SquareX />
            <span>Unidade fora do horário de funcionamento</span>
          </div>
        );

      case "inactive":
        return (
          <div className="flex items-center gap-2 text-gray-400 text-sm my-1">
            <Ban size={20} />
            <span>Unidade desativada</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border border-border rounded-lg shadow-md overflow-hidden bg-background">
      <div className="flex">
        <div className="p-4 flex-1">
          {renderStatusIndicator()}

          <div className="flex flex-row justify-between border-b border-border">
            <h3 className="font-medium mt-1 text-primary">{name}</h3>
            <div className="p-4 flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelection(id)}
                className="h-5 w-5 rounded-none data-[state=checked]:bg-primary data-[state=checked]:border-border border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2 pt-2">
            <div className="gap-2">
              <p className="text-gray-500 text-sm">Gerente responsável</p>
              <p className="text-primary text-sm">{manager}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">CNPJ</p>
              <p className="text-primary text-sm">{cnpj}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}