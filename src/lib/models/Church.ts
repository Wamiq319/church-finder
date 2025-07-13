import mongoose, { Schema, Model, Document } from "mongoose";
import type { Church } from "@/types";
import { slugify } from "@/utils/slugify";

interface IChurch extends Church, Document {
  slug: string;
  createdBy: mongoose.Types.ObjectId;
  events?: mongoose.Types.ObjectId[];
  isCurrentlyFeatured(): boolean;
  getFullAddress(): string;
  getCoordinates(): [number, number] | null;
}

const churchSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: "",
    },
    denomination: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    pastorName: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    pastorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    pastorPhone: {
      type: String,
      trim: true,
      default: "",
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "",
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    services: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    image: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: {
      type: Date,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    step: {
      type: Number,
      default: 1,
      min: 1,
      max: 4,
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for better query performance
churchSchema.index({ name: "text", denomination: "text", description: "text" });
churchSchema.index({ state: 1, city: 1 });
churchSchema.index({ isFeatured: 1 });
churchSchema.index({ status: 1 });

// Add virtual field for location
churchSchema.virtual("location").get(function (this: IChurch) {
  return `${this.city}, ${this.state}`;
});

// Add a pre-save middleware to generate slug
churchSchema.pre<IChurch>("save", function (next) {
  if (!this.isModified("name")) return next();

  this.slug = slugify(this.name);

  next();
});

// Add a method to check if church is featured
churchSchema.methods.isCurrentlyFeatured = function (this: IChurch): boolean {
  return this.isFeatured === true;
};

// Add a method to get full address
churchSchema.methods.getFullAddress = function (this: IChurch): string {
  return `${this.address}, ${this.city}, ${this.state}`;
};

// Add a method to get coordinates
churchSchema.methods.getCoordinates = function (
  this: IChurch
): [number, number] | null {
  if (this.latitude && this.longitude) {
    return [this.latitude, this.longitude];
  }
  return null;
};

// Create and export the model
const Church =
  (mongoose.models.Church as Model<IChurch>) ||
  mongoose.model<IChurch>("Church", churchSchema);

export default Church;
