import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistUserItem } from '@/modules/checklist-user-items/entities/checklist-user-item.entity';
import { ChecklistUser } from '@/modules/checklist-users/entities/checklist-user.entity';
import { ChecklistUserItemsService } from '@/modules/checklist-user-items/checklist-user-items.service';
import { ChecklistUserItemsController } from '@/modules/checklist-user-items/checklist-user-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistUserItem, ChecklistUser])],
  controllers: [ChecklistUserItemsController],
  providers: [ChecklistUserItemsService],
  exports: [ChecklistUserItemsService],
})
export class ChecklistUserItemsModule {}
