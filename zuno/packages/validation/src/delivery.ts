import { z } from "zod";

export const deliveryStatusUpdateSchema = z.object({
  delivery_id: z.string().uuid(),
  status: z.enum(["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY", "COMPLETED", "FAILED"]),
});
