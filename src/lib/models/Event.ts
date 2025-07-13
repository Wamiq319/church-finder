import mongoose, { Schema, Model, Document } from "mongoose";
import type { Event } from "@/types";
import { slugify } from "@/utils/slugify";

interface IEvent extends Event, Document {
  // Additional methods can be added here if needed
}

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

// Add a pre-save middleware to generate slug
eventSchema.pre<IEvent>("save", async function (next) {
  if (!this.isModified("title")) return next();

  let baseSlug = slugify(this.title);
  let slug = baseSlug;
  let count = 1;

  // Ensure uniqueness
  while (await mongoose.models.Event.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }
  this.slug = slug;
  next();
});

// Create and export the model
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
