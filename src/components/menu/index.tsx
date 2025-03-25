'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DoorOpen, LogOut, ShoppingCart } from 'lucide-react';
import { IProduct, addToCart, getCartItems, calculateCartTotal, formatCurrency } from '@/services/restaurant/services';
import ProductCard from '@/components/products/ProductCard';
import { Label } from 'recharts';

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
  const router = useRouter();

  // Estados
  const [products] = useState<IProduct[]>(initialProducts);
  const [categories] = useState<string[]>(initialCategories);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ productId: string, quantity: number }[]>([]);
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  // Inicializar sem categoria ativa (mostra todos)
  useEffect(() => {
    // Verificar número da mesa no localStorage
    const tableNum = localStorage.getItem(`table-${restaurantId}`);
    setTableNumber(tableNum);

    // Carregar carrinho do localStorage
    const savedCart = getCartItems(restaurantId);
    setCart(savedCart);
  }, [restaurantId]);

  // Filtrar produtos pelo termo de busca e categoria (se selecionada)
  const filteredProducts = products.filter(product =>
    (product.isAvailable) &&
    (!activeCategory || product.category === activeCategory) &&
    (!searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Função para atualizar a quantidade de um produto no carrinho
  const handleQuantityChange = (productId: string, quantity: number) => {
    const updatedCart = addToCart(restaurantId, productId, quantity);
    setCart(updatedCart);
  };

  // Obter a quantidade atual de um produto no carrinho
  const getProductQuantity = (productId: string): number => {
    const cartItem = cart.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Calcular total do carrinho
  const cartTotal = calculateCartTotal(restaurantId, products);

  // Ir para a página do carrinho
  const goToCart = () => {
    router.push(`/restaurant/${restaurantId}/cart`);
  };

  // Sair do Menu
  const leaveMenu = () => {
    router.push('/');
  };

  // Organizar produtos por categoria
  const getProductsByCategory = () => {
    if (activeCategory) {
      // Se uma categoria estiver selecionada, retornamos apenas ela
      const products = filteredProducts.filter(product => product.category === activeCategory);
      return products.length > 0 ? [{ category: activeCategory, products }] : [];
    } else {
      // Se nenhuma categoria estiver selecionada, agrupamos produtos por categoria
      const groupedProducts = categories.map(category => {
        const products = filteredProducts.filter(product => product.category === category);
        return { category, products };
      });

      // Filtramos categorias vazias (sem produtos)
      return groupedProducts.filter(group => group.products.length > 0);
    }
  };

  // Produtos organizados por categoria
  const productsByCategory = getProductsByCategory();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header com informações do restaurante/mesa */}
      <div className="flex flex-row mb-6 justify-between h-12">
        <div className='w-1/2'>
          <h1 className="text-2xl font-bold">{restaurantName}</h1>
          {tableNumber && (
            <p className="text-sm text-gray-600">Mesa {tableNumber}</p>
          )}
        </div>
        <div className='flex items-center justify-center'>
          <Button
            variant="ghost"
            onClick={leaveMenu}
            className='[&_svg]:size-7 [&_svg]:cursor-pointer'
          >
            <LogOut />
          </Button>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Categorias */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-6">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          onClick={() => setActiveCategory(null)}
          className="whitespace-nowrap"
        >
          Ver todos
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Lista de produtos agrupados por categoria */}
      <div className="space-y-8 mb-24">
        {productsByCategory.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          </div>
        ) : (
          productsByCategory.map(group => (
            <div key={group.category}>
              {/* Título da categoria */}
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{group.category}</h2>

              {/* Grade de produtos desta categoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    quantity={getProductQuantity(product._id)}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botão do carrinho fixo no rodapé */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <Button
            onClick={goToCart}
            className="w-full h-14 flex justify-between items-center"
          >
            <div className="flex items-center">
              <ShoppingCart className="mr-2" />
              <span>Ver Carrinho</span>
            </div>
            <div className="flex items-center">
              <span className="bg-white text-primary rounded-full px-2 py-1 text-sm mr-2">
                {cart.reduce((total, item) => total + item.quantity, 0)} itens
              </span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}