import {
  Body,
  Controller,
  Post,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProdKeyDto, SigninDto, SignupDto } from '../dto/auth.dto';
import { UserType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('signup/:userType')
  async signup(
    @Body() signupBody: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!signupBody.productKey) {
        throw new UnauthorizedException('No product key provided');
      }

      const validProductKey = `${
        signupBody.email
      }-${userType}-${this.config.get('PRODUCT_KEY_SECRET')}`;

      const isValidProductKey = await argon2.verify(
        signupBody.productKey,
        validProductKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException('Invalid product key');
      }
    }

    return this.authService.signup(signupBody, userType);
  }

  @Post('signin')
  signin(@Body() signinBody: SigninDto) {
    return this.authService.signin(signinBody);
  }

  @Post('key')
  generateProductKey(@Body() { email, userType }: GenerateProdKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
