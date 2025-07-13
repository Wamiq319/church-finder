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

export type EventData = {
  id: string;
  churchId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  slug: string;
  organizer: string;
  description: string;
  featured: boolean;
};
