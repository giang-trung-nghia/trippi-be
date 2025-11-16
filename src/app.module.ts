import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { typeOrmConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsModule } from '@/modules/trips/trips.module';
import { ItinerariesModule } from '@/modules/itineraries/itineraries.module';
import { GeoModule } from '@/modules/geos/geo.module';
import { GeoTypesModule } from '@/modules/geo-types/geo-types.module';
import { AuthProvidersModule } from '@/modules/auth-providers/auth-providers.module';
import { GoogleAuthModule } from '@/modules/auth/google/google-auth.module';
import { TokensModule } from '@/modules/auth/tokens/tokens.module';

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
    ItinerariesModule,
    GeoModule,
    GeoTypesModule,
    AuthProvidersModule,
    GoogleAuthModule,
    TokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
