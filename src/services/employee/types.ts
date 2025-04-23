export interface IEmployee {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'ATTENDANT';
    avatar?: string;
    restaurantUnit?: string;
    createdAt: string;
    updatedAt: string;
}
