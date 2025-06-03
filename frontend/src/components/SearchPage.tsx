import { Link, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronRight, Globe, MapPin, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { MenuItem, Restaurant } from "@/types/restaurantType";
import { useCartStore } from "@/store/useCartStore";

const SearchPage = () => {
  const params = useParams();
  const searchText = params.text!;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const {
    loading,
    searchedRestaurant,
    searchedMenu,
    isMenu,
    searchRestaurant,
    setAppliedFilter,
    appliedFilter,
  } = useRestaurantStore();

  const { addToCart } = useCartStore();

  useEffect(() => {
    searchRestaurant(searchText, searchQuery, appliedFilter);
  }, [searchText, appliedFilter]);

  return (
    <div>
      {/* Mobile Filter Button */}
      <div className="lg:hidden px-4 mt-6">
        {/* Filter Toggle Button */}
        <Button
          className="w-full bg-gray-400 hover:bg-gray-200 text-white mb-4 flex items-center justify-between"
          onClick={() => setShowMobileFilter(!showMobileFilter)}
        >
          <span>Filters</span>
          {showMobileFilter ? <ChevronDown /> : <ChevronRight />}
        </Button>

        {/* Search Input + Button (Single Row) */}
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={searchQuery}
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() =>
              searchRestaurant(params.text!, searchQuery, appliedFilter)
            }
            className="bg-orange-500 hover:bg-orange-400 text-white"
          >
            Search
          </Button>
        </div>

        {/* Filter Page */}
        {showMobileFilter && (
          <div className="mb-4">
            <FilterPage />
          </div>
        )}
      </div>

      {isMenu ? (
        <div className="max-w-7full mx-auto px-4 md:px-6 my-10">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Desktop Filter */}
            <div className="hidden lg:block">
              <FilterPage />
            </div>

            <div className="flex-1">
              {/* Search Input */}
              <div className="hidden relative w-full mb-6 lg:block">
                <Input
                  type="text"
                  value={searchQuery}
                  placeholder="Search by restaurant & cuisines"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-28 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400"
                />
                <Button
                  onClick={() =>
                    searchRestaurant(params.text!, searchQuery, appliedFilter)
                  }
                  className="absolute top-1/2 right-0 -translate-y-1/2 px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-400 text-white rounded-md shadow-md"
                >
                  Search
                </Button>
              </div>

              {/* Result Info & Filters */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <h1 className="font-medium text-lg mb-2 md:mb-0">
                    ({searchedMenu?.data.length}) Search result found
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {appliedFilter.map(
                      (selectedFilter: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative inline-flex items-center max-w-full"
                        >
                          <Badge
                            className="text-[#D19254] pr-6 rounded-md cursor-pointer whitespace-nowrap"
                            variant="outline"
                          >
                            {selectedFilter}
                          </Badge>
                          <X
                            onClick={() => setAppliedFilter(selectedFilter)}
                            size={16}
                            className="absolute right-1 text-[#D19254] cursor-pointer"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                  <SearchPageSkeleton />
                ) : searchedRestaurant?.data.length === 0 ? (
                  <NoResultFound searchText={params.text!} />
                ) : (
                  searchedMenu?.data.map((menu: MenuItem) => (
                    <Card
                      key={menu._id}
                      className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="relative">
                        <AspectRatio ratio={16 / 6}>
                          <img
                            src={menu.image}
                            alt={menu.name}
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                        <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded px-3 py-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Featured
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                          {menu.name}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {menu.description}
                        </p>
                        <div className="text-orange-500 font-bold mt-2">
                          ₹{menu.price}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 border-t dark:border-gray-700 border-gray-200">
                        <Button
                          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-colors duration-200"
                          onClick={() => addToCart(menu)}
                        >
                          Add To Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-full mx-auto my-10 px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Desktop Filter */}
            <div className="hidden lg:block">
              <FilterPage />
            </div>

            <div className="flex-1">
              {/* Search Input */}
              <div className="hidden relative w-full mb-6 lg:block">
                <Input
                  type="text"
                  value={searchQuery}
                  placeholder="Search by restaurant & cuisines"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-28 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400"
                />
                <Button
                  onClick={() =>
                    searchRestaurant(params.text!, searchQuery, appliedFilter)
                  }
                  className="absolute top-1/2 right-0 -translate-y-1/2 px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-400 text-white rounded-md shadow-md"
                >
                  Search
                </Button>
              </div>

              {/* Result Info & Filters */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <h1 className="font-medium text-lg mb-2 md:mb-0">
                    ({searchedMenu?.data.length}) Search result found
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {appliedFilter.map(
                      (selectedFilter: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative inline-flex items-center max-w-full"
                        >
                          <Badge
                            className="text-[#D19254] pr-6 rounded-md cursor-pointer whitespace-nowrap"
                            variant="outline"
                          >
                            {selectedFilter}
                          </Badge>
                          <X
                            onClick={() => setAppliedFilter(selectedFilter)}
                            size={16}
                            className="absolute right-1 text-[#D19254] cursor-pointer"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Restaurant Cards */}
              <div className="grid md:grid-cols-2 gap-2 lg:grid-cols-3">
                {loading ? (
                  <SearchPageSkeleton />
                ) : searchedRestaurant?.data.length === 0 ? (
                  <NoResultFound searchText={params.text!} />
                ) : (
                  searchedRestaurant?.data.map((restaurant: Restaurant) => (
                    <Card
                      key={restaurant._id}
                      className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="relative">
                        <AspectRatio ratio={16 / 6}>
                          <img
                            src={restaurant.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                        <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Featured
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {restaurant.restaurantName}
                        </h1>
                        <div className="mt-2 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <MapPin size={16} />
                          <p className="text-sm">
                            City:{" "}
                            <span className="font-medium">
                              {restaurant.city}
                            </span>
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Globe size={16} />
                          <p className="text-sm">
                            Country:{" "}
                            <span className="font-medium">
                              {restaurant.country}
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {restaurant.cuisines.map(
                            (cuisine: string, idx: number) => (
                              <Badge
                                key={idx}
                                className="font-medium px-2 py-1 rounded-full shadow-sm"
                              >
                                {cuisine}
                              </Badge>
                            )
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 flex justify-end">
                        <Link to={`/restaurant/${restaurant._id}`}>
                          <Button className="bg-orange-400 hover:bg-hoverOrange font-semibold px-4 rounded-full shadow-md transition-colors duration-200">
                            View Menus
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

// Skeleton Loader
const SearchPageSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Card
          key={index}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
        >
          <div className="relative">
            <AspectRatio ratio={16 / 6}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="mt-2 flex gap-1 items-center text-gray-600 dark:text-gray-400">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
          <CardFooter className="p-4  dark:bg-gray-900 flex justify-end">
            <Skeleton className="h-10 w-24 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

// No Result Component
const NoResultFound = ({ searchText }: { searchText: string }) => {
  return (
    <div className="text-center col-span-full">
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        No results found
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We couldn't find any results for "{searchText}". <br /> Try searching
        with a different term.
      </p>
      <Link to="/">
        <Button className="mt-4 bg-orange hover:bg-orangeHover">
          Go Back to Home
        </Button>
      </Link>
    </div>
  );
};
