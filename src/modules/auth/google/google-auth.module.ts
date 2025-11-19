import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthController } from '@/modules/auth/google/google-auth.controller';
import { GoogleAuthService } from '@/modules/auth/google/google-auth.service';
import { GoogleStrategy } from '@/common/strategies/google.strategy';
import { AuthProvidersModule } from '@/modules/auth-providers/auth-providers.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    AuthProvidersModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy],
})
export class GoogleAuthModule {}

