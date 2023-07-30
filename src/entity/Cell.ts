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
  name: string;

  @Column()
  capacity: number;

  @Column()
  currentOccupancy: number;

  @Column()
  createdDate: string;

  @ManyToOne(() => Block, (block) => block.cells, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  block: Block;

  @Column()
  status: 'filled' | 'empty' | 'partial';

  @OneToMany(() => Prisoner, (prisoner) => prisoner.cell, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  prisoners: Prisoner[];
}
