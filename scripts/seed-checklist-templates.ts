import 'reflect-metadata';
import { Repository } from 'typeorm';
import dataSource from '@/config/database.config';
import { ChecklistTemplate } from '@/modules/checklist-templates/entities/checklist-template.entity';
import { ChecklistTemplateItem } from '@/modules/checklist-template-items/entities/checklist-template-item.entity';
import { ChecklistType } from '@/common/enums/checklist-type.enum';

interface ChecklistTemplateSeed {
  name: string;
  type: ChecklistType;
  items: string[];
}

const CHECKLIST_TEMPLATE_SEEDS: ChecklistTemplateSeed[] = [
  {
    name: 'Beach Trip Essentials',
    type: ChecklistType.PACKING,
    items: [
      'Swimsuit',
      'Sunscreen (SPF 30+)',
      'Beach towel',
      'Flip-flops or sandals',
      'Sunglasses',
      'Hat or cap',
      'Beach bag',
      'Water bottle',
      'Snacks',
      'Beach umbrella or tent',
      'Portable speaker',
      'Book or magazine',
      'Waterproof phone case',
      'Change of clothes',
    ],
  },
  {
    name: 'Travel Documents',
    type: ChecklistType.DOCUMENT,
    items: [
      'Passport',
      'Visa (if required)',
      'Flight tickets',
      'Hotel reservations',
      'Travel insurance documents',
      "Driver's license",
      "International driver's permit",
      'Vaccination certificate',
      'Emergency contact information',
      'Credit cards and cash',
      'Copies of important documents',
      'Travel itinerary',
    ],
  },
  {
    name: 'Road Trip Snacks',
    type: ChecklistType.FOOD,
    items: [
      'Bottled water',
      'Sandwiches',
      'Fresh fruits (apples, bananas, grapes)',
      'Trail mix or nuts',
      'Granola bars',
      'Chips or crackers',
      'Cookies',
      'Candy',
      'Juice boxes',
      'Coffee or tea',
      'Chewing gum',
      'Energy drinks',
    ],
  },
  {
    name: 'Camping Gear',
    type: ChecklistType.EQUIPMENT,
    items: [
      'Tent',
      'Sleeping bag',
      'Sleeping pad or air mattress',
      'Camping pillow',
      'Flashlight or headlamp',
      'Extra batteries',
      'Camping stove',
      'Fuel for stove',
      'Cooking utensils',
      'Cooler with ice',
      'First aid kit',
      'Multi-tool or knife',
      'Rope or paracord',
      'Matches or lighter',
      'Insect repellent',
      'Camping chairs',
      'Tarp or ground sheet',
    ],
  },
  {
    name: 'Hiking Essentials',
    type: ChecklistType.EQUIPMENT,
    items: [
      'Hiking boots',
      'Backpack',
      'Water bottles or hydration system',
      'Trail map or GPS device',
      'Compass',
      'First aid kit',
      'Sunscreen',
      'Insect repellent',
      'Snacks and energy bars',
      'Rain jacket',
      'Extra layers of clothing',
      'Hat',
      'Sunglasses',
      'Whistle',
      'Emergency shelter',
    ],
  },
  {
    name: 'Baby Travel Essentials',
    type: ChecklistType.BABY,
    items: [
      'Diapers',
      'Wipes',
      'Diaper bag',
      'Changing pad',
      'Baby formula or breast milk',
      'Bottles',
      'Baby food and snacks',
      'Bibs',
      'Pacifiers',
      'Baby clothes (multiple outfits)',
      'Blankets',
      'Stroller',
      'Car seat',
      'Baby carrier',
      'Toys',
      'Baby sunscreen',
      'Baby medication',
    ],
  },
  {
    name: 'City Sightseeing',
    type: ChecklistType.PACKING,
    items: [
      'Comfortable walking shoes',
      'Day backpack',
      'City map or guidebook',
      'Phone with GPS',
      'Portable charger',
      'Camera',
      'Water bottle',
      'Snacks',
      'Light jacket or sweater',
      'Sunscreen',
      'Sunglasses',
      'Hat',
      'Public transport card or cash',
      'Umbrella',
    ],
  },
  {
    name: 'Winter Sports',
    type: ChecklistType.EQUIPMENT,
    items: [
      'Ski or snowboard',
      'Ski boots or snowboard boots',
      'Ski poles',
      'Helmet',
      'Goggles',
      'Warm jacket',
      'Snow pants',
      'Thermal underwear',
      'Gloves or mittens',
      'Neck warmer or balaclava',
      'Wool socks',
      'Hand warmers',
      'Sunscreen',
      'Lip balm with SPF',
      'Lift ticket',
    ],
  },
];

async function run() {
  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    const checklistTemplateRepo = dataSource.getRepository(ChecklistTemplate);
    const checklistTemplateItemRepo = dataSource.getRepository(
      ChecklistTemplateItem,
    );

    await upsertTemplates(
      checklistTemplateRepo,
      checklistTemplateItemRepo,
      CHECKLIST_TEMPLATE_SEEDS,
    );

    console.log('✅ Checklist templates seeded successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

async function upsertTemplates(
  templateRepo: Repository<ChecklistTemplate>,
  itemRepo: Repository<ChecklistTemplateItem>,
  seeds: ChecklistTemplateSeed[],
): Promise<void> {
  for (const seed of seeds) {
    let template = await templateRepo.findOne({
      where: { name: seed.name, type: seed.type },
      relations: ['items'],
    });

    if (template) {
      console.log(`Template "${seed.name}" already exists, updating items...`);
      // Delete existing items
      if (template.items.length > 0) {
        await itemRepo.remove(template.items);
      }
    } else {
      console.log(`Creating template "${seed.name}"...`);
      template = templateRepo.create({
        name: seed.name,
        type: seed.type,
      });
      template = await templateRepo.save(template);
    }

    // Create items
    const items = seed.items.map((itemName, index) =>
      itemRepo.create({
        name: itemName,
        orderIndex: index,
        checklistTemplate: template,
      }),
    );

    await itemRepo.save(items);
    console.log(`  ✓ Added ${items.length} items to "${seed.name}"`);
  }
}

run();
