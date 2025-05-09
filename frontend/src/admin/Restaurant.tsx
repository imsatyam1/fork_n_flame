import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { restaurantFormSchema } from "@/schema/restaurantSchema";
import { Loader2 } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";

const Restaurant = () => {
  const [input, setInput] = useState<restaurantFormSchema>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    imageFile: undefined,
  });

  const [errors, setErrors] = useState<Partial<restaurantFormSchema>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [restaurant, setRestaurant] = useState<boolean>(false);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = restaurantFormSchema.safeParse(input);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<restaurantFormSchema>);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("restaurantName", input.restaurantName);
      formData.append("city", input.city);
      formData.append("country", input.country);
      formData.append("deliveryTime", input.deliveryTime.toString());
      formData.append("cuisines", JSON.stringify(input.cuisines));
      if (input.imageFile) formData.append("imageFile", input.imageFile);

      // Simulate API delay
      setTimeout(() => {
        setLoading(false);
        setRestaurant(true);
      }, 1500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {};
    fetchRestaurant();
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-12 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Restaurant</h1>
      <form onSubmit={submitHandler} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restaurant Name */}
          <div>
            <Label className="text-sm">Restaurant Name</Label>
            <Input
              type="text"
              name="restaurantName"
              value={input.restaurantName}
              onChange={changeEventHandler}
              placeholder="e.g., Spicy Villa"
              className="rounded-xl text-base"
            />
            {errors?.restaurantName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.restaurantName}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <Label className="text-sm">City</Label>
            <Input
              type="text"
              name="city"
              value={input.city}
              onChange={changeEventHandler}
              placeholder="e.g., Mumbai"
              className="rounded-xl text-base"
            />
            {errors?.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <Label className="text-sm">Country</Label>
            <Input
              type="text"
              name="country"
              value={input.country}
              onChange={changeEventHandler}
              placeholder="e.g., India"
              className="rounded-xl text-base"
            />
            {errors?.country && (
              <p className="text-sm text-red-500 mt-1">{errors.country}</p>
            )}
          </div>

          {/* Delivery Time */}
          <div>
            <Label className="text-sm">Delivery Time (min)</Label>
            <Input
              type="number"
              name="deliveryTime"
              value={input.deliveryTime}
              onChange={changeEventHandler}
              placeholder="e.g., 30"
              className="rounded-xl text-base"
            />
            {errors?.deliveryTime && (
              <p className="text-sm text-red-500 mt-1">
                {errors.deliveryTime}
              </p>
            )}
          </div>

          {/* Cuisines */}
          <div>
            <Label className="text-sm">Cuisines (comma separated)</Label>
            <Input
              type="text"
              name="cuisines"
              value={input.cuisines.join(",")}
              onChange={(e) =>
                setInput({ ...input, cuisines: e.target.value.split(",") })
              }
              placeholder="e.g., Biryani, Pizza"
              className="rounded-xl text-base"
            />
            {errors?.cuisines && (
              <p className="text-sm text-red-500 mt-1">{errors.cuisines}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-sm">Upload Banner</Label>
            <Input
              type="file"
              accept="image/*"
              name="imageFile"
              onChange={(e) =>
                setInput({
                  ...input,
                  imageFile: e.target.files?.[0] || undefined,
                })
              }
              className="rounded-xl text-base"
            />
            {errors?.imageFile?.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.imageFile.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <Button
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-400 transition-all px-6 py-2 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : restaurant ? (
              "Update Restaurant"
            ) : (
              "Add Restaurant"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Restaurant;