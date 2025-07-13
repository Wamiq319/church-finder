import mongoose, { Schema, Model, Document } from "mongoose";
import type { Event } from "@/types";
import { slugify } from "@/utils/slugify";

interface IEvent extends Omit<Event, "_id">, Document {
  // Additional methods can be added here if needed
}

const eventSchema: Schema = new Schema(
  {
    church: {
      type: Schema.Types.ObjectId,
      ref: "Church",
      required: true,
    },
    title: { type: String, required: true },
    slug: { type: String },
    address: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    featured: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    featuredUntil: {
      type: Date,
    },
  },
  { timestamps: true }
);

eventSchema.pre<IEvent>("save", async function (next) {
  if (!this.isModified("title") && this.slug) return next();

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

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
