'use client';

import React, { useState, useEffect } from 'react';
import {
  IProduct,
  addToCart,
  formatCurrency
} from '@/services/restaurant/services';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface MenuClientProps {
  restaurantId: string;
  restaurantName: string;
  initialProducts: IProduct[];
  initialCategories: string[];
}

export default function MenuClient({
  restaurantId,
  restaurantName,
  initialProducts,
  initialCategories
}: MenuClientProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    console.log('MenuClient - Produtos:', products);
    console.log('MenuClient - Categorias:', categories);
  }, [products, categories]);

  // Função para adicionar item ao carrinho
  const handleAddToCart = (productId: string) => {
    const updatedProducts = products.map(product =>
      product._id === productId
        ? { ...product, quantity: (product.quantity || 0) + 1 }
        : product
    );
    setProducts(updatedProducts);

    // Adicionar ao carrinho no localStorage
    addToCart(restaurantName, productId, (products.find(p => p._id === productId)?.quantity || 0) + 1);
  };

  // Função para remover item do carrinho
  const handleRemoveFromCart = (productId: string) => {
    const currentProduct = products.find(p => p._id === productId);
    if (currentProduct && (currentProduct.quantity || 0) > 0) {
      const updatedProducts = products.map(product =>
        product._id === productId
          ? { ...product, quantity: Math.max(0, (product.quantity || 0) - 1) }
          : product
      );
      setProducts(updatedProducts);

      // Atualizar carrinho no localStorage
      addToCart(restaurantName, productId, Math.max(0, (currentProduct.quantity || 0) - 1));
    }
  };

  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Cardápio - {restaurantName}</h1>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow-sm flex flex-col"
          >
            <div className="flex-grow">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="font-semibold text-primary mb-2">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* Controles de Quantidade */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveFromCart(product._id)}
                  disabled={(product.quantity || 0) <= 0}
                >
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center">
                  {product.quantity || 0}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleAddToCart(product._id)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${product.isAvailable
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                  }`}
              >
                {product.isAvailable ? 'Disponível' : 'Indisponível'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}