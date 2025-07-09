import mongoose from "mongoose";

export type Event = {
  _id: mongoose.Types.ObjectId;
  church: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  address?: string;
  date: string;
  time: string;
  description: string;
  image: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};
