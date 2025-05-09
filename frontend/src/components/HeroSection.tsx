import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import HereImage from "@/assets/hero_pizza.png";
import { useNavigate } from "react-router-dom";

const HereSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-b from-orange-50 via-white to-white py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-full mx-7 px-6 gap-16">
        {/* Left Section */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 md:w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 tracking-tight">
              Order Food <span className="text-orange-500">&</span> Enjoy Anytime
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed ">
              Craving something tasty? Our delicious meals are just a click away — we’re always nearby and ready to deliver!
            </p>
          </div>

          <div className="relative w-full mt-2 md:w-1/2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by restaurant, city, or country"
              className="pl-12 pr-40 py-3 rounded-full shadow-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-base"
            />
            <Button
              onClick={() => navigate(`/search/${searchText}`)}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 relative">
          <img
            src={HereImage}
            alt="Delicious pizza"
            className="w-full max-h-[500px] object-contain transition-transform duration-500 hover:scale-105 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HereSection;
