import app from "./app";
import Config from "./config/env";

function main() {
    try {
        app.listen(Config.PORT, () => {
            console.log(`Server listening on PORT:${Config.PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
