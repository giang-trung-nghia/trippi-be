import { Trip } from "@/modules/trips/entities/trip.entity";
import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "@/modules/base/entities/base.entity";
import { Geo } from "@/modules/geos/entities/geo.entity";

@Entity('itinerary')
export class Itinerary extends BaseEntity {
  @Column({ type: 'date' })
  day: Date;

  @Column({ type: 'time', nullable: true })
  startTime?: Date;

  @Column({ type: 'time', nullable: true })
  endTime?: Date;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ nullable: true })
  customName?: string;

  @ManyToOne(() => Geo, { nullable: true })
  @JoinColumn({ name: 'geo_id' })
  geo?: Geo;

  @ManyToOne(() => Trip, (trip) => trip.itineraries)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;
}
    