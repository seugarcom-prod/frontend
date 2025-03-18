import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
    onQuantityChange: (id: string, quantity: number) => void;
}

export default function ProductCard({
    id,
    name,
    description,
    price,
    imageUrl,
    quantity = 0,
    onQuantityChange
}: ProductCardProps) {
    const handleIncrement = () => {
        onQuantityChange(id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            onQuantityChange(id, quantity - 1);
        }
    };

    // Formata o preço para o formato de moeda brasileira
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);

    return (
        <div className="border border-border rounded-lg shadow-md overflow-hidden bg-background mb-4">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-48">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 flex-1">
                    <h3 className="font-medium text-primary text-lg">{name}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{description}</p>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-primary font-medium">{formattedPrice}</span>

                        <div className="flex items-center">
                            {quantity > 0 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full border border-border"
                                        onClick={handleDecrement}
                                    >
                                        <Minus size={16} />
                                    </Button>
                                    <span className="mx-3 text-primary">{quantity}</span>
                                </>
                            )}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border border-border bg-primary text-secondary hover:bg-primary-foreground"
                                onClick={handleIncrement}
                            >
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}