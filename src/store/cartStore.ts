import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Items } from "./interface";

const initialItems = [
  {
    id: "7",
    name: "Maçã azul",
    price: 7.74,
    obs: "Maçã melada no curaçau blue.",
    quantity: 1,
    image: "/public/",
  },
  {
    id: "14",
    name: "Petit Sorbet",
    price: 25.49,
    obs: "Sorvete frito no forno.",
    quantity: 1,
    image: "",
  },
  {
    id: "23",
    name: "Macarrone Al Capone",
    price: 32.5,
    obs: "Acompanha parmesão.",
    quantity: 2,
    image: "",
  },
  {
    id: "1412",
    name: "Whisky Blue Label",
    price: 7.7,
    obs: "Com/sem gelo.",
    quantity: 2,
    image: "",
  },
  {
    id: "3423",
    name: "Água com gás",
    price: 7.7,
    obs: "Copo com gelo e limão.",
    quantity: 1,
    image: "",
  },
];

// Definindo tipo Cart de compras
export interface CartStore {
  itemsList: Items[];
  cart: Items[];
  addItem: (item: Items) => void;
  updateItem: (id: string, text: string) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [], // Chamada do cart
      itemsList: initialItems, // Estado inicial da lista de itens no carrinho

      // Função para adicionar item
      addItem: (item) => {
        const itemExists = get().cart.find(
          (cartItem) => cartItem.id === item.id
        );

        if (itemExists) {
          if (typeof itemExists.quantity === "number") {
            itemExists.quantity++;
          }

          set({ cart: [...get().cart] });
        } else {
          set({ cart: [...get().cart, { ...item, quantity: 1 }] });
        }
      },

      // Função para remover item
      removeItem: (id) => {
        const itemExists = get().cart.find((item) => item.id === id);

        if (itemExists) {
          if (typeof itemExists.quantity === "number") {
            if (itemExists.quantity >= 2) {
              itemExists.quantity--;
              set({ cart: [...get().cart] });
            } else {
              set({ cart: [...get().cart.filter((item) => item.id !== id)] });
            }
          }
        }
      },

      // Função para atualizar item
      updateItem: (id: string, text: string) =>
        set((state) => ({
          ...state,
          cart: [
            ...get().cart.filter((item) => item.id === id && item.obs === text),
          ],
        })),
    }),
    {
      name: "cart-store", // Nome do armazenamento persistente
    }
  )
);

export default useCartStore;
