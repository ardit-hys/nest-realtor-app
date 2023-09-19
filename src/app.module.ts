import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    HomeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
