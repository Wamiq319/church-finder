import mongoose, { Schema, Document, Model } from "mongoose";
import { ChurchData } from "@/types/church.type";

// Extend ChurchData with MongoDB Document properties
interface IChurch extends ChurchData, Document {
  slug: string;
  status: "published" | "draft" | "archived";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isCurrentlyFeatured(): boolean;
  getFullAddress(): string;
  getCoordinates(): [number, number] | null;
}

const churchSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    denomination: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String,
      trim: true 
    },
    address: { 
      type: String, 
      required: true,
      trim: true 
    },
    state: { 
      type: String, 
      required: true,
      trim: true 
    },
    city: { 
      type: String, 
      required: true,
      trim: true 
    },
    pastorName: { 
      type: String, 
      required: true,
      trim: true 
    },
    pastorEmail: { 
      type: String,
      trim: true,
      lowercase: true 
    },
    pastorPhone: { 
      type: String,
      trim: true 
    },
    contactEmail: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true 
    },
    contactPhone: { 
      type: String, 
      required: true,
      trim: true 
    },
    services: [{ 
      type: String, 
      required: true,
      trim: true 
    }],
    image: { 
      type: String 
    },
    latitude: { 
      type: Number 
    },
    longitude: { 
      type: Number 
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published"
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better query performance
churchSchema.index({ name: 'text', denomination: 'text', description: 'text' });
churchSchema.index({ state: 1, city: 1 });
churchSchema.index({ isFeatured: 1 });
churchSchema.index({ status: 1 });

// Add a pre-save middleware to generate slug
churchSchema.pre<IChurch>('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
    
  next();
});

// Add a method to check if church is featured
churchSchema.methods.isCurrentlyFeatured = function(this: IChurch): boolean {
  return this.isFeatured === true;
};

// Add a method to get full address
churchSchema.methods.getFullAddress = function(this: IChurch): string {
  return `${this.address}, ${this.city}, ${this.state}`;
};

// Add a method to get coordinates
churchSchema.methods.getCoordinates = function(this: IChurch): [number, number] | null {
  if (this.latitude && this.longitude) {
    return [this.latitude, this.longitude];
  }
  return null;
};

// Create and export the model
const Church = (mongoose.models.Church as Model<IChurch>) || 
  mongoose.model<IChurch>("Church", churchSchema);

export default Church;
