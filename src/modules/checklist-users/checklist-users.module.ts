import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';
import { User } from '@/modules/users/entities/user.entity';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { ChecklistUserItem } from '@/modules/checklist-user-items/entities/checklist-user-item.entity';
import { ChecklistUsersService } from '@/modules/checklist-users/checklist-users.service';
import { ChecklistUsersController } from '@/modules/checklist-users/checklist-users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChecklistUser,
      User,
      ChecklistTemplate,
      ChecklistUserItem,
    ]),
  ],
  controllers: [ChecklistUsersController],
  providers: [ChecklistUsersService],
  exports: [ChecklistUsersService],
})
export class ChecklistUsersModule {}
