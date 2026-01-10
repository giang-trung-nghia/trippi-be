import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { BaseController } from '@/modules/base/base.controller';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { CreateTripDto } from '@/modules/trips/dtos/create-trip.dto';
import { UpdateTripDto } from '@/modules/trips/dtos/update-trip.dto';
import { TripDetailDto } from '@/modules/trips/dtos/trip-detail.dto';
import { TripsService } from '@/modules/trips/trips.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { formatDateTime } from '@/common/utils/datetime.util';

@Controller('api/v1/trips')
@UseGuards(JwtAuthGuard)
export class TripsController extends BaseController<
  Trip,
  CreateTripDto,
  UpdateTripDto
> {
  constructor(protected readonly tripsService: TripsService) {
    super(tripsService);
  }

  @Get(':id')
  findDetail(@Param('id') id: string): Promise<TripDetailDto> {
    return this.tripsService.findDetail(id);
  }

  @Get(':id/export/csv')
  async exportCsv(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const csvContent = await this.tripsService.exportTripToCsv(id);

    const timeStamp = formatDateTime();
    const fileName = `trip_${timeStamp}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send('\uFEFF' + csvContent); // UTF-8 BOM for Excel compatibility
  }

  @Get(':id/export/excel')
  async exportExcel(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const excelBuffer = await this.tripsService.exportTripToExcel(id);

    const timeStamp = formatDateTime();
    const fileName = `trip_${timeStamp}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(excelBuffer);
  }
}
