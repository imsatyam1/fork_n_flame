import { MenuItem } from '@/types/restaurantType';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import Navbar from './Navbar';

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const [addToCart, setAddToCart] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAddToCart = (menuId: string) => {
    setAddToCart((prev) => [...prev, menuId]);
    console.log('Cart Items:', addToCart);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-gray-800 dark:text-white">
        Available Menus
      </h1>
      <div className="grid gap-8 md:grid-cols-3">
        {menus.map((menu: MenuItem) => (
          <Card
            key={menu._id}
            className="max-w-sm mx-auto shadow-xl rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <img src={menu.image} alt={menu.name} className="w-full h-48 object-cover" />
            <CardContent className="p-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{menu.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{menu.description}</p>
              <h3 className="text-lg font-semibold mt-4 text-gray-700 dark:text-gray-200">
                Price: <span className="text-orange-500">₹{menu.price}</span>
              </h3>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold"
                onClick={() => handleAddToCart(menu._id)}
              >
                Add To Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;


