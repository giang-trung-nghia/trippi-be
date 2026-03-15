import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChecklistTrip } from '@/modules/checklist-trips/entities/checklist-trip.entity';
import { CreateChecklistTripDto } from '@/modules/checklist-trips/dtos/create-checklist-trip.dto';
import { UpdateChecklistTripDto } from '@/modules/checklist-trips/dtos/update-checklist-trip.dto';
import { CopyFromUserChecklistDto } from '@/modules/checklist-trips/dtos/copy-from-user-checklist.dto';
import { TripCopyChecklistFromTemplateDto } from '@/modules/checklist-trips/dtos/copy-from-template.dto';
import { FilterChecklistTripsDto } from '@/modules/checklist-trips/dtos/filter-checklist-trips.dto';
import { ChecklistTripsService } from '@/modules/checklist-trips/checklist-trips.service';
import { BaseController } from '@/modules/base/base.controller';

@ApiTags('Trip Checklists')
@Controller('api/checklist-trips')
export class ChecklistTripsController extends BaseController<
  ChecklistTrip,
  CreateChecklistTripDto,
  UpdateChecklistTripDto
> {
  constructor(protected readonly checklistTripsService: ChecklistTripsService) {
    super(checklistTripsService);
  }

  @Get()
  findAll(@Query() filter?: FilterChecklistTripsDto): Promise<ChecklistTrip[]> {
    return this.checklistTripsService.findAll(
      filter?.tripId,
      filter?.includeItems ?? false,
    );
  }

  @Post('copy-from-template')
  copyFromTemplate(
    @Body() copyDto: TripCopyChecklistFromTemplateDto,
  ): Promise<ChecklistTrip> {
    return this.checklistTripsService.copyFromTemplate(copyDto);
  }

  @Post('copy-from-user-checklist')
  copyFromUserChecklist(
    @Body() copyDto: CopyFromUserChecklistDto,
  ): Promise<ChecklistTrip> {
    return this.checklistTripsService.copyFromUserChecklist(copyDto);
  }
}
