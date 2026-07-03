import app from "./app";
import Config from "./config/env";
import prisma from "./lib/prisma";

async function StartServer() {
    try {
        await prisma.$connect();

        await prisma.user.count();
        console.log("Database connected successfully");

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
