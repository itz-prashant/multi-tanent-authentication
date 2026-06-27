import { z } from "zod";

export const registerSchema = z.object({
    userName: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;
