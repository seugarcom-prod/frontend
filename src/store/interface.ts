/* eslint-disable @typescript-eslint/no-unused-vars */

// Definindo o tipo User
export interface UserStore {
  id: string;
  email: string;
  password: string;
}

// Definindo o tipo Guest 
export interface GuestStore {
  id: string;
  document: string;
  email: string;
}

// Definindo o tipo Items
export interface Items {
  id: string;
  name: string;
  price: number;
  obs: string;
  quantity: number;
  image: string;
}
