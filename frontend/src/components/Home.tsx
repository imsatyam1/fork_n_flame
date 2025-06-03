import React, { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/useCartStore";
import { MenuItem } from "@/types/restaurantType";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

type MenuGroupedByTheme = {
  [theme: string]: MenuItem[];
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  const { menus, fetchMenus } = useMenuStore();

  useEffect(() => {
    const loadMenus = async () => {
      try {
        await fetchMenus();
      } catch (err) {
        setError("Failed to load menus.");
      } finally {
        setLoading(false);
      }
    };
    loadMenus();
  }, []);
  

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

  const groupedMenus = Array.isArray(menus) ? groupMenusByTheme(menus) : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <div className="max-w-screen px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Available Menus</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p className="text-gray-600">Loading menus...</p>
        ) : (
          Object.entries(groupedMenus).map(([theme, items]) => (
            <div key={theme} className="mb-10">
              <h2 className="text-2xl py-4 font-semibold text-orange-600 mb-4">
                {theme}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
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

export default Home;
