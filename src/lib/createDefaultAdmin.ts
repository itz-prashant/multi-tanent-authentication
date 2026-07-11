import { Role } from "../generated/prisma/enums";
import { UserService } from "../services/UserService";

export const createDefaultAdmin = async (userService: UserService) => {
    const admin = await userService.findByEmail("admin@gmail.com");

    if (admin) {
        console.debug("Admin already exist");
        return;
    }

    await userService.create({
        userName: "Admin",
        email: "admin@gmail.com",
        password: "123456789",
        role: Role.ADMIN,
    });
    console.log("Default admin created successfully");
};
