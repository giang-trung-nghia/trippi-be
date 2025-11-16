import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/modules/base/services/base.service';
import { AuthProvider } from '@/modules/auth-providers/entities/auth-provider.entity';
import { CreateAuthProviderDto } from '@/modules/auth-providers/dtos/create-auth-provider.dto';
import { UpdateAuthProviderDto } from '@/modules/auth-providers/dtos/update-auth-provider.dto';
import { User } from '@/modules/users/entities/user.entity';
import { AuthProviderEnum } from '@/common/enums/auth-provider.enum';

@Injectable()
export class AuthProvidersService extends BaseService<
  AuthProvider,
  CreateAuthProviderDto,
  UpdateAuthProviderDto
> {
  constructor(
    @InjectRepository(AuthProvider)
    private readonly authProviderRepository: Repository<AuthProvider>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(authProviderRepository, 'AuthProvider');
  }

  async create(createDto: CreateAuthProviderDto): Promise<AuthProvider> {
    const user = await this.findUser(createDto.userId);
    const { userId, ...rest } = createDto;
    const payload: Omit<CreateAuthProviderDto, 'userId'> & { user: User } = {
      ...rest,
      user,
    };
    return this.authProviderRepository.save(payload as unknown as AuthProvider);
  }

  //   async update(
  //     id: string,
  //     updateDto: UpdateAuthProviderDto,
  //   ): Promise<AuthProvider> {
  //     const { ...rest } = updateDto;
  //     const payload: UpdateAuthProviderDto & { user?: User } = { ...rest };

  //     return super.update(id, payload);
  //   }

  async findByProviderAccount(
    provider: AuthProviderEnum,
    providerUserId: string,
  ): Promise<AuthProvider | null> {
    return this.authProviderRepository.findOne({
      where: { provider, providerUserId },
      relations: ['user'],
    });
  }

  async findByEmail(email: string): Promise<AuthProvider | null> {
    return this.authProviderRepository.findOne({
      where: { email },
      relations: ['user'],
    });
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
