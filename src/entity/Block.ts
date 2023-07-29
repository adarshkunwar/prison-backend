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
  name: string;

  @Column()
  totalCell: number;

  @Column()
  createdDate: string;

  @ManyToOne(() => Prison, (prison) => prison.blocks, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  prison: Prison;

  @OneToMany(() => Cell, (cell) => cell.block, {
    eager: true,
    cascade: ['remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cells: Cell[];
}
