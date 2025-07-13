import { z } from "zod";
import { objectIdSchema } from "./common";

export const paymentSchema = z.object({
  type: z.enum(["church_feature", "event_feature"]),
  itemId: objectIdSchema,
  paymentMethod: z.string().min(1, "Required"),
  amount: z.number().positive(),
  currency: z.literal("USD"),
});

// Validation function
export const validatePayment = (data: any) => {
  return paymentSchema.safeParse(data);
};
