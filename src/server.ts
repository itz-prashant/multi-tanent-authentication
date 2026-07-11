import app from "./app";
import Config from "./config/env";
import { createDefaultAdmin } from "./lib/createDefaultAdmin";
import prisma from "./lib/prisma";
import { UserService } from "./services/UserService";

const userService = new UserService();

async function StartServer() {
    try {
        await prisma.$connect();

        await prisma.user.count();
        console.log("Database connected successfully");
        await createDefaultAdmin(userService);
        app.listen(Config.PORT, () => {
            console.log(`Server listening on PORT:${Config.PORT}`);
        });
    } catch (error) {
        console.error(error);
        await prisma.$disconnect().catch(() => {});
        process.exit(1);
    }
}

void StartServer();
