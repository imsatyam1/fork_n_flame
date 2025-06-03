import { Request, Response } from "express";
import { deleteImageOnCloudinary, uploadImageOnCloudinary } from "../utils/cloudianry_functions";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose, { ObjectId } from "mongoose";

export const addMenu = async (req: Request, res: Response) => {
  try {
    const { theme, name, description, price } = req.body;
    console.log(req.body);
    
    const file = req.file;
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Image is required!",
      });
    }
    const imageUrl = await uploadImageOnCloudinary(file);

    const menu: any = await Menu.create({
      theme,
      name,
      description,
      price,
      image: imageUrl,
    });

    const restaurant = await Restaurant.findOne({user: req.id });
    if(restaurant){
        (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
        await restaurant.save();
    }

    return res.status(201).json({
        success: true,
        message: "Menu added successfully!"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error!"})
  }
};

export const editMenu = async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const { name, description, price } = req.body;
        const file = req.file;
        const menu = await Menu.findById(id);

        if(!menu){
            return res.status(404).json({
                success: false,
                message: "Menu not found!"
            })
        }
        if(name) menu.name = name;
        if(description) menu.description = description;
        if(price) menu.price = price;

        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();

        return res.status(200).json({
            success: true,
            message: "Menu updated",
            menu
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server error"});
    }
}

export const getAllMenus = async(req: Request, res: Response) => {
  try {
    const menus = await Menu.find();
    res.status(201).json( {success: true ,menus});
  } catch (error) {
    res.status(500).json({message: "Server Error!!"});
  }
}
