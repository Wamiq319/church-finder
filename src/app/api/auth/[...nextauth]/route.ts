import NextAuth from "next-auth";
import dbConnect from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { signinSchema } from "@/lib/validations/auth";
import type { NextAuthOptions } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorization attempt with credentials:", credentials);
          await dbConnect();
          console.log("Database connected");

          // Validate credentials
          const result = signinSchema.safeParse(credentials);
          console.log("Validation result:", result);

          if (!result.success) {
            console.log("Validation failed:", result.error);
            throw new Error(result.error.errors[0]?.message || "Invalid input");
          }

          const { email, password } = result.data;
          console.log("Looking for user:", email);

          // Find user with password
          const user = await User.findOne({ email }).select("+password");
          console.log("User found:", user ? user.email : "No user found");

          if (!user) {
            throw new Error("Email not registered");
          }

          console.log("Comparing password...");
          const isPasswordValid = await bcrypt.compare(password, user.password);
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }

          // Get church details if exists
          let churchDetails = null;
          if (user.church) {
            const Church = (await import("@/lib/models/Church")).default;
            churchDetails = await Church.findById(user.church);
          }

          // Return user data without password
          return {
            id: user._id.toString(),
            _id: user._id,
            email: user.email,
            role: user.role,
            church: user.church,
            churchStatus: churchDetails?.status || null,
            churchStep: churchDetails?.step || null,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist only email and id in the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Add only email and id to the session
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
