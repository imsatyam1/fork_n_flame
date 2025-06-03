import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./useUserStore";

const API_END_POINT = "http://localhost:8080/api/v1/restaurant";
axios.defaults.withCredentials = true;

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      loading: false,
      restaurant: null,
      isMenu: false,
      restaurants: null,
      searchedMenu: null,
      searchedRestaurant: null,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrder: [],
      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });

          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      getRestaurant: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({ loading: false, restaurant: response.data.restaurant });
          }
        } catch (error: any) {
          if (error.response.data.success === 404) {
            set({ restaurant: null });
          }
          set({ loading: false });
        }
      },

      updateRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      searchRestaurant: async (
        searchText: string,
        searchQuery: string,
        selectedCuisines: any
      ) => {
        try {
          set({ loading: true });

          const params = new URLSearchParams();
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));

          const response = await axios.get(
            `${API_END_POINT}/search/${searchText}?${params.toString()}`
          );

          console.log(response);
          
          if (response.data.success) {
            if (response.data.isMenu) {
              set({ loading: false, isMenu: true, searchedMenu: response.data })
            }else{
              set({ loading: false, isMenu: false, searchedRestaurant: response.data });
            }
            return true;
          }else{
            set({ loading: false });
            return false;
          }
        } catch (error: any) {
          console.log(error);
          
          toast.error(error.response.data.message);
          set({ loading: false });
          return false;
        }
      },

      addMenuToRestaurant: (menu: MenuItem) => {
        set((state: any) => ({
          restaurant: state.restaurant
            ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] }
            : null,
        }));
      },

      updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state: any) => {
          if (state.restaurant) {
            const updateMenuList = state.restaurant.menus.map((menu: any) =>
              menu._id === updatedMenu._id ? updatedMenu : menu
            );

            return {
              restaurant: {
                ...state.restaurant,
                menus: updateMenuList,
              },
            };
          }
          return state;
        });
      },

      setAppliedFilter: (value: string) => {
        set((state) => {
          const isAlreadyApplied = state.appliedFilter.includes(value);
          const updatedFilter = isAlreadyApplied
            ? state.appliedFilter.filter((item) => item !== value)
            : [...state.appliedFilter, value];
          return { appliedFilter: updatedFilter };
        });
      },

      resetAppliedFilter: () => {
        set({ appliedFilter: [] });
      },

      getSingleRestaurant: async (restaurantId: string) => {
        try {
          const response = await axios.get(`${API_END_POINT}/${restaurantId}`);

          if (response.data.success) {
            set({ singleRestaurant: response.data.restaurant });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      getRestaurantOrders: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/order`);
          if (response.data.success) {
            set({ restaurantOrder: response.data.orders });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
          
          const response = await axios.put(
            `${API_END_POINT}/order/${orderId}/status`,
            { status },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            const updatedOrder = get().restaurantOrder.map((order: Orders) => {
              return order._id === orderId
                ? { ...order, status: response.data.status }
                : order;
            });
            set({ restaurantOrder: updatedOrder });
            toast.success(response.data.message);
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      },

      fetchRestaurant: async () => {
        try {
          const response = await axios.get(
            `${API_END_POINT}/get-restaurants`
          );

          if (response.data.success) {
            set({ restaurants: response.data.restaurants }  );
          }
        } catch (err) {
          console.error("Failed to fetch menus:", err);
        }
      },
    }),
    {
      name: "restaurant-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
