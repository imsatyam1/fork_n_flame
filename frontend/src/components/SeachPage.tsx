import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FilterPage from './FilterPage';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Globe, MapPin, X } from 'lucide-react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Card, CardContent, CardFooter } from './ui/card';
import { Skeleton } from './ui/skeleton';

type Restaurant = {
  _id: number;
  imageURL: string;
  restaurantName: string;
  city: string;
  country: string;
  cuisines: string[];
};

const demoRestaurant: Restaurant[] = [
  {
    _id: 1,
    imageURL: 'https://source.unsplash.com/400x200/?restaurant',
    restaurantName: 'Taj Hotel',
    city: 'Mumbai',
    country: 'India',
    cuisines: ['Thali', 'Jalebi', 'Ice Cream'],
  },
  {
    _id: 2,
    imageURL: 'https://source.unsplash.com/400x200/?dhaba',
    restaurantName: 'Shivam Dhaba',
    city: 'Delhi',
    country: 'India',
    cuisines: ['Paneer', 'Butter Naan'],
  },
];

const SeachPage = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedRestaurant, setSearchedRestaurant] = useState<string[]>([]);
  const [searchRestaurant, setSearchRestaurant] = useState<string>('');
  const [appliedFilter, setAppliedFilter] = useState<boolean>(false);

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <FilterPage />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search the restaurant & cuisines"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button className="bg-orange-500 hover:bg-orange-400 text-white">
              Search
            </Button>
          </div>

          {/* Searched Items display here */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <h1 className="font-semibold text-xl text-gray-800 dark:text-gray-100">
                (2) Search result found
              </h1>
              <div className="flex flex-wrap gap-2">
                {['Thali', 'jalebi', 'Ice Cream'].map((selectedFilter, idx) => (
                  <div
                    key={idx}
                    className="relative inline-flex items-center max-w-full"
                  >
                    <Badge
                      variant="outline"
                      className="text-[#D19254] rounded-md cursor-pointer pr-6 whitespace-nowrap"
                    >
                      {selectedFilter}
                    </Badge>
                    <X
                      size={16}
                      className="absolute right-1 text-[#D19254] cursor-pointer"
                      // onClick={() => setAppliedFilter(selectedFilter)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <SearchPageSkeleton />
              ) : demoRestaurant.length === 0 ? (
                <NoResultFound searchText={params.text ?? searchQuery} />
              ) : (
                demoRestaurant.map((restaurant) => (
                  <Card
                    key={restaurant._id}
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <AspectRatio ratio={16 / 6}>
                        <img
                          src={restaurant.imageURL}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-80 rounded-lg px-3 py-1 shadow-sm">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {restaurant.restaurantName}
                      </h1>
                      <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400 gap-1">
                        <MapPin size={16} />
                        <p className="text-sm">
                          City: <span className="font-medium">{restaurant.city}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400 gap-1">
                        <Globe size={16} />
                        <p className="text-sm">
                          Country:{' '}
                          <span className="font-medium">{restaurant.country}</span>
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {restaurant.cuisines.map((cuisine, idx) => (
                          <Badge key={idx}>{cuisine}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 flex justify-end">
                      <Link to={`/restaurant/${restaurant._id}`}>
                        <Button className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 px-4 rounded-full transition">
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
    </div>
  );
};

export default SeachPage;

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
            <Skeleton className="h-4 w-1/2 my-1" />
            <Skeleton className="h-4 w-1/2 my-1" />
            <div className="flex gap-2 mt-4 flex-wrap">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
          <CardFooter className="p-4 dark:bg-gray-900 flex justify-center">
            <Skeleton className="h-10 w-24 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

const NoResultFound = ({ searchText }: { searchText: string }) => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        No results found
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We couldn't find any results for "<span className="italic">{searchText}</span>".<br />
        Try searching with a different term.
      </p>
      <Link to="/">
        <Button className="mt-4 bg-orange-500 hover:bg-orange-400 text-white">
          Go Back to Home
        </Button>
      </Link>
    </div>
  );
};
