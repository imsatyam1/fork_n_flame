import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8080/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [],

      createCheckoutSession: async (
        checkoutSession: CheckoutSessionRequest
      ) => {
        try {
          
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/checkout/create-checkout-session`,
            checkoutSession,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          window.location.href = response.data.session.url;
        } catch (error) {
          console.error("Checkout session creation failed", error);
        } finally {
          set({ loading: false });
        }
      },

      getOrderDetails: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          set({ orders: response.data.orders });
        } catch (error) {
          const message = "Something went wrong";
          console.error("Checkout session creation failed", message);
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "order-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
