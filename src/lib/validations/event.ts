import { z } from "zod";

const imageSchema = z
  .string()
  .url("Invalid image URL")
  .refine(
    (url) => url.startsWith("data:image/") || url.startsWith("https://"),
    {
      message: "Image must be a valid URL or data URL",
    }
  );

export const eventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  address: z
    .string()
    .max(200, "Address cannot exceed 200 characters")
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  time: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  image: imageSchema,
  featured: z.boolean().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
