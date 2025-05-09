import { Orders } from "./orderType";

export type MenuItem = {
    _id: string;
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
    imageURL: string;
}

export type SearchedRestaurant = {
    data: Restaurant[]
}

export type RestaurantState = {
    loading: boolean;
    restaurant: Restaurant | null;
    searchedRestaurant: SearchedRestaurant | null;
    appliedFilter: string[];
    singleRestaurant: Restaurant | null;
    restaurantOrder: Orders[]; // fixed array type
    createRestaurant: (formData: FormData) => Promise<void>;
    getRestaurant: () => Promise<void>;
    updateReRestaurant: (formData: FormData) => Promise<void>;
    searchRestaurant: (
      searchText: string,
      searchQuery: string,
      selectedCuisines: any
    ) => Promise<void>;
    addMenuToRestaurant: (menu: MenuItem) => void;
    setAppliedFilter: (value: string) => void;
    resetAppliedFilter: () => void;
    getSingleRestaurant: (restaurantId: string) => Promise<void>;
    getRestaurantOrders: () => Promise<void>;
    updateRestaurantOrder: (orderId: string, status: string) => Promise<void>;
  };
  