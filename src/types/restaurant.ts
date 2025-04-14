// types/restaurant.ts
export interface RestaurantUnit {
    id?: string;
    name: string;
    socialName: string;
    cnpj: string;
    phone: string;
    specialty: string;
    address: {
        street: string;
        number: string;
        complement: string;
        zipCode: string;
    };
    businessHours: Array<{
        day: string;
        opens: string;
        closes: string;
    }>;
    status: 'active' | 'inactive' | 'outOfHours';
    manager?: string;
}