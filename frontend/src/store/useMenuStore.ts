import { MenuItem } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8080/api/v1/menu";

type MenuState = {
  loading: boolean;
  menu: null;
  menus: MenuItem[] | null;
  searchedMenus: MenuItem[] | null;
  createMenu: (formData: FormData) => Promise<boolean>;
  editMenu: (menuId: string, formData: FormData) => Promise<boolean>;
  searchMenu: (
    searchText: string,
    searchQuery: string,
    selectedCuisines: any
  ) => Promise<boolean>;
  fetchMenus: () => Promise<void>;
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      loading: false,
      menu: null,
      menus: null,
      searchedMenus: null,
      createMenu: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, menu: response.data.menu });
            return true;
          } else {
            set({ loading: false });
            return false;
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
          return false;
        }
      },
      editMenu: async (menuId: string, formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(
            `${API_END_POINT}/${menuId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
            return true;
          } else {
            set({ loading: false });
            return false;
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
          return false;
        }
      },

      fetchMenus: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/`);

          if (response.data.success) {
            set({ menus: response.data.menus });
          }
        } catch (err) {
          console.error("Failed to fetch menus:", err);
        }
      },

      searchMenu: async (
        searchText: string,
        searchQuery: string,
        selectedCuisines: any
      ) => {
        try {
          console.log("get Request");
          
          set({ loading: true });

          const params = new URLSearchParams();
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));

          const response = await axios.get(
            `${API_END_POINT}/search/${searchText}?${params.toString()}`
          );
          console.log(response);
          
          if (response) {
            toast.success(response.data.message);
            set({ loading: false, searchedMenus: response.data });
            return true;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: "menu-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
