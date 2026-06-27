import path from "node:path";
import { config } from "dotenv";

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

const { PORT, DATABASE_URL } = process.env;

const Config = {
    PORT,
    DATABASE_URL,
};

export default Config;
