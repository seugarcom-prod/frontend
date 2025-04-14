// types/product.ts

export interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    category: string;
    image?: string;
    isAvailable: boolean;
    quantity: number;
    restaurant: string;
    ingredients?: string[];
    nutritionalInfo?: string;
    allergens?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductFormData {
    name: string;
    price: string;
    description: string;
    category: string;
    image: string;
    quantity: number;
    isAvailable: boolean;
}