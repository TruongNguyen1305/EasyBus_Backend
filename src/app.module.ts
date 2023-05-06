import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BusStationModule } from './busStation/busStation.module';
import { BusModule } from './bus/bus.module';
import { RouteModule } from './route/route.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    RouteModule,
    BusStationModule,
    BusModule,
    PrismaModule
  ]
})
export class AppModule {}
