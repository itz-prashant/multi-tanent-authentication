import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import AuthRouter from "./routes/auth";
import cookieParse from "cookie-parser";

const app = express();

app.use(express.static("public", { dotfiles: "allow" }));
app.use(cookieParse());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to auth service");
});

app.use("/auth", AuthRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    void next;
    console.error(err.message);
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
