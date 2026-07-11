import createHttpError from "http-errors";
import prisma from "../lib/prisma";
import { LimitedUserData, UserData, UserQueryParams } from "../types/inedex";
import bcrypt from "bcrypt";
import { Prisma, Role } from "../generated/prisma/client";

export class UserService {
    async create({ userName, email, password, role, tenantId }: UserData) {
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
                    role: role,
                    tenantId,
                },
            });
        } catch {
            const error = createHttpError(500, "Failed to store in database");
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                userName: true,
                email: true,
                role: true,
            },
        });
    }

    async getAll(validateQuery: UserQueryParams) {
        const where: Prisma.UserWhereInput = {
            role: {
                not: Role.CUSTOMER,
            },
        };

        if (validateQuery.q) {
            where.OR = [
                {
                    userName: {
                        contains: validateQuery.q,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: validateQuery.q,
                        mode: "insensitive",
                    },
                },
            ];
        }

        if (validateQuery.role) {
            where.role = validateQuery.role;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    role: true,
                    tenant: true,
                },
                skip: (validateQuery.currentPage - 1) * validateQuery.perPage,
                take: validateQuery.perPage,
                orderBy: {
                    id: "desc",
                },
            }),
            prisma.user.count({ where }),
        ]);

        return [users, total];
    }

    async update(id: string, userData: LimitedUserData) {
        return await prisma.user.update({
            where: { id },
            data: {
                userName: userData.userName,
                email: userData.email,
                role: userData.role,
            },
        });
    }

    async deleteById(id: string) {
        return await prisma.user.delete({
            where: { id },
        });
    }
}
