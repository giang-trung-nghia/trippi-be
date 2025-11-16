import { Controller } from '@nestjs/common';
import { BaseController } from '@/modules/base/base.controller';
import { AuthProvider } from '@/modules/auth-providers/entities/auth-provider.entity';
import { CreateAuthProviderDto } from '@/modules/auth-providers/dtos/create-auth-provider.dto';
import { UpdateAuthProviderDto } from '@/modules/auth-providers/dtos/update-auth-provider.dto';
import { AuthProvidersService } from '@/modules/auth-providers/auth-providers.service';

@Controller('api/v1/auth-providers')
export class AuthProvidersController extends BaseController<
  AuthProvider,
  CreateAuthProviderDto,
  UpdateAuthProviderDto
> {
  constructor(
    protected readonly authProvidersService: AuthProvidersService,
  ) {
    super(authProvidersService);
  }
}

