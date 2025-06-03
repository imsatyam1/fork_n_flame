import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuItem, Restaurant } from "@/types/restaurantType";

type FilterOptionsState = {
  id: string;
  label: string;
};

const FilterSection = ({
  title,
  options,
  appliedFilter,
  onToggle,
}: {
  title: string;
  options: FilterOptionsState[];
  appliedFilter: string[];
  onToggle: (value: string) => void;
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-semibold text-md text-gray-800 dark:text-gray-100">
        {title}
      </h2>
    </div>
    <div className="space-y-2">
      {options.map((option) => (
        <div
          key={option.id}
          className={`flex items-center space-x-2 p-2 rounded-md transition-all ${
            appliedFilter.includes(option.label)
              ? "bg-orange-50 dark:bg-orange-950"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Checkbox
            id={option.id}
            checked={appliedFilter.includes(option.label)}
            onClick={() => onToggle(option.label)}
          />
          <Label
            htmlFor={option.id}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  </div>
);

const FilterPage = () => {
  const { appliedFilter, setAppliedFilter, resetAppliedFilter } = useRestaurantStore();

  const { menus } = useMenuStore();
  const [error, setError] = useState<string | null>(null);
  const { restaurants, fetchRestaurant } = useRestaurantStore();

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        await fetchRestaurant();
      } catch (err) {
        setError("Failed to load menus.");
      }
    };
    loadRestaurant();
  }, [])

  const toggleFilter = (value: string) => {
    setAppliedFilter(value);
  };
  // Sample data (can be fetched dynamically later)

  const cuisineOptions: FilterOptionsState[] = (menus ?? []).map((menu: MenuItem) => ({
    id: menu?._id,
    label: menu?.name,
  }));

  const themeOptions: FilterOptionsState[] = (menus ?? []).map((menu: MenuItem) => ({
    id: menu?._id,
    label: menu?.theme,
  }));

  const restaurantOptions: FilterOptionsState[] = Array.isArray(restaurants)
  ? restaurants.map((restaurant: Restaurant) => ({
      id: restaurant._id?.toString(),
      label: restaurant.restaurantName ?? "Unnamed Restaurant",
    }))
  : [];

  return (
    <div className="md:w-72 w-full border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          Filters
        </h1>
        <Button
          variant="link"
          onClick={resetAppliedFilter}
          className="text-sm text-orange-500 hover:text-orange-400"
        >
          Reset
        </Button>
      </div>

      <FilterSection
        title="Filter by Cuisines"
        options={cuisineOptions}
        appliedFilter={appliedFilter}
        onToggle={toggleFilter}
      />

      <FilterSection
        title="Filter by Theme"
        options={themeOptions}
        appliedFilter={appliedFilter}
        onToggle={toggleFilter}
      />

      <FilterSection
        title="Filter by Restaurant"
        options={restaurantOptions}
        appliedFilter={appliedFilter}
        onToggle={toggleFilter}
      />
    </div>
  );
};

export default FilterPage;
