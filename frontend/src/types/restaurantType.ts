import { Orders } from "./orderType";

export type MenuItem = {
    _id: string;
    theme: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export type Restaurant = {
    _id: string;
    user: string;
    restaurantName: string;
    city: string;
    country: string;
    deliveryTime: string;
    cuisines: string[];
    menus: MenuItem[];
    imageUrl: string;
}

export type SearchedRestaurant = {
    data: Restaurant[]
}

export type SearchedMenu = {
    data: MenuItem[]
}

export type RestaurantState = {
    loading: boolean;
    restaurant: Restaurant | null;
    isMenu: boolean;
    restaurants: Restaurant[] | null;
    searchedMenu:  SearchedMenu | null;
    searchedRestaurant: SearchedRestaurant | null;
    appliedFilter: string[];
    singleRestaurant: Restaurant | null;
    restaurantOrder: Orders[]; // fixed array type
    createRestaurant: (formData: FormData) => Promise<void>;
    getRestaurant: () => Promise<void>;
    updateRestaurant: (formData: FormData) => Promise<void>;
    searchRestaurant: (
      searchText: string,
      searchQuery: string,
      selectedCuisines: any
    ) => Promise<boolean>;
    addMenuToRestaurant: (menu: MenuItem) => void;
    setAppliedFilter: (value: string) => void;
    resetAppliedFilter: () => void;
    getSingleRestaurant: (restaurantId: string) => Promise<void>;
    getRestaurantOrders: () => Promise<void>;
    updateRestaurantOrder: (orderId: string, status: string) => Promise<void>;
    fetchRestaurant: () => Promise<void>;
  };
  