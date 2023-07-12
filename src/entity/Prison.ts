import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Block } from './Block';
import { Staff } from './Staff';

@Entity()
export class Prison {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  capacity: number;

  @Column()
  currentOccupancy: number;

  @OneToMany(() => Block, (block) => block.prison, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  blocks: Block[];

  @OneToMany(() => Staff, (staff) => staff.prison, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  staffs: Staff[];
}
