export interface IUser {
    _id: string;
    name: string;
    email: string;
    // Adicione outros campos se necessário
}

export interface IRestaurant {
    _id: string;
    name: string;
    logo: string;
    cnpj: string;
    socialName: string;
    address: {
        zipCode: string;
        street: string;
        number: number;
        complement: string;
    };
    rating: number;
    specialty: string;
    phone: string;
    admin: {
        fullName: string;
        cpf: string;
    };
    units: string[] | IRestaurantUnit[];
    attendants: string[] | IUser[];
}

export interface IRestaurantUnit {
    _id: string;
    address: {
        zipCode: string;
        street: string;
        number: number;
        complement: string;
    };
    cnpj: string;
    socialName: string;
    manager: string;
    phone: string;
    attendants: string[] | IUser[];
    orders: string[] | IOrder[];
}

export interface IProduct {
    _id: string;
    restaurant: string | IRestaurant;
    category: string;
    image: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
    isAvailable: boolean;
}

export interface IOrder {
    _id: string;
    restaurant: string | IRestaurant;
    user: string | IUser;
    items: Array<{
        product: string;
        quantity: number;
        price: number;
    }>;
    table: number;
    isPaid: boolean;
    totalAmount: number;
    discountTicket?: string;
    status: string;
    createdAt: Date;
    paidAt?: Date;
}

export interface CartItem {
    productId: string;
    quantity: number;
}