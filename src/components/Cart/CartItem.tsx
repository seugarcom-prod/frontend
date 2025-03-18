import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CartItemProps {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    onQuantityChange: (id: string, quantity: number) => void;
}

export default function CartItem({
    id,
    name,
    imageUrl,
    price,
    quantity,
    onQuantityChange
}: CartItemProps) {
    // Formata o preço unitário para o formato de moeda brasileira
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);

    // Formata o preço total para o formato de moeda brasileira
    const formattedTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price * quantity);

    const handleIncrement = () => {
        onQuantityChange(id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            onQuantityChange(id, quantity - 1);
        }
    };

    const handleRemove = () => {
        onQuantityChange(id, 0);
    };

    return (
        <div className="border-b border-border py-4">
            <div className="flex gap-4">
                <div className="w-20 h-20 rounded-md overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <h3 className="font-medium text-primary">{name}</h3>
                        <span className="text-primary font-medium">{formattedTotal}</span>
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                        {formattedPrice} cada
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border border-border"
                                onClick={handleDecrement}
                            >
                                <Minus size={16} />
                            </Button>
                            <span className="mx-2 text-primary">{quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border border-border"
                                onClick={handleIncrement}
                            >
                                <Plus size={16} />
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={handleRemove}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}