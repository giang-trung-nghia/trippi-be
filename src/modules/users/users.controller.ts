import { Controller } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dtos/update-user.dto';
import { BaseController } from '@/modules/base/base.controller';
import { User } from '@/modules/users/entities/user.entity';

@Controller('api/v1/users')
export class UsersController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(protected readonly usersService: UsersService) {
    super(usersService);
  }
}
