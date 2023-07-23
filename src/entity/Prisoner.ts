import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Block } from './Block';
import { Cell } from './Cell';
import { Prison } from './Prison';
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

  @CreateDateColumn()
  dateOfAdmission: Date;

  @Column()
  dateOfRelease: string;

  @Column()
  crime: string;

  // @Column()
  // image: string;

  @ManyToOne(() => Cell, (cell) => cell.prisoners)
  cell: Cell;

  @ManyToOne(() => Block, (block) => block.prisoners)
  block: Block;

  @ManyToOne(() => Prison, (prison) => prison.prisoners)
  prison: Prison;

  @OneToMany(() => Visitor, (visitor) => visitor.prisoner, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  visitors: Visitor[];

  @Column()
  latestVisit: string;
}
