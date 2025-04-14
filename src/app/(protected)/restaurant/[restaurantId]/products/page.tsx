// app/restaurant/[restaurantId]/products/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    ChevronLeft,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    ArrowDownUp,
    Search,
    FileText,
    Info,
} from 'lucide-react';
import Header from '@/components/header/Header';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/dashboard/SideMenu';

// Defina a interface Product aqui para evitar dependências extras
interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    category: string;
    image?: string;
    isAvailable: boolean;
    quantity: number;
    restaurant: string;
}

const ProductManagementPage = () => {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession();
    const restaurantId = params.restaurantId as string;

    // Estado para produtos
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para UI
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [actionMenuVisible, setActionMenuVisible] = useState<string | null>(null);

    const { isOpen } = useSidebar();

    // Form state para produto
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: '',
        quantity: 1,
        isAvailable: true
    });

    // Verificação de autenticação
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [status, router]);

    // Verificação de permissão
    useEffect(() => {
        if (status === "authenticated") {
            if (session?.user?.role !== "ADMIN" && session?.user?.role !== "MANAGER") {
                router.push(`/restaurant/${restaurantId}/menu`);
            }
        }
    }, [session, status, router, restaurantId]);

    // Carregar produtos
    useEffect(() => {
        if (status === "authenticated" && restaurantId) {
            fetchProducts();
        }
    }, [status, restaurantId]);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/restaurant/${restaurantId}/products`);

            if (!response.ok) {
                throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar produtos');

            // Mock data para desenvolvimento
            setProducts([
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
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData({
                ...formData,
                [name]: checkbox.checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleAddProduct = async () => {
        // Implementação simplificada para teste
        try {
            const newProduct = {
                _id: Date.now().toString(),
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                image: formData.image,
                quantity: formData.quantity,
                isAvailable: formData.isAvailable,
                restaurant: restaurantId
            };

            setProducts([...products, newProduct]);
            setShowAddModal(false);
            setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
                image: '',
                quantity: 1,
                isAvailable: true
            });
        } catch (err) {
            alert('Erro ao adicionar produto: ' + (err instanceof Error ? err.message : String(err)));
        }
    };

    const handleEditProduct = async () => {
        if (!currentProduct) return;

        try {
            const updatedProducts = products.map(p =>
                p._id === currentProduct._id
                    ? {
                        ...p,
                        name: formData.name,
                        price: parseFloat(formData.price),
                        description: formData.description,
                        category: formData.category,
                        image: formData.image,
                        quantity: formData.quantity,
                        isAvailable: formData.isAvailable
                    }
                    : p
            );

            setProducts(updatedProducts);
            setShowEditModal(false);
            setCurrentProduct(null);
        } catch (err) {
            alert('Erro ao atualizar produto: ' + (err instanceof Error ? err.message : String(err)));
        }
    };

    const handleDeleteProduct = async () => {
        if (!currentProduct) return;

        try {
            const updatedProducts = products.filter(p => p._id !== currentProduct._id);
            setProducts(updatedProducts);
            setShowDeleteModal(false);
            setCurrentProduct(null);
        } catch (err) {
            alert('Erro ao excluir produto: ' + (err instanceof Error ? err.message : String(err)));
        }
    };

    const openEditModal = (product: Product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            category: product.category,
            image: product.image || '',
            quantity: product.quantity,
            isAvailable: product.isAvailable
        });
        setShowEditModal(true);
        setActionMenuVisible(null);
    };

    const openDeleteModal = (product: Product) => {
        setCurrentProduct(product);
        setShowDeleteModal(true);
        setActionMenuVisible(null);
    };

    const toggleActionMenu = (productId: string) => {
        setActionMenuVisible(actionMenuVisible === productId ? null : productId);
    };

    // Lista de categorias
    const categories = ['Todos', ...Array.from(new Set(products.map(product => product.category)))];

    // Filtrar produtos por termo de busca e categoria
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Ordenar produtos
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="p-4 flex flex-col h-screen">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 mr-4"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">Carregando produtos...</h1>
                </div>
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (error && products.length === 0) {
        return (
            <div className="p-4 flex flex-col h-screen">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 mr-4"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">Produtos</h1>
                </div>
                <div className="bg-red-100 text-red-600 p-4 rounded-md">
                    <p>Erro ao carregar produtos: {error}</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col static h-screen bg-background w-dvw">
            <Header />
            <div className={cn("flex flex-col w-full transition-all duration-300", isOpen ? "ml-64" : "ml-0")}>
                <Sidebar />

                <div className="flex items-center justify-start px-8 py-4">
                    <h1 className="text-2xl font-bold">Produtos</h1>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col items-center justify-center p-8 md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            className="pl-10 pr-4 py-2 border rounded-md w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            className="border rounded-md px-4 py-2"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <button
                            className="border rounded-md px-3 py-2"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            <ArrowDownUp size={18} />
                        </button>

                        <button
                            className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={18} className="mr-1" />
                            <span>Adicionar</span>
                        </button>

                        <Link
                            href={`/restaurant/${restaurantId}/products/import`}
                            className="bg-green-600 text-white rounded-md px-4 py-2 flex items-center"
                        >
                            <FileText size={18} className="mr-1" />
                            <span>Importar</span>
                        </Link>
                    </div>
                </div>

                {/* Products List */}
                <div className="flex-1 overflow-y-auto items-center justify-center px-8 gap-2">
                    {sortedProducts.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">
                            <p>Nenhum produto encontrado.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="border rounded-lg p-4 bg-white flex justify-between items-center relative"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden relative">
                                            {product.image ? (
                                                <div className="h-full w-full bg-gray-200">
                                                    {/* Substituímos Image por um placeholder para simplicidade */}
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                        Imagem
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    Sem imagem
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-medium">{product.name}</h3>
                                            <p className="text-gray-600 text-sm">{product.category}</p>
                                            <p className="text-blue-600 font-medium">{formatCurrency(product.price)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.isAvailable ? 'Disponível' : 'Indisponível'}
                                        </span>

                                        <div className="relative ml-2">
                                            <button
                                                onClick={() => toggleActionMenu(product._id)}
                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                            >
                                                <MoreVertical size={16} />
                                            </button>

                                            {actionMenuVisible === product._id && (
                                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                                                    <div className="py-1">
                                                        <Link
                                                            href={`/restaurant/${restaurantId}/products/${product._id}`}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <Info size={16} className="mr-2" />
                                                            Ver detalhes
                                                        </Link>
                                                        <button
                                                            onClick={() => openEditModal(product)}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <Edit size={16} className="mr-2" />
                                                            Editar produto
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(product)}
                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <Trash2 size={16} className="mr-2" />
                                                            Excluir produto
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Product Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Adicionar Produto</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isAvailable"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">Disponível para venda</label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border rounded-md"
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddProduct}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                    type="button"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Product Modal */}
                {showEditModal && currentProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Editar Produto</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="edit-isAvailable"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label htmlFor="edit-isAvailable" className="ml-2 text-sm text-gray-700">Disponível para venda</label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border rounded-md"
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleEditProduct}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                    type="button"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && currentProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Confirmar exclusão</h2>
                            <p className="mb-6">
                                Tem certeza que deseja excluir o produto <strong>{currentProduct.name}</strong>?
                                Esta ação não pode ser desfeita.
                            </p>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border rounded-md"
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDeleteProduct}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                    type="button"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagementPage;