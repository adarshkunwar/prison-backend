import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Prisoner } from './Prisoner';

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  address: string;

  @Column()
  contactNumber: string;

  @Column()
  dateOfVisit: Date;

  @Column()
  timeOfVisit: string;

  @ManyToOne(() => Prisoner, (prisoner) => prisoner.visitors)
  prisoner: Prisoner;
}
