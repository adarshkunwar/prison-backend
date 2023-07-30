import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import { Cell } from '../entity/Cell';
import AppError from './AppError';
import sendUpdatedBlock from './getBlock';

const cellRepo = AppDataSource.getRepository(Cell);
const blockRepo = AppDataSource.getRepository(Block);

const getOccupancy = (object) => {
  return object.prisoners.length;
};

export const getStatus = (object) => {
  if (object.capacity === object.currentOccupancy) return 'filled';
  else if (object.currentOccupancy === 0) return 'empty';
  else return 'partial';
};

export const checkEmptySpace = async (id) => {
  const block = await blockRepo.findOneBy({ id });
  if (!block) return 0;
  const blockCapacity = block.capacity;
  const blockOccupied = block.currentOccupancy;

  return blockCapacity - blockOccupied;
};

export const sendUpdatedCell = async (id) => {
  const cell = await cellRepo.findOne({ where: { id }, relations: ['block'] });
  if (!cell) throw new AppError(404, 'No Cell Found');

  const cellOccupancy = getOccupancy(cell);
  const status = getStatus(cell);
  if (cellOccupancy === cell.currentOccupancy && status === cell.status) {
    return cell;
  }

  const newCell = Object.assign(cell, {
    currentOccupancy: cellOccupancy,
    status: status,
  });
  const data = await cellRepo.save(newCell);
  const updatedBlock = sendUpdatedBlock(cell.block.id);
  return data;
};
