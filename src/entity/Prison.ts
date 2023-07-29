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

  @Column({ default: 0 })
  capacity: number;

  @Column({ default: 0 })
  currentOccupancy: number;

  @Column()
  createdDate: string;

  @Column()
  description: string;

  @OneToMany(() => Block, (block) => block.prison, {
    eager: true,
    cascade: ['remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  blocks: Block[];

  @OneToMany(() => Staff, (staff) => staff.prison, {
    eager: true,
    cascade: ['remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  staffs: Staff[];
}
