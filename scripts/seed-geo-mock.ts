import 'reflect-metadata';
import { Repository } from 'typeorm';
import dataSource from '@/config/database.config';
import { GeoType } from '@/modules/geo-types/entities/geo-type.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { GeoPhoto } from '@/modules/geo-photos/entities/geo-photo.entity';

interface GeoTypeSeed {
  googleType: string;
  name: string;
}

interface GeoSeed {
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  googlePlaceId?: string;
  rating?: number;
  phone?: string;
  website?: string;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  parentName?: string;
  photos?: string[];
}

const GEO_TYPE_SEEDS: GeoTypeSeed[] = [
  {
    googleType: 'tourist_attraction',
    name: 'Tourist Attraction',
  },
  {
    googleType: 'restaurant',
    name: 'Restaurant',
  },
  {
    googleType: 'lodging',
    name: 'Hotel & Lodging',
  },
];

const GEO_SEEDS: GeoSeed[] = [
  {
    name: 'Hạ Long Bay',
    address: 'Quảng Ninh, Việt Nam',
    lat: 20.9100511,
    lng: 107.1839024,
    type: 'tourist_attraction',
    googlePlaceId: 'ChIJPZ9j0Vz02TERHheM3aMc2e8',
    rating: 98,
    website: 'https://halongbay.com',
    minDurationMinutes: 180,
    maxDurationMinutes: 480,
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    ],
  },
  {
    name: 'Saigon Central Post Office',
    address: '2 Công xã Paris, Bến Nghé, Quận 1, TP.HCM',
    lat: 10.779785,
    lng: 106.699018,
    type: 'tourist_attraction',
    googlePlaceId: 'ChIJkzb1ekcndTER2G4qc6jw6Jg',
    rating: 92,
    minDurationMinutes: 30,
    maxDurationMinutes: 90,
    photos: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
    ],
  },
  {
    name: 'Phở 2000 Bến Thành',
    address: '1-3 Phan Chu Trinh, Bến Thành, Quận 1, TP.HCM',
    lat: 10.77202,
    lng: 106.698965,
    type: 'restaurant',
    rating: 88,
    phone: '+84 28 3822 2788',
    website: 'https://pho2000.vn',
    minDurationMinutes: 45,
    maxDurationMinutes: 90,
    photos: [
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
    ],
  },
  {
    name: 'Fusion Suites Saigon',
    address: '3-5 Sương Nguyệt Ánh, Bến Thành, Quận 1, TP.HCM',
    lat: 10.771755,
    lng: 106.691474,
    type: 'lodging',
    rating: 90,
    phone: '+84 28 3925 7257',
    website: 'https://fusionsuitessaigon.com',
    minDurationMinutes: 600,
    maxDurationMinutes: 1440,
    photos: [
      'https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
    ],
  },
  {
    name: 'Tà Xùa Dinosaur Backbone Ridge',
    address: 'Bản Tà Xùa, Bắc Yên, Sơn La, Việt Nam',
    lat: 21.2578,
    lng: 104.2829,
    type: 'tourist_attraction',
    rating: 94,
    minDurationMinutes: 120,
    maxDurationMinutes: 300,
    photos: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    ],
  },
  {
    name: 'Tà Xùa Cloud Ridge Homestay',
    address: 'Tà Xùa A, Bắc Yên, Sơn La, Việt Nam',
    lat: 21.2551,
    lng: 104.2954,
    type: 'lodging',
    rating: 91,
    phone: '+84 97 888 5566',
    website: 'https://taxua-cloud-ridge.vn',
    minDurationMinutes: 600,
    maxDurationMinutes: 2160,
    photos: [
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    ],
  },
  {
    name: 'Ma Pi Leng Pass',
    address: 'QL4C, Pải Lủng, Mèo Vạc, Hà Giang, Việt Nam',
    lat: 23.2515,
    lng: 105.2496,
    type: 'tourist_attraction',
    rating: 97,
    minDurationMinutes: 90,
    maxDurationMinutes: 240,
    photos: [
      'https://images.unsplash.com/photo-1500534629673-44e36703a612',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    ],
  },
  {
    name: 'Lũng Cú Flag Tower',
    address: 'Đỉnh Lũng Cú, Đồng Văn, Hà Giang, Việt Nam',
    lat: 23.3646,
    lng: 105.3055,
    type: 'tourist_attraction',
    rating: 93,
    minDurationMinutes: 60,
    maxDurationMinutes: 180,
    photos: [
      'https://images.unsplash.com/photo-1500534320475-81c8c719e6a7',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    ],
  },
  {
    name: 'Đồng Văn Ancient Town',
    address: 'Tổ 3, Thị trấn Đồng Văn, Hà Giang, Việt Nam',
    lat: 23.2832,
    lng: 105.3554,
    type: 'tourist_attraction',
    rating: 90,
    minDurationMinutes: 45,
    maxDurationMinutes: 150,
    photos: [
      'https://images.unsplash.com/photo-1500534623283-312aade485b7',
      'https://images.unsplash.com/photo-1500534630473-a8d2d20c1f3f',
    ],
  },
];

