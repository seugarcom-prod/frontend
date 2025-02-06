import useCartStore from "@/store/cartStore";
import React from "react";

export const Cart: React.FC = () => {
  const [cart] = useCartStore((state) => [state.cart]);

  const totalValue = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {cart.map((item) => (
          <li key={item.id} className="flex flex-row justify-between">
            <div>
              {item.name} - {item.quantity}
            </div>
          </li>
        ))}
      </ul>

      <h3>Total</h3>
      <span>{formatted.format(totalValue)}</span>
    </div>
  );
};
