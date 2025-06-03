import { cartItems, CheckoutSessionRequest } from "@/types/orderType";
import { MenuItem } from "@/types/restaurantType";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useOrderStore } from "@/store/useOrderStore";

const CheckoutConfirmPage = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUserStore();

  const [input, setInput] = useState({
    name: user?.fullname || "",
    email: user?.email || "",
    contact: user?.contact.toString() || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const { cart } = useCartStore();
  const { restaurant } = useRestaurantStore();
  const { createCheckoutSession, loading} = useOrderStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const checkoutHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const checkoutData: CheckoutSessionRequest = {
        cartItems: cart.map((item) => ({
          menuId: item._id,
          name: item.name,
          image: item.image,
          price: item.price.toString(),
          quantity: item.quantity.toString(),
        })),
        deliveryDetails: input,
        restaurantId: restaurant?._id as string, // fallback if null
      };

      await createCheckoutSession(checkoutData)
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl w-full rounded-2xl p-6 space-y-4">
        <DialogTitle className="text-xl font-semibold text-gray-800">
          🧾 Review Your Detail
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          Double-check your delivery details. When ready, click the button to continue to payment.
        </DialogDescription>

        <form
          onSubmit={checkoutHandler}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label htmlFor="name" className="py-2">Full Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="py-2">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="contact" className="py-2">Contact Number</Label>
            <Input
              id="contact"
              type="tel"
              name="contact"
              value={input.contact}
              onChange={changeEventHandler}
              placeholder="e.g. 9876543210"
              required
            />
          </div>
          <div>
            <Label htmlFor="address" className="py-2">Address</Label>
            <Input
              id="address"
              type="text"
              name="address"
              value={input.address}
              onChange={changeEventHandler}
              placeholder="Street, Building, etc."
              required
            />
          </div>
          <div>
            <Label htmlFor="city" className="py-2">City</Label>
            <Input
              id="city"
              type="text"
              name="city"
              value={input.city}
              onChange={changeEventHandler}
              placeholder="City"
              required
            />
          </div>
          <div>
            <Label htmlFor="country" className="py-2">Country</Label>
            <Input
              id="country"
              type="text"
              name="country"
              value={input.country}
              onChange={changeEventHandler}
              placeholder="Country"
              required
            />
          </div>

          <DialogFooter className="col-span-1 md:col-span-2 mt-4">
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPage;
