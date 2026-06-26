import { config } from "dotenv";

config();

const { PORT } = process.env;

const Config = {
    PORT,
};

export default Config;
