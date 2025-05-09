import React, { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export type FilterOptionsState = {
  id: string;
  label: string;
};

const filterOptions: FilterOptionsState[] = [
  { id: "burger", label: "Burger" },
  { id: "thali", label: "Thali" },
  { id: "biryani", label: "Biryani" },
  { id: "momo", label: "Momo" },
];

const FilterPage = () => {
  const [appliedFilter, setAppliedFilter] = useState<string>("");

  const resetAppliedFilter = () => {
    setAppliedFilter("");
  };

  const appliedFilterHandler = (value: string) => {
    setAppliedFilter((prev) =>
      prev === value ? "" : value // Toggle selection
    );
  };

  return (
    <div className="md:w-72 w-full border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          Filter by Cuisines
        </h1>
        <Button variant="link" onClick={resetAppliedFilter} className="text-sm text-orange-500 hover:text-orange-400">
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {filterOptions.map((option) => (
          <div
            key={option.id}
            className={`flex items-center space-x-2 p-2 rounded-md transition-all ${
              appliedFilter === option.label
                ? "bg-orange-50 dark:bg-orange-950"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Checkbox
              id={option.id}
              checked={appliedFilter === option.label}
              onClick={() => appliedFilterHandler(option.label)}
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
};

export default FilterPage;
