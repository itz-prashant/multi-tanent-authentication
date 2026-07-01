import { z } from "zod";

export const tenantSchema = z.object({
    name: z.string().min(3).max(100),
    address: z.string().min(3).max(255),
});
