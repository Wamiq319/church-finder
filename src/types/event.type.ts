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
  step: number;
  status: "draft" | "published";
  featuredUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
};
