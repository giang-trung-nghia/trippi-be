import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { User } from '@/modules/users/entities/user.entity';
import { TripMembersService } from '@/modules/trip-members/trip-members.service';
import { TripMembersController } from '@/modules/trip-members/trip-members.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TripMember, Trip, User])],
  controllers: [TripMembersController],
  providers: [TripMembersService],
  exports: [TripMembersService],
})
export class TripMembersModule {}
