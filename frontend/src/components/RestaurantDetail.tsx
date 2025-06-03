import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import AvailableMenu from "./AvailableMenu";
import { MenuItem } from "@/types/restaurantType";
import { useParams } from "react-router-dom";
import { useRestaurantStore } from "@/store/useRestaurantStore";


const RestaurantDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const { singleRestaurant, getSingleRestaurant } = useRestaurantStore();

  useEffect(() => {
    getSingleRestaurant(params.id!);
  }, [params.id])

  return (
    <>
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Image Banner */}
        <div className="relative w-full h-48 md:h-72 lg:h-96">
          <img
            src={singleRestaurant?.imageUrl || "Loading...."}
            alt={singleRestaurant?.restaurantName}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Details Section */}
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            {singleRestaurant?.restaurantName || "Loading..."}
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

