import mongoose, { Schema, Document, Model } from "mongoose";

interface IEvent extends Document {
  church: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  date: string;
  time: string;
  location?: string;
  image?: string;
  organizer?: string;
  description?: string;
  featured: boolean;
  featuredExpiresAt?: Date;
  status: "published" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema: Schema = new Schema(
  {
    church: {
      type: Schema.Types.ObjectId,
      ref: "Church",
      required: true,
    },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: String,
    time: String,
    location: String,
    image: String,
    organizer: String,
    description: String,
    featured: {
      type: Boolean,
      default: false,
    },
    featuredExpiresAt: Date,
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published",
    },
  },
  { timestamps: true }
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
