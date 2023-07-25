import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Block } from './Block';
import { Prisoner } from './Prisoner';
import { Staff } from './Staff';

@Entity()
export class Prison {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ default: 0 })
  capacity: number;

  @Column({ default: 0 })
  currentOccupancy: number;

  @OneToMany(() => Block, (block) => block.prison, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  blocks: Block[];
}
