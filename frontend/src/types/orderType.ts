export type cartItems = {
  menuId: string;
  name: string;
  image: string;
  price: string;
  quantity: string;
};

export type CheckoutSessionRequest = {
  cartItem: cartItems[];

  deleveryDetails: {
    name: string;
    email: string;
    contact: string;
    address: string;
    city: string;
    country: string;
  };
  restaurantId: string;
};

export interface Orders extends CheckoutSessionRequest {
  _id: string;
  status: string;
  totalAmount: number;
}

export type OrderState = {
  loading: boolean;
  orders: Orders[];
  createCheckoutSession: (
    CheckoutSessionRequest: CheckoutSessionRequest
  ) => Promise<void>;
  getOrderDetails: () => Promise<void>;
};
