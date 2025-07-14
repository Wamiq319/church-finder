import mongoose, { Schema, Model, Document } from "mongoose";
import type { Event as EventType } from "@/types";

const eventSchema: Schema = new Schema(
  {
    church: {
      type: Schema.Types.ObjectId,
      ref: "Church",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
      min: 1,
      max: 2,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    featuredUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for better query performance
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ church: 1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ date: 1 });

// Remove the pre-save middleware for slug generation

// Create and export the model
export const Event: Model<EventType & Document> =
  mongoose.models.Event ||
  mongoose.model<EventType & Document>("Event", eventSchema);
