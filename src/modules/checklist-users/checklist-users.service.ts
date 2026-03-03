import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';
import { CreateChecklistUserDto } from '@/modules/checklist-users/dtos/create-checklist-user.dto';
import { UpdateChecklistUserDto } from '@/modules/checklist-users/dtos/update-checklist-user.dto';
import { CopyFromTemplateDto } from '@/modules/checklist-users/dtos/copy-from-template.dto';
import { BaseService } from '@/modules/base/base.service';
import { User } from '@/modules/users/entities/user.entity';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { ChecklistUserItem } from '@/modules/checklist-user-items/entities/checklist-user-item.entity';

@Injectable()
export class ChecklistUsersService extends BaseService<
  ChecklistUser,
  CreateChecklistUserDto,
  UpdateChecklistUserDto
> {
  constructor(
    @InjectRepository(ChecklistUser)
    private readonly checklistUserRepository: Repository<ChecklistUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChecklistTemplate)
    private readonly checklistTemplateRepository: Repository<ChecklistTemplate>,
    @InjectRepository(ChecklistUserItem)
    private readonly checklistUserItemRepository: Repository<ChecklistUserItem>,
  ) {
    super(checklistUserRepository, 'ChecklistUser');
  }

  async create(createDto: CreateChecklistUserDto): Promise<ChecklistUser> {
    const user = await this.findUser(createDto.userId);
    const payload: Record<string, unknown> = {
      name: createDto.name,
      user,
    };

    if (createDto.templateId) {
      const template = await this.findTemplate(createDto.templateId);
      payload.template = template;
    }

    return super.create(payload as unknown as CreateChecklistUserDto);
  }

  async copyFromTemplate(copyDto: CopyFromTemplateDto): Promise<ChecklistUser> {
    return this.checklistUserRepository.manager.transaction(async (manager) => {
      const template = await manager.findOne(ChecklistTemplate, {
        where: { id: copyDto.templateId },
        relations: ['items'],
      });

      if (!template) {
        throw new NotFoundException('Checklist template not found');
      }

      const user = await manager.findOne(User, {
        where: { id: copyDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userChecklist = manager.create(ChecklistUser, {
        name: template.name,
        user,
        template,
      });
      await manager.save(userChecklist);

      const items = template.items.map((item) =>
        manager.create(ChecklistUserItem, {
          name: item.name,
          orderIndex: item.orderIndex,
          checklistUser: userChecklist,
        }),
      );
      await manager.save(items);

      return manager.findOne(ChecklistUser, {
        where: { id: userChecklist.id },
        relations: ['items'],
      }) as Promise<ChecklistUser>;
    });
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async findTemplate(id: string): Promise<ChecklistTemplate> {
    const template = await this.checklistTemplateRepository.findOne({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('Checklist template not found');
    }
    return template;
  }
}
