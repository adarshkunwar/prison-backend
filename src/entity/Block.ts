import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cell } from './Cell';
import { Prison } from './Prison';

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  capacity: number;

  @Column()
  currentOccupancy: number;

  @Column()
  blockName: string;

  @ManyToOne(() => Prison, (prison) => prison.blocks)
  prison: Prison;

  @OneToMany(() => Cell, (cell) => cell.block)
  cells: Cell[];
}
