import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthController } from '@/modules/auth/google/google-auth.controller';
import { GoogleAuthService } from '@/modules/auth/google/google-auth.service';
import { GoogleStrategy } from '@/common/strategies/google.strategy';
import { AuthProvidersModule } from '@/modules/auth-providers/auth-providers.module';
import { UsersModule } from '@/modules/users/users.module';
import { TokensModule } from '@/modules/auth/tokens/tokens.module';
import { JwtStrategy } from '@/common/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    AuthProvidersModule,
    UsersModule,
    TokensModule,
  ],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy],
})
export class GoogleAuthModule {}

