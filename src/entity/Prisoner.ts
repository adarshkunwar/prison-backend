import {
  Column,
  CreateDateColumn,
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
  contactNumber: string;

  @CreateDateColumn()
  dateOfAdmission: Date;

  @Column()
  dateOfRelease: Date;

  @Column()
  crime: string;

  @ManyToOne(() => Cell, (cell) => cell.prisoners)
  cell: Cell;

  @OneToMany(() => Visitor, (visitor) => visitor.prisoner, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  visitors: Visitor[];

  @Column()
  latestVisit: Date;
}
