import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/base/entities/base.entity';
import { GeoType } from '@/modules/geo-types/entities/geo-type.entity';
import { TripItem } from '@/modules/trip-items/entities/trip-item.entity';
import { GeoPhoto } from '@/modules/geo-photos/entities/geo-photo.entity';

@Entity('geo')
export class Geo extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lng: number;

  @ManyToOne(() => GeoType, (geoType) => geoType.geos)
  @JoinColumn({ name: 'geo_type_id' })
  type: GeoType;

  @Column({ nullable: true })
  googlePlaceId?: string;

  @Column({ nullable: true })
  rating?: number; // The rating of the geo (0 to 100)

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  standardOpeningHours?: Date; // The standard opening hours of the geo

  @Column({ nullable: true })
  standardClosingHours?: Date; // The standard closing hours of the geo

  @Column({ type: 'int', nullable: true })
  minDurationMinutes?: number;

  @Column({ type: 'int', nullable: true })
  maxDurationMinutes?: number;

  @ManyToOne(() => Geo, (geo) => geo.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Geo;

  @OneToMany(() => Geo, (geo) => geo.parent)
  children: Geo[];

  @OneToMany(() => TripItem, (tripItem) => tripItem.geo)
  items: TripItem[];

  @OneToMany(() => GeoPhoto, (geoPhoto) => geoPhoto.geo)
  photos: GeoPhoto[];
}