async function run() {
  await dataSource.initialize();

  try {
    const geoTypeRepo = dataSource.getRepository(GeoType);
    const geoRepo = dataSource.getRepository(Geo);
    const geoPhotoRepo = dataSource.getRepository(GeoPhoto);

    const typeMap = await upsertGeoTypes(geoTypeRepo);
    const { geos, photos } = await upsertGeosAndPhotos(
      geoRepo,
      geoPhotoRepo,
      typeMap,
    );

    console.log(
      `Seeded ${typeMap.size} geo types, ${geos} geos, and ${photos} photos.`,
    );
  } finally {
    await dataSource.destroy();
  }
}

async function upsertGeoTypes(repo: Repository<GeoType>) {
  const typeMap = new Map<string, GeoType>();

  for (const seed of GEO_TYPE_SEEDS) {
    let entity = await repo.findOne({
      where: { googleType: seed.googleType },
    });
    if (entity) {
      entity.name = seed.name;
    } else {
      entity = repo.create(seed);
    }
    entity = await repo.save(entity);
    typeMap.set(seed.googleType, entity);
  }

  return typeMap;
}

async function upsertGeosAndPhotos(
  geoRepo: Repository<Geo>,
  geoPhotoRepo: Repository<GeoPhoto>,
  typeMap: Map<string, GeoType>,
): Promise<{ geos: number; photos: number }> {
  const geoMap = new Map<string, Geo>();
  let geosCount = 0;
  let photosCount = 0;

  for (const seed of GEO_SEEDS) {
    const type = typeMap.get(seed.type);
    if (!type) {
      throw new Error(
        `Geo type "${seed.type}" not found. Seed geo types first.`,
      );
    }

    let parent: Geo | undefined;
    if (seed.parentName) {
      parent = geoMap.get(seed.parentName);
      if (!parent) {
        parent =
          (await geoRepo.findOne({ where: { name: seed.parentName } })) ??
          undefined;
      }
    }

    let geo = await geoRepo.findOne({ where: { name: seed.name } });
    if (!geo) {
      geo = geoRepo.create();
    }

    Object.assign(geo, buildGeoPayload(seed, type, parent));
    geo = await geoRepo.save(geo);
    geoMap.set(seed.name, geo);
    geosCount += 1;

    await geoPhotoRepo
      .createQueryBuilder()
      .delete()
      .where('geo_id = :geoId', { geoId: geo.id })
      .execute();

    if (seed.photos?.length) {
      const photoEntities = seed.photos.map((photoUrl) =>
        geoPhotoRepo.create({ photoUrl, geo }),
      );
      await geoPhotoRepo.save(photoEntities);
      photosCount += photoEntities.length;
    }
  }

  return { geos: geosCount, photos: photosCount };
}

function buildGeoPayload(
  seed: GeoSeed,
  type: GeoType,
  parent?: Geo,
): Partial<Geo> {
  return {
    name: seed.name,
    address: seed.address,
    lat: seed.lat,
    lng: seed.lng,
    type,
    googlePlaceId: seed.googlePlaceId,
    rating: seed.rating,
    phone: seed.phone,
    website: seed.website,
    minDurationMinutes: seed.minDurationMinutes,
    maxDurationMinutes: seed.maxDurationMinutes,
    parent,
  };
}

run()
  .then(() => {
    console.log('Geo mock data seeded successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed geo mock data:', error);
    process.exit(1);
  });
