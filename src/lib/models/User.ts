import mongoose, { Schema, Model, Document } from "mongoose";
import type { User } from "@/types";
// import bcrypt from "bcryptjs"; // Commented out temporarily

interface IUser extends User, Document {
  // Additional methods can be added here if needed
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      // select: false, // Commented out temporarily to allow password retrieval
    },
    role: {
      type: String,
      enum: ["user", "church_admin", "admin"],
      default: "user",
    },
    church: {
      type: Schema.Types.ObjectId,
      ref: "Church",
      default: null,
    },
  },
  { timestamps: true }
);

// Commented out password hashing middleware temporarily
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
