import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Block } from './entity/Block';
import { Cell } from './entity/Cell';
import { Prison } from './entity/Prison';
import { Prisoner } from './entity/Prisoner';
import { User } from './entity/User';
import { Visitor } from './entity/Visitor';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'test',
  database: 'prison_management',
  synchronize: true,
  logging: false,
  entities: [
    'src/entity/**/*.ts',
    Block,
    Cell,
    Prison,
    Prisoner,
    User,
    Visitor,
  ],
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
});
