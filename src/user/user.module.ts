import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaModule } from "../database/prisma.module";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";

@Module({
    imports: [PrismaModule],
    controllers: [UserController, AuthController],
    providers: [UserService, AuthService]
})
export class UserModule {

}