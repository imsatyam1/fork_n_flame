import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import AvailableMenu from "./AvailableMenu";
import { MenuItem } from "@/types/restaurantType";
import Navbar from "./Navbar";

type Menu = {
  _id: number;
  name: string;
  imageURL: string;
  cuisines: string[];
  deliveryTime: number;
  menus: MenuItem[];
};

const singleRestaurant: Menu = {
  _id: 1,
  name: "Taj Garden",
  imageURL: "https://i.ytimg.com/vi/BuR0_GkM_jA/maxresdefault.jpg",
  cuisines: ["Rasgulla", "Pav Bhaji", "Ice Cream"],
  deliveryTime: 20,
  menus: [
    {
      _id: "1",
      name: "Rasgulla",
      description: "2 piece of rasgulla",
      price: 20,
      image:
        "https://b.zmtcdn.com/data/dish_photos/126/0aab475f8fe817df5cac800cd86ee126.png",
    },
    {
      _id: "1",
      name: "Rasgulla",
      description: "2 piece of rasgulla",
      price: 20,
      image:
        "https://b.zmtcdn.com/data/dish_photos/126/0aab475f8fe817df5cac800cd86ee126.png",
    },
    {
      _id: "1",
      name: "Rasgulla",
      description: "2 piece of rasgulla",
      price: 20,
      image:
        "https://b.zmtcdn.com/data/dish_photos/126/0aab475f8fe817df5cac800cd86ee126.png",
    },
  ],
};

const RestaurantDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
    <Navbar />
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Image Banner */}
        <div className="relative w-full h-48 md:h-72 lg:h-96">
          <img
            src={singleRestaurant?.imageURL || ""}
            alt={singleRestaurant.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Details Section */}
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            {singleRestaurant.name || "Loading..."}
          </h1>

          {/* Cuisines Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {singleRestaurant?.cuisines.map((cuisine, idx) => (
              <Badge
                key={idx}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full shadow-sm"
              >
                {cuisine}
              </Badge>
            ))}
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-3 text-gray-600">
            <Timer className="w-5 h-5 text-[#D19254]" />
            <span className="text-lg font-medium">
              Delivery Time:{" "}
              <span className="text-[#D19254] font-semibold">
                {singleRestaurant?.deliveryTime || "NA"} mins
              </span>
            </span>
          </div>
        </div>
        {singleRestaurant?.menus && (
          <AvailableMenu menus={singleRestaurant?.menus!} />
        )}
      </div>
    </div>
    </>
  );
};

export default RestaurantDetail;

