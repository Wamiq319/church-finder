import mongoose from "mongoose";

export type User = {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: "admin" | "church_admin" | "user";
  church?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
