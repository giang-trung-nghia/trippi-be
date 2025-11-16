import { Itinerary } from "@/modules/itineraries/entities/itinerary.entity";
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "@/modules/base/entities/base.entity";
import { GeoType } from "@/modules/geo-types/entities/geo-type.entity";

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

  @ManyToOne(() => Geo, (geo) => geo.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Geo;

  @OneToMany(() => Geo, (geo) => geo.parent)
  children: Geo[];

  @OneToMany(() => Itinerary, (itinerary) => itinerary.geo)
  itineraries: Itinerary[];
}
