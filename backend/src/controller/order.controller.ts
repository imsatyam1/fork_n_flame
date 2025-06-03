import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";
import { error } from "console";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type CheckoutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  totalAmount: number;
  restaurantId: string;
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.id })
      .populate("user")
      .populate("restaurant");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    console.log(checkoutSessionRequest);
    
    
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    ).populate("menus");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    const order: any = new Order({
      restaurant: restaurant._id,
      user: req.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      status: "pending",
      totalAmount: checkoutSessionRequest.totalAmount
    });

    // line items
    const menuItems = restaurant.menus;
    const lineItems = createLineItems(checkoutSessionRequest, menuItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA"],
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/status`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        images: JSON.stringify(menuItems.map((item: any) => item.image)),
      },
    });
    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    await order.save();
    return res.status(200).json({
      session,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const stripeWebhook = async (request: Request, response: Response) => {
  let event;

  try {
    // Get the Stripe signature from headers
    const signature = request.headers["stripe-signature"];
    const payload = request.body; // This should be raw body for Stripe

    const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;
    if (!signature || !secret) {
      return response.status(400).send("Missing signature or secret.");
    }

    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return response.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle event
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return response.status(400).json({ message: "Missing order ID in metadata" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return response.status(404).json({ message: "Order not found!" });
      }

      if (session.amount_total) {
        order.totalAmount = session.amount_total;
      }

      order.status = "confirmed";
      await order.save();
    } catch (error) {
      console.error("Error processing event:", error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }

  response.status(200).send();
};


export const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: any
) => {
  // 1. create lineItem
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item: any) => item._id.toString() === cartItem.menuId
    );
    if (!menuItem) throw new Error("Menu item id not found");

    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: menuItem.name,
          images: [menuItem.image],
        },
        unit_amount: menuItem.price * 100,
      },
      quantity: cartItem.quantity,
    };
  });

  return lineItems;
};
