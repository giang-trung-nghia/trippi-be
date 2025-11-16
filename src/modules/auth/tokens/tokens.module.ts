import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokensService } from '@/modules/auth/tokens/tokens.service';
import { TokensController } from '@/modules/auth/tokens/tokens.controller';
import { UsersModule } from '@/modules/users/users.module';
import { JwtStrategy } from '@/common/strategies/jwt.strategy';

@Module({
  imports: [ConfigModule, NestJwtModule.register({}), UsersModule],
  controllers: [TokensController],
  providers: [TokensService, JwtStrategy],
  exports: [TokensService, JwtStrategy],
})
export class TokensModule {}

