import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { SigninDto, SignupDto } from "./dto/auth.dto";

@Controller('auth')
export class UserController {
    
}