'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { IProduct, CartItem } from '@/services/restaurant/types';

interface MenuClientProps {
  restaurantName: string;
  restaurantId: string;
  initialProducts: IProduct[];
  initialCategories: string[];
}

export default function MenuClient({
  restaurantName,
  restaurantId,
  initialProducts,
  initialCategories
}: MenuClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products] = useState<IProduct[]>(initialProducts);
  const [categories] = useState<string[]>(initialCategories);

  // Inicializar categoria ativa
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${restaurantName}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [restaurantName]);

  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem(`cart-${restaurantName}`, JSON.stringify(cart));
  }, [cart, restaurantName]);

  // Filtrar produtos por categoria e termo de busca
  const filteredProducts = products.filter(product => {
    const matchesCategory = !activeCategory || product.category === activeCategory;
    const matchesSearch = !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch && product.isAvailable !== false;
  });

  // Função para atualizar o carrinho quando a quantidade de um produto muda
  const handleQuantityChange = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === productId);

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        if (quantity === 0) {
          updatedCart.splice(existingItemIndex, 1);
        } else {
          updatedCart[existingItemIndex].quantity = quantity;
        }
        return updatedCart;
      } else if (quantity > 0) {
        return [...prevCart, { productId, quantity }];
      }

      return prevCart;
    });
  };

  // Quantidade total de itens no carrinho
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Valor total do pedido
  const totalValue = cart.reduce((sum, item) => {
    const product = products.find(p => p._id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  // Formata o valor total para o formato de moeda brasileira
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalValue);

  // Função para navegar para a página do carrinho
  const goToCart = () => {
    router.push(`/${restaurantName}/cart`);
  };

  // Obter a quantidade atual de um produto no carrinho
  const getProductQuantity = (productId: string): number => {
    const cartItem = cart.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <>
      {/* Barra de pesquisa */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar produtos..."
          className="w-full h-10 border-border rounded-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categorias */}
      <div className="flex overflow-x-auto mb-6 pb-2 gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`rounded-full px-4 py-2 whitespace-nowrap ${activeCategory === category
              ? "bg-primary text-secondary"
              : "bg-background text-primary border-border"
              }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Lista de produtos */}
      <div className="space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.image || "/api/placeholder/400/320"}
              quantity={(getProductQuantity(product._id))}
              onQuantityChange={handleQuantityChange}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        )}
      </div>

      {/* Botão de carrinho - fixo na parte inferior */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <Button
            onClick={goToCart}
            variant="default"
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-secondary shadow-lg"
          >
            <ShoppingCart size={20} />
            <span>Ver pedido • {totalItems} {totalItems === 1 ? 'item' : 'itens'} • {formattedTotal}</span>
          </Button>
        </div>
      )}
    </>
  );
}