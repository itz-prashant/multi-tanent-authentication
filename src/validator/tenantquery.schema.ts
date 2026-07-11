import z from "zod";

export const tenantQuerySchema = z.object({
    q: z.string().optional().default(""),
    currentPage: z.coerce.number().default(1),
    perPage: z.coerce.number().default(6),
});
