import mongoose from "mongoose";
import { Cart } from "../../models/cart.model";

export const findCartByUserId = async (userId: string) => {
  return Cart.findOne({
    user: new mongoose.Types.ObjectId(userId),
  });
};

export const createCart = async (userId: string) => {
  const [cart] = await Cart.create([
    {
      user: new mongoose.Types.ObjectId(userId),
      items: [],
    },
  ]);

  return cart;
};

export const saveCart = async (cart: any) => {
  return cart.save();
};

export const getPopulatedCart = async (userId: string) => {
  return Cart.findOne({
    user: new mongoose.Types.ObjectId(userId),
  }).populate({
    path: "items.product",
    select: "name price images stock reservedStock isActive",
  });
};