import { Request, Response, NextFunction } from "express";
import z from "zod";

export const queryValidator = <T extends z.ZodType>(schema: T) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return res.status(400).json({ errors: result.error.issues });
        }

        res.locals.validatedQuery = result.data;
        next();
    };
};
