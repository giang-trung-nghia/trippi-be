import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { BaseEntity } from '@/modules/base/entities/base.entity';
import { Itinerary } from '@/modules/itineraries/entities/itinerary.entity';
import { User } from '@/modules/users/entities/user.entity';
  
  @Entity('trips')
  export class Trip extends BaseEntity {
    @Column()
    name: string;

    @Column()
    budget: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    description: string;

    @ManyToOne(() => User, (user) => user.trips)
    @JoinColumn({ name: 'user_id' })
    user: User;
    
    @OneToMany(() => Itinerary, (itinerary) => itinerary.trip)
    itineraries: Itinerary[];
  }
  