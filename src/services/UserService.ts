import createHttpError from "http-errors";
import prisma from "../lib/prisma";
import { UserData } from "../types/inedex";
import bcrypt from "bcrypt";

export class UserService {
    async create({ userName, email, password }: UserData) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                const error = createHttpError(400, "Email is already exist");
                throw error;
            }

            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(password, saltRound);

            return await prisma.user.create({
                data: {
                    userName,
                    email,
                    password: hashedPassword,
                },
            });
        } catch {
            const error = createHttpError(500, "Failed to store in database");
            throw error;
        }
    }
}
