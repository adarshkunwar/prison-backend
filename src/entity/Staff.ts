import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Prison } from './Prison';

@Entity()
export class Staff {
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
  contactNumber: string;

  @Column()
  dateOfJoining: Date;

  @Column()
  salary: number;

  @Column()
  designation: string;

  @ManyToOne(() => Prison, (prison) => prison.staffs)
  prison: Prison;
}
