import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProvider } from '@/modules/auth-providers/entities/auth-provider.entity';
import { AuthProvidersService } from '@/modules/auth-providers/auth-providers.service';
import { AuthProvidersController } from '@/modules/auth-providers/auth-providers.controller';
import { User } from '@/modules/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthProvider, User])],
  controllers: [AuthProvidersController],
  providers: [AuthProvidersService],
  exports: [AuthProvidersService],
})
export class AuthProvidersModule {}

