import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/),
  description: z.string().max(500).optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
