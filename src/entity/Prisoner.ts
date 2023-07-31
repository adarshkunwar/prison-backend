import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Cell } from './Cell';
import { Visitor } from './Visitor';

@Entity()
export class Prisoner {
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
  contactNumber: number;

  @Column()
  dateOfAdmission: string;

  @Column()
  dateOfRelease: string;

  @Column()
  crime: string;

  @Column()
  image: string;

  @ManyToOne(() => Cell, (cell) => cell.prisoners, {
    // eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  cell: Cell;

  @OneToMany(() => Visitor, (visitor) => visitor.prisoner, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  visitors: Visitor[];

  @Column()
  latestVisit: string;
}
