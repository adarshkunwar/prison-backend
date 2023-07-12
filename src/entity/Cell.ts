import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Block } from './Block';
import { Prisoner } from './Prisoner';

@Entity()
export class Cell {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cellNumber: number;

  @Column()
  capacity: number;

  @Column()
  currentOccupancy: number;

  @ManyToOne(() => Block, (block) => block.cells)
  block: Block;

  @OneToMany(() => Prisoner, (prisoner) => prisoner.cell, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  prisoners: Prisoner[];
}
