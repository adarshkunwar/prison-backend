import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cell } from './Cell';
import { Prison } from './Prison';
import { Prisoner } from './Prisoner';

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

  @Column()
  totalCell: number;

  @ManyToOne(() => Prison, (prison) => prison.blocks, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  prison: Prison;

  @OneToMany(() => Cell, (cell) => cell.block, {
    eager: true,
  })
  cells: Cell[];

  // @OneToMany(() => Prisoner, (prisoner) => prisoner.block)
  // prisoners: Prisoner[];
}
