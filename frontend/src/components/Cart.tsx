import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Minus, Plus, Trash2 } from "lucide-react";
import Navbar from "./Navbar";
import CheckoutConfirmPage from "./CheckoutConfirmPage";

type CartItem = {
  _id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
};

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([
    {
      _id: "1",
      image:
        "https://b.zmtcdn.com/data/dish_photos/126/0aab475f8fe817df5cac800cd86ee126.png",
      name: "Rasgulla",
      price: 20,
      quantity: 1,
    },
    {
      _id: "2",
      image:
        "https://cdn.zeptonow.com/production///tr:w-600,ar-100-100,pr-true,f-auto,q-80/web/recipes/chola-bhatura.png",
      name: "Chole Bhature",
      price: 70,
      quantity: 1,
    },
    {
      _id: "3",
      image:
        "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/11/pav-bhaji.jpg",
      name: "Pav Bhaji",
      price: 60,
      quantity: 1,
    },
  ]);

  const incrementQuantity = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decrementQuantity = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
    );
  };

  let totalAmout = cart.reduce((acc, ele) => {
    return acc + ele.price * ele.quantity;
  }, 0);

  const clearItem = () => {
    setCart([]);
  };

  const deleteItem = (id: string) => {
    setCart((prevData) => prevData.filter((item) => item._id !== id));
  };

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Navbar />
      <div className="flex flex-col max-w-7xl mx-auto my-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Your Cart
          </h1>
          <Button
            onClick={() => clearItem()}
            variant="link"
            className="text-red-500 hover:underline"
          >
            Clear All
          </Button>
        </div>

        {/* Cart Items */}
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-6 p-4 mb-4 border rounded-xl shadow-sm bg-white dark:bg-gray-900"
          >
            {/* Avatar */}
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={item.image}
                alt={item.name}
                className="rounded-2xl object-cover w-20 h-20"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {/* Item Details */}
            <div className="flex flex-col flex-grow md:ml-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {item.name}
              </h2>

              {/* Quantity Controller */}
              <div className="flex items-center gap-2 mt-2">
                <Button
                  onClick={() => decrementQuantity(item._id)}
                  size="icon"
                  variant="outline"
                  className="rounded-full bg-gray-200 dark:bg-gray-700"
                >
                  <Minus />
                </Button>
                <div className="px-3 py-1 text-sm font-bold">
                  {item.quantity}
                </div>
                <Button
                  onClick={() => incrementQuantity(item._id)}
                  size="icon"
                  variant="outline"
                  className="rounded-full bg-orange-400 hover:bg-orange-500 text-white"
                >
                  <Plus />
                </Button>
              </div>

              {/* Price */}
              <p className="text-gray-600 dark:text-gray-300 mt-2 font-medium">
                ₹{item.price * item.quantity}
              </p>
            </div>

            {/* Delete Button */}
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              onClick={() => deleteItem(item._id)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg z-50">
          <h1 className="font-bold text-xl md:text-2xl text-gray-800 dark:text-white">
            Total: {totalAmout}
          </h1>
          <button
            className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg shadow-md transition"
            onClick={() => setOpen(true)}
          >
            Proceed To Checkout
          </button>
        </div>
        <CheckoutConfirmPage open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default Cart;
