// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // NextAuth standard field (string)
    _id: mongoose.Types.ObjectId; // MongoDB field
    email: string;
    role: "admin" | "church_admin" | "user";
    church?: mongoose.Types.ObjectId;
    churchStatus?: string | null;
    churchStep?: number | null;
  }

  interface Session {
    user: {
      id: string;
      _id: string;
      email: string;
      role: "admin" | "church_admin" | "user";
      church?: string;
      churchStatus?: string | null;
      churchStep?: number | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    _id: string;
    email: string;
    role: "admin" | "church_admin" | "user";
    church?: string;
    churchStatus?: string | null;
    churchStep?: number | null;
  }
}
