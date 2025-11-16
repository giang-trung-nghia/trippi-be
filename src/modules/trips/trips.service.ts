import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { CreateTripDto } from '@/modules/trips/dtos/create-trip.dto';
import { UpdateTripDto } from '@/modules/trips/dtos/update-trip.dto';
import { User } from '@/modules/users/entities/user.entity';
import { BaseService } from '@/modules/base/services/base.service';

@Injectable()
export class TripsService extends BaseService<
  Trip,
  CreateTripDto,
  UpdateTripDto
> {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(tripRepository, 'Trip');
  }

  async create(createDto: CreateTripDto): Promise<Trip> {
    const user = await this.findUser(createDto.userId);
    const { userId, ...rest } = createDto;
    return super.create({
      ...rest,
      user,
      startDate: new Date(rest.startDate),
      endDate: new Date(rest.endDate),
    } as unknown as CreateTripDto);
  }

  async update(id: string, updateDto: UpdateTripDto): Promise<Trip> {
    const { userId, ...rest } = updateDto;
    const payload: Record<string, unknown> = { ...rest };

    if (rest.startDate) {
      payload.startDate = new Date(rest.startDate);
    }
    if (rest.endDate) {
      payload.endDate = new Date(rest.endDate);
    }

    if (userId) {
      payload.user = await this.findUser(userId);
    }

    return super.update(id, payload as UpdateTripDto);
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

