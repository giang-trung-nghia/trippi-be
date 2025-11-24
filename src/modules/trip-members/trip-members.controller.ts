import { Controller } from '@nestjs/common';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { CreateTripMemberDto } from '@/modules/trip-members/dtos/create-trip-member.dto';
import { UpdateTripMemberDto } from '@/modules/trip-members/dtos/update-trip-member.dto';
import { TripMembersService } from '@/modules/trip-members/trip-members.service';
import { BaseController } from '@/modules/base/base.controller';

@Controller('api/v1/trip-members')
export class TripMembersController extends BaseController<
  TripMember,
  CreateTripMemberDto,
  UpdateTripMemberDto
> {
  constructor(protected readonly tripMembersService: TripMembersService) {
    super(tripMembersService);
  }
}
