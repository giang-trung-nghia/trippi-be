import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { Geo } from '@/modules/geos/entities/geo.entity';

@Entity('geo_type')
export class GeoType extends BaseEntity {
  @Column({ unique: true })
  googleType: string;

  @Column()
  displayNameEn: string;

  @Column()
  displayNameVn: string;

  @OneToMany(() => Geo, (geo) => geo.type)
  geos: Geo[];
}
