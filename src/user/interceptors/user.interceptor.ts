import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.authorization?.split('Bearer ')[1];
        // console.log({request});
        // console.log({token});
        const user = jwt.decode(token);
        request.user = user;
        return next.handle();
    }
}