import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { uploadImageOnCloudinary } from "../utils/cloudianry_functions";
import { deleteImageOnCloudinary } from "../utils/cloudianry_functions";
import { Order } from "../models/order.model";
import { error } from "console";
import { Query } from "mongoose";
import { Menu } from "../models/menu.model";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("Create Restaurant");

    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;

    const file = req.file;

    const restaurant = await Restaurant.findOne({ user: req.id });
    if (restaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already exist for this user",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required!",
      });
    }

    const imageUrl = await uploadImageOnCloudinary(file);

    if (!imageUrl) {
      return res
        .status(400)
        .json({ message: "Error while uploading the banner on cloudinary!" });
    }

    await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      country,
      deliveryTime,
      cuisines: JSON.parse(cuisines),
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error! " });
  }
};

export const getAllRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json({ success: true, restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return res.status(500).json({ success: false, message: "Server Error!" });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id }).populate(
      "menus"
    );
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        restaurnat: [],
        message: "Restaurant not found!",
      });
    }
    return res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found!",
      });
    }
    restaurant.restaurantName = restaurantName;
    restaurant.city = city;
    restaurant.country = country;
    (restaurant.deliveryTime = deliveryTime),
      (restaurant.cuisines = JSON.parse(cuisines));

    if (file) {
      const oldFile = restaurant.imageUrl;
      const imageUrl = await uploadImageOnCloudinary(file);
      restaurant.imageUrl = imageUrl;
      deleteImageOnCloudinary(oldFile);
    }

    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant updated",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error! " });
  }
};

export const getRestaurantOrder = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error! " });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log(orderId);
    console.log(status);
    
    
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    order.status = status;
    await order.save();
    return res.status(300).json({
      success: true,
      status: order.status,
      message: "Status updated succesfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!" });
  }
};

export const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const searchText = req.params.searchText || "";
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = ((req.query.selectedCuisines as string) || "")
      .split(",")
      .filter((cuisine) => cuisine);

    const query: any = {};
    const searchTerm = searchQuery || searchText;

    // Check for matching cuisine
    const cuisineMatch = searchTerm
      ? await Restaurant.findOne({
          cuisines: { $regex: searchTerm, $options: "i" },
        })
      : null;

    if (cuisineMatch) {
      // Search menu if cuisine matches
      const menu = await Menu.find({
        name: { $regex: searchTerm, $options: "i" },
      });

      if (menu.length > 0) {
        return res
          .status(200)
          .json({ success: true, isMenu: true, data: menu });
      }

      // If no menu found, fall through to restaurant search
    }

    // Build OR query if search term exists
    if (searchTerm) {
      query.$or = [
        { restaurantName: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } },
        { country: { $regex: searchTerm, $options: "i" } },
        { cuisines: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Apply cuisine filters if any selected
    if (selectedCuisines.length > 0) {
      query.cuisines = { $in: selectedCuisines };
    }

    const restaurants = await Restaurant.find(query);

    return res.status(200).json({
      success: true,
      isMenu: false,
      data: restaurants,
    });
  } catch (error) {
    console.error("Error in searchRestaurant:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSingleRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: { createdAt: -1 },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found!",
      });
    }

    return res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error! " });
  }
};
