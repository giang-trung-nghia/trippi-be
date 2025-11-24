import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { typeOrmConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsModule } from '@/modules/trips/trips.module';
import { TripDaysModule } from '@/modules/trip-days/trip-days.module';
import { TripItemsModule } from '@/modules/trip-items/trip-items.module';
import { TripMembersModule } from '@/modules/trip-members/trip-members.module';
import { GeoModule } from '@/modules/geos/geo.module';
import { GeoTypesModule } from '@/modules/geo-types/geo-types.module';
import { GeoPhotosModule } from '@/modules/geo-photos/geo-photos.module';
import { AuthProvidersModule } from '@/modules/auth-providers/auth-providers.module';
import { GoogleAuthModule } from '@/modules/auth/google/google-auth.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [() => typeOrmConfig],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    TripsModule,
    TripDaysModule,
    TripItemsModule,
    TripMembersModule,
    GeoModule,
    GeoTypesModule,
    GeoPhotosModule,
    AuthProvidersModule,
    GoogleAuthModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
