import { z } from "zod";

// Helper schemas
const emailSchema = z.string().email("Invalid email").min(5).max(100);

// Signup schema with strong password requirements
export const signupSchema = z
  .object({
    email: emailSchema,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password cannot exceed 50 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Signin schema
export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Required"),
});

// Validation functions
export const validateSignup = (data: any) => {
  return signupSchema.safeParse(data);
};

export const validateSignin = (data: any) => {
  return signinSchema.safeParse(data);
};
