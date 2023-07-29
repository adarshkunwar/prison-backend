import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import AppError from './AppError';
import sendUpdatedPrison from './getPrison';
const BlockRepo = AppDataSource.getRepository(Block);

const getTotalCell = (object) => {
  return object.capacity;
};

const getCurrentOccupancy = (object) => {
  let number = 0;
  object.cells.forEach((val) => {
    val.prisoners.forEach((val) => {
      number++;
    });
  });
  return number;
};

const sendUpdatedBlock = async (id: string) => {
  try {
    const oldBlock = await BlockRepo.findOne({
      where: { id },
      relations: ['prison'],
    });
    if (!oldBlock) return new AppError(404, 'No Block Found');

    const totalCell = getTotalCell(oldBlock);
    const currentOccupancy = getCurrentOccupancy(oldBlock);

    if (
      currentOccupancy === oldBlock.currentOccupancy &&
      totalCell === oldBlock.totalCell
    )
      return oldBlock;

    const newBlock = Object.assign(oldBlock, {
      totalCell,
      currentOccupancy,
    });
    const data = await BlockRepo.save(newBlock);
    const prison = sendUpdatedPrison(data.prison.id);
    return data;
  } catch (error) {
    return new AppError(
      505,
      'Some Error Occured While Handling Individual Block'
    );
  }
};

export default sendUpdatedBlock;
