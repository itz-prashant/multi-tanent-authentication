import z from "zod";
import { Role } from "../generated/prisma/enums";

export const userQuerySchema = z.object({
    q: z.string().optional().default(""),
    role: z.enum(Role).optional(),
    currentPage: z.coerce.number().default(1),
    perPage: z.coerce.number().default(6),
});
