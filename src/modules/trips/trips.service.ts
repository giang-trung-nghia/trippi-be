import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { CreateTripDto } from '@/modules/trips/dtos/create-trip.dto';
import { UpdateTripDto } from '@/modules/trips/dtos/update-trip.dto';
import { TripDetailDto } from '@/modules/trips/dtos/trip-detail.dto';
import { TripDayDetailDto } from '@/modules/trip-days/dtos/trip-day-detail.dto';
import { TripItemDetailDto } from '@/modules/trip-items/dtos/trip-item-detail.dto';
import { User } from '@/modules/users/entities/user.entity';
import { BaseService } from '@/modules/base/base.service';
import { TripDay } from '@/modules/trip-days/entities/trip-day.entity';
import { TripItem } from '@/modules/trip-items/entities/trip-item.entity';
import { TripMember } from '@/modules/trip-members/entities/trip-member.entity';
import { TripMemberRole } from '@/common/enums/trip-member-role.enum';

@Injectable()
export class TripsService extends BaseService<
  Trip,
  CreateTripDto,
  UpdateTripDto
> {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(TripMember)
    private readonly tripMemberRepository: Repository<TripMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TripDay)
    private readonly tripDayRepository: Repository<TripDay>,
    @InjectRepository(TripItem)
    private readonly tripItemRepository: Repository<TripItem>,
  ) {
    super(tripRepository, 'Trip');
  }

  async create(createDto: CreateTripDto): Promise<Trip> {
    const owner = await this.findUser(createDto.userId);
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);
    this.ensureValidDateRange(startDate, endDate);

    return this.tripRepository.manager.transaction(async (manager) => {
      const { ...rest } = createDto;
      const tripRepo = manager.getRepository(Trip);
      const tripDayRepo = manager.getRepository(TripDay);
      const tripMemberRepo = manager.getRepository(TripMember);

      const tripEntity = tripRepo.create({
        ...rest,
        user: owner,
        startDate,
        endDate,
      } as unknown as Trip);

      const trip = await tripRepo.save(tripEntity);

      const tripDays = this.buildTripDays(trip, startDate, endDate).map((day) =>
        tripDayRepo.create(day),
      );
      if (tripDays.length) {
        await tripDayRepo.save(tripDays);
      }

      const ownerMember = tripMemberRepo.create({
        trip,
        user: owner,
        role: TripMemberRole.OWNER,
      });
      await tripMemberRepo.save(ownerMember);

      return trip;
    });
  }

  async update(id: string, updateDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findByIdOrFail(id);
    const { userId, startDate, endDate, moveItemsFromDeletedDays, ...rest } =
      updateDto;
    const payload: Record<string, unknown> = { ...rest };
    let newOwner: User | undefined;

    const nextStart = startDate ? new Date(startDate) : trip.startDate;
    const nextEnd = endDate ? new Date(endDate) : trip.endDate;
    this.ensureValidDateRange(nextStart, nextEnd);

    const dateRangeChanged =
      startDate || endDate
        ? this.normalizeDate(trip.startDate).getTime() !==
            this.normalizeDate(nextStart).getTime() ||
          this.normalizeDate(trip.endDate).getTime() !==
            this.normalizeDate(nextEnd).getTime()
        : false;

    if (startDate) {
      payload.startDate = nextStart;
    }
    if (endDate) {
      payload.endDate = nextEnd;
    }

    if (userId) {
      newOwner = await this.findUser(userId);
      payload.user = newOwner;
    }

    return this.tripRepository.manager.transaction(async (manager) => {
      const tripRepo = manager.getRepository(Trip);
      const tripDayRepo = manager.getRepository(TripDay);
      const tripItemRepo = manager.getRepository(TripItem);

      this.tripRepository.merge(trip, payload as UpdateTripDto);
      const savedTrip = await tripRepo.save(trip);

      if (dateRangeChanged) {
        await this.handleDateRangeChange(
          savedTrip,
          nextStart,
          nextEnd,
          moveItemsFromDeletedDays ?? false,
          tripDayRepo,
          tripItemRepo,
        );
      }

      if (newOwner) {
        await this.setOwnerMember(savedTrip, newOwner);
      }

      return savedTrip;
    });
  }

  private async handleDateRangeChange(
    trip: Trip,
    newStartDate: Date,
    newEndDate: Date,
    moveItems: boolean,
    tripDayRepo: Repository<TripDay>,
    tripItemRepo: Repository<TripItem>,
  ): Promise<void> {
    const normalizedNewStart = this.normalizeDate(newStartDate);
    const normalizedNewEnd = this.normalizeDate(newEndDate);

    // Load all existing trip days with their items
    const existingDays = await tripDayRepo.find({
      where: { trip: { id: trip.id } },
      relations: ['items'],
      order: { dayIndex: 'ASC' },
    });

    // Find days that are outside the new date range
    const daysToDelete = existingDays.filter((day) => {
      const dayDate = this.normalizeDate(day.date);
      return (
        dayDate.getTime() < normalizedNewStart.getTime() ||
        dayDate.getTime() > normalizedNewEnd.getTime()
      );
    });

    // Find the last remaining day (or create new days if needed)
    const daysToKeep = existingDays.filter((day) => {
      const dayDate = this.normalizeDate(day.date);
      return (
        dayDate.getTime() >= normalizedNewStart.getTime() &&
        dayDate.getTime() <= normalizedNewEnd.getTime()
      );
    });

    // If moving items and we need to create new days (all existing days are being deleted),
    // create the new days first so we have a target day to move items to
    let targetDayForMoving: TripDay | null = null;
    if (moveItems && daysToDelete.length > 0 && daysToKeep.length === 0) {
      // Create all days for the new range first
      const expectedDays = this.buildTripDays(
        trip,
        normalizedNewStart,
        normalizedNewEnd,
      );
      const savedNewDays = await tripDayRepo.save(
        expectedDays.map((day) => tripDayRepo.create(day)),
      );
      targetDayForMoving = savedNewDays[savedNewDays.length - 1];
    }

    // Delete days outside the new range (but keep items if moving is requested)
    if (daysToDelete.length > 0) {
      // If moving items, extract them before deletion
      if (moveItems) {
        // Find the target day (last day in the new range)
        let targetDay: TripDay | null = targetDayForMoving;
        if (!targetDay && daysToKeep.length > 0) {
          // Use the last day in the new range
          targetDay = daysToKeep[daysToKeep.length - 1];
        }

        // If we have a target day, move items to it
        if (targetDay) {
          // Reload target day with items to get accurate orderIndex
          const targetDayWithItems = await tripDayRepo.findOne({
            where: { id: targetDay.id },
            relations: ['items'],
          });

          if (targetDayWithItems) {
            const itemsToMove: TripItem[] = [];
            for (const dayToDelete of daysToDelete) {
              if (dayToDelete.items && dayToDelete.items.length > 0) {
                itemsToMove.push(...dayToDelete.items);
              }
            }

            if (itemsToMove.length > 0) {
              // Get the current max orderIndex in the target day
              const existingItems = targetDayWithItems.items || [];
              const maxOrderIndex =
                existingItems.length > 0
                  ? Math.max(...existingItems.map((item) => item.orderIndex))
                  : -1;

              // Update items to move to the target day with new order indices
              for (let i = 0; i < itemsToMove.length; i++) {
                itemsToMove[i].tripDay = targetDayWithItems;
                itemsToMove[i].orderIndex = maxOrderIndex + 1 + i;
              }
              await tripItemRepo.save(itemsToMove);
            }
          }
        }
      }

      // Delete days outside the new range
      await tripDayRepo.remove(daysToDelete);
    }

    // Rebuild trip days for the new date range (create missing days)
    // Only create if we haven't already created them above
    if (!targetDayForMoving) {
      const existingDayDates = new Set(
        (await tripDayRepo.find({ where: { trip: { id: trip.id } } })).map(
          (day) => this.normalizeDate(day.date).getTime(),
        ),
      );

      const expectedDays = this.buildTripDays(
        trip,
        normalizedNewStart,
        normalizedNewEnd,
      );
      const daysToCreate = expectedDays.filter(
        (day) => !existingDayDates.has(this.normalizeDate(day.date).getTime()),
      );

      if (daysToCreate.length > 0) {
        await tripDayRepo.save(
          daysToCreate.map((day) => tripDayRepo.create(day)),
        );
      }
    }

    // Reindex all remaining days to ensure dayIndex matches the sequence
    const allRemainingDays = await tripDayRepo.find({
      where: { trip: { id: trip.id } },
      order: { date: 'ASC' },
    });

    for (let i = 0; i < allRemainingDays.length; i++) {
      if (allRemainingDays[i].dayIndex !== i + 1) {
        allRemainingDays[i].dayIndex = i + 1;
      }
    }
    await tripDayRepo.save(allRemainingDays);
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findDetail(id: string): Promise<TripDetailDto> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: [
        'user',
        'members',
        'members.user',
        'days',
        'days.items',
        'days.items.geo',
      ],
      order: {
        days: {
          dayIndex: 'ASC',
          items: {
            orderIndex: 'ASC',
          },
        },
      },
    });
    if (!trip) {
      throw new NotFoundException(this.notFoundMessage);
    }

    const totalEstimatedCost = this.calculateTotalCost(trip);
    const ownerId =
      trip.members?.find((member) => member.role === TripMemberRole.OWNER)?.user
        ?.id ?? null;

    return {
      id: trip.id,
      name: trip.name,
      description: trip.description,
      destination: this.deriveDestination(trip),
      coverImage: trip.coverImageUrl ?? null,
      startDate: trip.startDate.toISOString().split('T')[0],
      endDate: trip.endDate.toISOString().split('T')[0],
      status: trip.status,
      budget: trip.budget ?? 0,
      members: trip.members ?? [],
      days: this.mapTripDays(trip.days ?? []),
      totalEstimatedCost,
      totalActualCost: totalEstimatedCost,
      totalDays: trip.days?.length ?? 0,
      createdBy: ownerId ?? trip.user?.id ?? null,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
      deletedAt: trip.deletedAt ? trip.deletedAt.toISOString() : null,
    };
  }

  async exportTripToCsv(id: string): Promise<string> {
    const trip = await this.findDetail(id);

    const csvLines: string[] = [];

    // ===== SECTION 1: TRIP OVERVIEW =====
    csvLines.push('TRIP OVERVIEW');

    const overviewHeaders = [
      'Trip Name',
      'Description',
      'Start Date',
      'End Date',
      'Total Days',
      'Budget',
      'Total Estimated Cost',
      'Total Actual Cost',
    ];
    csvLines.push(overviewHeaders.join(','));

    const overviewRow = [
      this.escapeCsvField(trip.name),
      this.escapeCsvField(trip.description ?? ''),
      trip.startDate,
      trip.endDate,
      trip.totalDays.toString(),
      trip.budget?.toString() ?? '0',
      trip.totalEstimatedCost?.toString() ?? '0',
      trip.totalActualCost?.toString() ?? '0',
    ];
    csvLines.push(overviewRow.join(','));

    // Empty lines separator
    csvLines.push('');

    // ===== SECTION 2: TRIP DETAILS (DAY BY DAY) =====
    csvLines.push('TRIP DETAILS');

    const detailHeaders = [
      'Day',
      'Date',
      'Day Note',
      'Item #',
      'Type',
      'Place/Activity Name',
      'Address',
      'Start Time',
      'End Time',
      'Duration (min)',
      'Cost',
      'Estimated Cost',
      'Phone',
      'Item Note',
    ];
    csvLines.push(detailHeaders.join(','));

    // Add detail rows
    trip.days.forEach((day) => {
      if (!day.items || day.items.length === 0) {
        // Add empty day row
        csvLines.push(
          [
            (day.dayIndex + 1).toString(),
            day.date,
            this.escapeCsvField(day.note ?? ''),
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ].join(','),
        );
      } else {
        day.items.forEach((item, index) => {
          csvLines.push(
            [
              index === 0 ? day.dayIndex.toString() : '', // Show day number only on first item
              index === 0 ? day.date : '', // Show date only on first item
              index === 0 ? this.escapeCsvField(day.note ?? '') : '', // Show day note only on first item
              (item.orderIndex + 1).toString(),
              item.type,
              this.escapeCsvField(item.name),
              this.escapeCsvField(item.address ?? ''),
              item.startTime ?? '',
              item.endTime ?? '',
              item.durationMinutes?.toString() ?? '',
              item.cost?.toString() ?? '',
              item.estimatedCost?.toString() ?? '',
              this.escapeCsvField(item.phone ?? ''),
              this.escapeCsvField(item.note ?? ''),
            ].join(','),
          );
        });
      }
    });

    return csvLines.join('\n');
  }

  async exportTripToExcel(id: string): Promise<Buffer> {
    const trip = await this.findDetail(id);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Trip Details');

    // Define colors - Light, friendly colors
    const COLORS = {
      sectionHeader: 'FF4A90E2', // Soft blue
      overviewHeader: 'FFE8F4F8', // Very light blue
      detailHeader: 'FFF5E6D3', // Light peach
      oddDay: 'FFF0F8FF', // Alice blue (very light)
      evenDay: 'FFFFF8E1', // Light amber
      border: 'FFB0BEC5', // Light gray-blue
    };

    let currentRow = 1;

    // ===== SECTION 1: TRIP OVERVIEW =====
    // Section header
    const overviewSectionCell = worksheet.getCell(`A${currentRow}`);
    overviewSectionCell.value = 'TRIP OVERVIEW';
    overviewSectionCell.font = {
      bold: true,
      size: 14,
      color: { argb: 'FFFFFFFF' },
    };
    overviewSectionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.sectionHeader },
    };
    overviewSectionCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
    currentRow++;

    // Overview headers
    const overviewHeaders = [
      'Trip Name',
      'Description',
      'Start Date',
      'End Date',
      'Total Days',
      'Budget',
      'Total Estimated Cost',
      'Total Actual Cost',
    ];

    const overviewHeaderRow = worksheet.getRow(currentRow);
    overviewHeaders.forEach((header, index) => {
      const cell = overviewHeaderRow.getCell(index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: COLORS.overviewHeader },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.border } },
        left: { style: 'thin', color: { argb: COLORS.border } },
        bottom: { style: 'thin', color: { argb: COLORS.border } },
        right: { style: 'thin', color: { argb: COLORS.border } },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    currentRow++;

    // Overview data
    const overviewData = [
      trip.name,
      trip.description ?? '',
      trip.startDate,
      trip.endDate,
      trip.totalDays,
      trip.budget ?? 0,
      trip.totalEstimatedCost ?? 0,
      trip.totalActualCost ?? 0,
    ];

    const overviewDataRow = worksheet.getRow(currentRow);
    overviewData.forEach((data, index) => {
      const cell = overviewDataRow.getCell(index + 1);
      cell.value = data;
      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.border } },
        left: { style: 'thin', color: { argb: COLORS.border } },
        bottom: { style: 'thin', color: { argb: COLORS.border } },
        right: { style: 'thin', color: { argb: COLORS.border } },
      };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
    currentRow += 2; // Empty row

    // ===== SECTION 2: TRIP DETAILS =====
    // Section header
    const detailSectionCell = worksheet.getCell(`A${currentRow}`);
    detailSectionCell.value = 'TRIP DETAILS';
    detailSectionCell.font = {
      bold: true,
      size: 14,
      color: { argb: 'FFFFFFFF' },
    };
    detailSectionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.sectionHeader },
    };
    detailSectionCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    currentRow++;

    // Detail headers
    const detailHeaders = [
      'Day',
      'Date',
      'Day Note',
      'Item #',
      'Type',
      'Place/Activity Name',
      'Address',
      'Start Time',
      'End Time',
      'Duration (min)',
      'Cost',
      'Estimated Cost',
      'Phone',
      'Item Note',
    ];

    const detailHeaderRow = worksheet.getRow(currentRow);
    detailHeaders.forEach((header, index) => {
      const cell = detailHeaderRow.getCell(index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: COLORS.detailHeader },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.border } },
        left: { style: 'thin', color: { argb: COLORS.border } },
        bottom: { style: 'thin', color: { argb: COLORS.border } },
        right: { style: 'thin', color: { argb: COLORS.border } },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
    currentRow++;

    // Detail rows with alternating colors per day
    trip.days.forEach((day, dayIdx) => {
      const dayColor = dayIdx % 2 === 0 ? COLORS.oddDay : COLORS.evenDay;
      const dayStartRow = currentRow;

      if (!day.items || day.items.length === 0) {
        // Empty day
        const row = worksheet.getRow(currentRow);
        [
          day.dayIndex,
          day.date,
          day.note ?? '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ].forEach((value, index) => {
          const cell = row.getCell(index + 1);
          cell.value = value;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: dayColor },
          };
          cell.border = {
            top: { style: 'thin', color: { argb: COLORS.border } },
            left: { style: 'thin', color: { argb: COLORS.border } },
            bottom: { style: 'thin', color: { argb: COLORS.border } },
            right: { style: 'thin', color: { argb: COLORS.border } },
          };
          cell.alignment = { vertical: 'middle', wrapText: true };
        });
        currentRow++;
      } else {
        // Day with items
        day.items.forEach((item, itemIdx) => {
          const row = worksheet.getRow(currentRow);
          const rowData = [
            itemIdx === 0 ? day.dayIndex : '',
            itemIdx === 0 ? day.date : '',
            itemIdx === 0 ? (day.note ?? '') : '',
            item.orderIndex + 1,
            item.type,
            item.name,
            item.address ?? '',
            item.startTime ?? '',
            item.endTime ?? '',
            item.durationMinutes ?? '',
            item.cost ?? '',
            item.estimatedCost ?? '',
            item.phone ?? '',
            item.note ?? '',
          ];

          rowData.forEach((value, index) => {
            const cell = row.getCell(index + 1);
            cell.value = value;
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: dayColor },
            };
            cell.border = {
              top: { style: 'thin', color: { argb: COLORS.border } },
              left: { style: 'thin', color: { argb: COLORS.border } },
              bottom: { style: 'thin', color: { argb: COLORS.border } },
              right: { style: 'thin', color: { argb: COLORS.border } },
            };
            cell.alignment = { vertical: 'middle', wrapText: true };
          });
          currentRow++;
        });
      }

      // Merge Day, Date, and Day Note cells for all items in the same day
      const dayEndRow = currentRow - 1;
      if (dayEndRow > dayStartRow) {
        worksheet.mergeCells(`A${dayStartRow}:A${dayEndRow}`); // Day
        worksheet.mergeCells(`B${dayStartRow}:B${dayEndRow}`); // Date
        worksheet.mergeCells(`C${dayStartRow}:C${dayEndRow}`); // Day Note

        // Center align merged cells
        ['A', 'B', 'C'].forEach((col) => {
          const cell = worksheet.getCell(`${col}${dayStartRow}`);
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          };
        });
      }
    });

    // Set column widths
    worksheet.columns = [
      { width: 6 }, // Day
      { width: 12 }, // Date
      { width: 20 }, // Day Note
      { width: 7 }, // Item #
      { width: 10 }, // Type
      { width: 25 }, // Place/Activity Name
      { width: 30 }, // Address
      { width: 10 }, // Start Time
      { width: 10 }, // End Time
      { width: 12 }, // Duration
      { width: 10 }, // Cost
      { width: 15 }, // Estimated Cost
      { width: 15 }, // Phone
      { width: 25 }, // Item Note
    ];

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private escapeCsvField(field: string): string {
    if (!field) return '';

    // If field contains comma, quote, or newline, wrap in quotes and escape quotes
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }

    return field;
  }

  private mapTripDays(tripDays: TripDay[]): TripDayDetailDto[] {
    return tripDays.map((day) => ({
      id: day.id,
      dayIndex: day.dayIndex,
      date: day.date.toISOString().split('T')[0],
      note: day.note ?? null,
      items: this.mapTripItems(day.items ?? []),
    }));
  }

  private mapTripItems(tripItems: TripItem[]): TripItemDetailDto[] {
    return tripItems.map((item) => {
      const geo = item.geo;

      return {
        id: item.id,
        type: item.type,
        customName: item.customName ?? null,
        cost: item.cost ?? null,
        estimatedCost: item.estimatedCost ?? null,
        name: item.customName || geo?.name || 'Unnamed',
        durationMinutes: item.durationMinutes ?? null,
        startTime: item.startTime ?? null,
        endTime: item.endTime ?? null,
        address: geo?.address || null,
        googlePlaceId: geo?.googlePlaceId || null,
        lat: geo?.lat ? Number(geo.lat) : null,
        lng: geo?.lng ? Number(geo.lng) : null,
        maxDurationMinutes: geo?.maxDurationMinutes ?? null,
        minDurationMinutes: geo?.minDurationMinutes ?? null,
        phone: geo?.phone ?? null,
        standardClosingHours: geo?.standardClosingHours
          ? geo.standardClosingHours.toISOString()
          : null,
        standardOpeningHours: geo?.standardOpeningHours
          ? geo.standardOpeningHours.toISOString()
          : null,
        orderIndex: item.orderIndex,
        note: item.note ?? null,
      };
    });
  }

  private calculateTotalCost(trip: Trip): number {
    if (!trip.days?.length) {
      return 0;
    }
    return trip.days.reduce((daySum, day) => {
      if (!day.items?.length) {
        return daySum;
      }
      const itemsSum = day.items.reduce((itemSum, item) => {
        return itemSum + (item.cost ?? 0);
      }, 0);
      return daySum + itemsSum;
    }, 0);
  }

  private deriveDestination(trip: Trip): string | null {
    return (
      trip.days
        ?.find((day) => day.items?.length)
        ?.items?.find((item) => item.geo)?.geo?.name ?? null
    );
  }

  private ensureValidDateRange(startDate: Date, endDate: Date): void {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
  }

  private buildTripDays(
    trip: Trip,
    startDate: Date,
    endDate: Date,
  ): Array<Pick<TripDay, 'trip' | 'dayIndex' | 'date'>> {
    const days: Array<Pick<TripDay, 'trip' | 'dayIndex' | 'date'>> = [];
    const normalizedStart = this.normalizeDate(startDate);
    const normalizedEnd = this.normalizeDate(endDate);

    for (
      let dayIndex = 1, cursor = new Date(normalizedStart);
      cursor.getTime() <= normalizedEnd.getTime();
      cursor.setDate(cursor.getDate() + 1), dayIndex++
    ) {
      days.push({
        trip,
        dayIndex,
        date: new Date(cursor),
      });
    }

    return days;
  }

  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  private async setOwnerMember(trip: Trip, owner: User): Promise<void> {
    let member = await this.tripMemberRepository.findOne({
      where: {
        trip: { id: trip.id },
        role: TripMemberRole.OWNER,
      },
      relations: ['trip', 'user'],
    });

    if (!member) {
      member = this.tripMemberRepository.create({
        trip,
        user: owner,
        role: TripMemberRole.OWNER,
      });
    } else {
      member.user = owner;
    }

    await this.tripMemberRepository.save(member);
  }
}
