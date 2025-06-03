import { MenuItem } from "@/types/restaurantType";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/useCartStore";
import { error } from "console";


type MenuGroupedByTheme = {
  [theme: string]: MenuItem[];
};

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const { addToCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupMenusByTheme = (menus: MenuItem[]): MenuGroupedByTheme => {
      return menus.reduce((acc: MenuGroupedByTheme, menu) => {
        const theme = menu.theme || "Others";
        if (!acc[theme]) {
          acc[theme] = [];
        }
        acc[theme].push(menu);
        return acc;
      }, {});
    };
  
    const groupedMenus = groupMenusByTheme(menus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Available Menus
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p className="text-gray-600">Loading menus...</p>
        ) : (
          Object.entries(groupedMenus).map(([theme, items]) => (
            <div key={theme} className="mb-10">
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">
                {theme}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map((menu) => (
                  <div
                    key={menu._id}
                    className="bg-white border rounded-lg shadow p-4"
                  >
                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h3 className="text-xl font-semibold">{menu.name}</h3>
                    <p className="text-sm text-gray-600">{menu.description}</p>
                    <div className="text-orange-500 font-bold mt-2">
                      ₹{menu.price}
                    </div>
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold my-2"
                      onClick={() => addToCart(menu)}
                    >
                      Add To Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableMenu;
