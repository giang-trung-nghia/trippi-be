import { BaseEntity } from '@/modules/base/entities/base.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('geo_photo')
export class GeoPhoto extends BaseEntity {
  @Column()
  photoUrl: string;

  @ManyToOne(() => Geo, (geo) => geo.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'geo_id' })
  geo: Geo;
}
