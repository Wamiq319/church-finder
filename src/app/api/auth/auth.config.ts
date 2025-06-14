import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { signinSchema } from "@/lib/validations/auth";

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
          await dbConnect();

          const result = signinSchema.safeParse(credentials);

          if (!result.success) {
            throw new Error(result.error.errors[0]?.message || "Invalid input");
          }

          const { email, password } = result.data;

          const user = await User.findOne({ email }).select("+password");

          if (!user) {
            throw new Error("Email not registered");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }

          let churchDetails = null;
          if (user.church) {
            const Church = (await import("@/lib/models/Church")).default;
            churchDetails = await Church.findById(user.church);
          }

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
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
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
