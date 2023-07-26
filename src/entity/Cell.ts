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
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  cellName: string;

  @Column()
  capacity: number;

  @Column()
  currentOccupancy: number;

  @ManyToOne(() => Block, (block) => block.cells)
  block: Block;

  @OneToMany(() => Prisoner, (prisoner) => prisoner.cell, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  prisoners: Prisoner[];
}
