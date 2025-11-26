import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { CreateTripMemberDto } from '@/modules/trip-members/dtos/create-trip-member.dto';
import { UpdateTripMemberDto } from '@/modules/trip-members/dtos/update-trip-member.dto';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { User } from '@/modules/users/entities/user.entity';
import { BaseService } from '@/modules/base/base.service';

@Injectable()
export class TripMembersService extends BaseService<
  TripMember,
  CreateTripMemberDto,
  UpdateTripMemberDto
> {
  constructor(
    @InjectRepository(TripMember)
    private readonly tripMemberRepository: Repository<TripMember>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(tripMemberRepository, 'TripMember');
  }

  async create(createDto: CreateTripMemberDto): Promise<TripMember> {
    const [trip, user] = await Promise.all([
      this.findTrip(createDto.tripId),
      this.findUser(createDto.userId),
    ]);
    const { ...rest } = createDto;
    return super.create({
      ...rest,
      trip,
      user,
    } as unknown as CreateTripMemberDto);
  }

  async update(
    id: string,
    updateDto: UpdateTripMemberDto,
  ): Promise<TripMember> {
    const payload: Record<string, unknown> = { ...updateDto };
    if (updateDto.tripId) {
      payload.trip = await this.findTrip(updateDto.tripId);
    }
    if (updateDto.userId) {
      payload.user = await this.findUser(updateDto.userId);
    }
    return super.update(id, payload as UpdateTripMemberDto);
  }

  private async findTrip(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
