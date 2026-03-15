import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';
import { CreateChecklistUserDto } from '@/modules/checklist-users/dtos/create-checklist-user.dto';
import { UpdateChecklistUserDto } from '@/modules/checklist-users/dtos/update-checklist-user.dto';
import { UserCopyChecklistFromTemplateDto } from '@/modules/checklist-users/dtos/copy-from-template.dto';
import { ChecklistUsersService } from '@/modules/checklist-users/checklist-users.service';
import { BaseController } from '@/modules/base/base.controller';

@ApiTags('User Checklists')
@Controller('v1/checklist-users')
export class ChecklistUsersController extends BaseController<
  ChecklistUser,
  CreateChecklistUserDto,
  UpdateChecklistUserDto
> {
  constructor(protected readonly checklistUsersService: ChecklistUsersService) {
    super(checklistUsersService);
  }

  @Post('copy-from-template')
  copyFromTemplate(
    @Body() copyDto: UserCopyChecklistFromTemplateDto,
  ): Promise<ChecklistUser> {
    return this.checklistUsersService.copyFromTemplate(copyDto);
  }
}
