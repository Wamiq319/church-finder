import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Validate with Zod
    const { email, password } = signupSchema.parse(body);

    console.log("=== Registration Debug Info ===");
    console.log("Email:", email);
    console.log("Password before hashing:", password);
    console.log("Password length:", password.length);

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed password:", hashedPassword);
    // console.log("Hashed password length:", hashedPassword.length);

    // Create new user
    const newUser = await User.create({
      email,
      password, // Using plain password temporarily
      role: "church_admin",
    });

    console.log("User created successfully with ID:", newUser._id);
    console.log("=== End Registration Debug Info ===");

    // Return user in frontend format
    const userResponse = {
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      church: newUser.church?.toString(),
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return NextResponse.json({ data: userResponse }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
