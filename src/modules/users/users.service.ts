import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/users/entities/user.entity';
import { BaseService } from '@/modules/base/services/base.service';

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository, 'User');
  }

  async create(createDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createDto.password);
    return super.create({
      ...createDto,
      password: hashedPassword,
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(this.notFoundMessage);
    return user;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const dto: UpdateUserDto = { ...updateDto };
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }
    return super.update(id, dto);
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
