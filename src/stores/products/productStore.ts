// store/productStore.ts
import { create } from 'zustand';
import { Product } from './types';

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: (restaurantId: string) => Promise<void>;
    addProduct: (productData: Omit<Product, '_id'>) => Promise<Product>;
    updateProduct: (productId: string, productData: Partial<Product>) => Promise<Product>;
    deleteProduct: (productId: string) => Promise<void>;
    getProductById: (productId: string) => Product | undefined;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async (restaurantId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/restaurant/${restaurantId}/products`);

            if (!response.ok) {
                throw new Error(`Falha ao carregar produtos: ${response.statusText}`);
            }

            const data = await response.json();
            set({ products: data, isLoading: false });
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            set({
                error: err instanceof Error ? err.message : 'Erro desconhecido ao carregar produtos',
                isLoading: false
            });

            // Você pode remover este mock em produção
            set({
                products: [
                    {
                        _id: '1',
                        name: 'X-Burger',
                        price: 25.90,
                        description: 'Delicioso hambúrguer com queijo',
                        category: 'Hambúrgueres',
                        image: '/images/burger.jpg',
                        isAvailable: true,
                        quantity: 100,
                        restaurant: restaurantId
                    },
                    {
                        _id: '2',
                        name: 'X-Salada',
                        price: 27.90,
                        description: 'Hambúrguer com alface e tomate',
                        category: 'Hambúrgueres',
                        image: '/images/burger2.jpg',
                        isAvailable: true,
                        quantity: 100,
                        restaurant: restaurantId
                    },
                    {
                        _id: '3',
                        name: 'Batata Frita',
                        price: 12.90,
                        description: 'Porção de batatas fritas crocantes',
                        category: 'Acompanhamentos',
                        image: '/images/fries.jpg',
                        isAvailable: true,
                        quantity: 150,
                        restaurant: restaurantId
                    },
                    {
                        _id: '4',
                        name: 'Refrigerante Lata',
                        price: 6.00,
                        description: 'Lata 350ml',
                        category: 'Bebidas',
                        image: '/images/soda.jpg',
                        isAvailable: true,
                        quantity: 200,
                        restaurant: restaurantId
                    },
                ],
                isLoading: false
            });
        }
    },

    addProduct: async (productData) => {
        try {
            const response = await fetch(`/api/restaurant/${productData.restaurant}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error(`Falha ao adicionar produto: ${response.statusText}`);
            }

            const newProduct: Product = await response.json();

            set((state) => ({
                products: [...state.products, newProduct]
            }));

            return newProduct;
        } catch (err) {
            console.error('Erro ao adicionar produto:', err);
            // Simular adição para desenvolvimento
            const newProduct: Product = {
                _id: Date.now().toString(),
                ...productData,
            };

            set((state) => ({
                products: [...state.products, newProduct]
            }));

            return newProduct;
        }
    },

    updateProduct: async (productId, productData) => {
        try {
            // Encontrar o produto atual para obter o restaurantId
            const currentProduct = get().products.find(p => p._id === productId);

            if (!currentProduct) {
                throw new Error('Produto não encontrado');
            }

            const response = await fetch(`/api/restaurant/${currentProduct.restaurant}/products/${productId}/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error(`Falha ao atualizar produto: ${response.statusText}`);
            }

            const updatedProduct: Product = await response.json();

            set((state) => ({
                products: state.products.map(p =>
                    p._id === productId ? { ...p, ...updatedProduct } : p
                )
            }));

            return updatedProduct;
        } catch (err) {
            console.error('Erro ao atualizar produto:', err);

            // Simular atualização para desenvolvimento
            set((state) => ({
                products: state.products.map(p =>
                    p._id === productId ? { ...p, ...productData } : p
                )
            }));

            return { ...get().products.find(p => p._id === productId)!, ...productData };
        }
    },

    deleteProduct: async (productId) => {
        try {
            // Encontrar o produto atual para obter o restaurantId
            const currentProduct = get().products.find(p => p._id === productId);

            if (!currentProduct) {
                throw new Error('Produto não encontrado');
            }

            const response = await fetch(`/api/restaurant/${currentProduct.restaurant}/products/${productId}/delete`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Falha ao excluir produto: ${response.statusText}`);
            }

            set((state) => ({
                products: state.products.filter(p => p._id !== productId)
            }));
        } catch (err) {
            console.error('Erro ao excluir produto:', err);

            // Simular exclusão para desenvolvimento
            set((state) => ({
                products: state.products.filter(p => p._id !== productId)
            }));
        }
    },

    getProductById: (productId) => {
        return get().products.find(p => p._id === productId);
    }
}));