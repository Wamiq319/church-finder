import { z } from "zod";
import { objectIdSchema } from "./common";

export const paymentSchema = z.object({
  type: z.enum(["church_feature", "event_feature"]),
  itemId: objectIdSchema,
  paymentMethod: z.string().min(1, "Required"),
  amount: z.number().positive(),
  currency: z.literal("USD"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
