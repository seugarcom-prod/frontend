// components/products/ProductCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { IProduct } from '@/services/restaurant/services';

interface ProductCardProps {
    product: IProduct;
    quantity: number;
    onQuantityChange: (productId: string, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onQuantityChange }) => {
    // Função para aumentar a quantidade
    const increaseQuantity = () => {
        onQuantityChange(product._id, quantity + 1);
    };

    // Função para diminuir a quantidade
    const decreaseQuantity = () => {
        if (quantity > 0) {
            onQuantityChange(product._id, quantity - 1);
        }
    };

    // Formatar preço
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <Card className="overflow-hidden h-full flex flex-col border border-gray-300 shadow-md">
            {product.image && (
                <div className="relative h-24 w-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            )}

            <CardContent className="p-4 flex-grow flex flex-col">
                <div className="mb-2 flex-grow">
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                </div>

                <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold">{formatPrice(product.price)}</span>

                    <div className="flex items-center">
                        {quantity > 0 ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={decreaseQuantity}
                                >
                                    <Minus size={14} />
                                </Button>

                                <span className="mx-2 w-6 text-center">{quantity}</span>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={increaseQuantity}
                                >
                                    <Plus size={14} />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={increaseQuantity}
                            >
                                Adicionar
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;