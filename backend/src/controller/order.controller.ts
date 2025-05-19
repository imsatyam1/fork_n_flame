import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";

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
    restaurantId: string;
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.id })
            .populate("user")
            .populate("restaurant");

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate("menus");

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        const order: any = new Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "pending"
        });

        // Line items for Stripe checkout
        const menuItems = restaurant.menus;
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            shipping_address_collection: {
                allowed_countries: ["GB", "US", "CA"]
            },
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                image: JSON.stringify(menuItems.map((item: any) => item.image))
            }
        });

        if (!session) {
            return res.status(400).json({ success: false, message: "Error while creating session" });
        }

        await order.save();

        return res.status(200).json({ session });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);

        if (!menuItem) throw new Error(`Menu item id not found`);

        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image]
                },
                unit_amount: Math.round(menuItem.price * 100) // amount in paise
            },
            quantity: cartItem.quantity
        };
    });

    return lineItems;
};
