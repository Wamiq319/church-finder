import { z } from "zod";

// Helper schemas
const phoneSchema = z
  .string()
  .regex(
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    "Invalid phone number format"
  );

const emailSchema = z.string().email("Invalid email address");

const imageSchema = z
  .string()
  .url("Invalid image URL")
  .refine(
    (url) => url.startsWith("data:image/") || url.startsWith("https://"),
    {
      message: "Image must be a valid URL or data URL",
    }
  )
  .optional();

// Step 1: Basic Information
export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(3, "Church name must be at least 3 characters")
    .max(100, "Church name cannot exceed 100 characters"),
  denomination: z
    .string()
    .min(2, "Denomination must be at least 2 characters")
    .max(50, "Denomination cannot exceed 50 characters"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  image: imageSchema,
});

// Step 2: Location Details
export const locationSchema = z.object({
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
});

// Step 3: Contact & Services
export const contactSchema = z.object({
  pastorName: z
    .string()
    .min(3, "Pastor name must be at least 3 characters")
    .max(100, "Pastor name cannot exceed 100 characters"),
  pastorEmail: emailSchema.optional(),
  pastorPhone: phoneSchema.optional(),
  contactEmail: emailSchema,
  contactPhone: phoneSchema,
  website: z.string().url("Invalid website URL").optional(),
  services: z
    .array(
      z
        .string()
        .min(5, "Service description must be at least 5 characters")
        .max(100, "Service description cannot exceed 100 characters")
    )
    .nonempty("At least one service time is required"),
});

// Step 4: Promotion (optional)
export const promotionSchema = z.object({
  isFeatured: z.boolean().default(false),
});

// Complete Church Schema
export const churchSchema = basicInfoSchema
  .merge(locationSchema)
  .merge(contactSchema)
  .merge(promotionSchema);

// Validation functions for each step
export const validateBasicInfo = (data: any) => {
  return basicInfoSchema.safeParse(data);
};

export const validateLocation = (data: any) => {
  return locationSchema.safeParse(data);
};

export const validateContact = (data: any) => {
  return contactSchema.safeParse(data);
};

export const validatePromotion = (data: any) => {
  return promotionSchema.safeParse(data);
};
