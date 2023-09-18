import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GenerateProdKeyDto, SigninDto, SignupDto } from '../dto/auth.dto';
import * as argon2 from 'argon2';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}
  async signup(signupBody: SignupDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: signupBody.email,
      },
    });
    // console.log({ userExists });
    if (userExists) {
      throw new ConflictException();
    }

    const hashedPassword = await argon2.hash(signupBody.password);

    const user = await this.prisma.user.create({
      data: {
        email: signupBody.email,
        name: signupBody.name,
        phone_number: signupBody.phone,
        password: hashedPassword,
        user_type: signupBody.userType,
      },
    });

    const token = await this.generateJWT(signupBody.name, user.id);

    return token;
  }

  async signin(signinBody: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signinBody.email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const hashedPassword = user.password;

    const isValidpassword = await argon2.verify(
      hashedPassword,
      signinBody.password,
    );

    if (!isValidpassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    const token = await this.generateJWT(user.name, user.id);

    return token;
  }

  private async generateJWT(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      this.config.get('JWT_SECRET'),
      {
        expiresIn: 9600,
      },
    );
  }

  generateProductKey(email: string, userType: UserType) {
    const prodkey = this.config.get('PRODUCT_KEY_SECRET');

    const string = `${email}-${userType}-${prodkey}`;

    return argon2.hash(string);
  }
}
