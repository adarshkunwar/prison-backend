import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Prison } from '../entity/Prison';

const PrisonRepo = AppDataSource.getRepository(Prison);

const getCapacity = (object) => {
  return object.blocks.reduce((val, i) => {
    return val + i.capacity;
  }, 0);
};

const getCurrentOccupancy = (object) => {
  let number = 0;
  object.blocks.forEach((val) => {
    val.cells.forEach((val) => {
      val.prisoners.forEach((val) => {
        number++;
      });
    });
  });
  return number;
};

const sendUpdatedPrison = async (id: string) => {
  try {
    const oldPrison = await PrisonRepo.findOneBy({ id });
    if (!oldPrison) return new AppError(404, 'No Prison Found');

    const capacity = getCapacity(oldPrison);
    const currentOccupancy = getCurrentOccupancy(oldPrison);

    if (
      capacity === oldPrison.capacity &&
      currentOccupancy === oldPrison.currentOccupancy
    )
      return oldPrison;

    const newPrison = Object.assign(oldPrison, {
      capacity,
      currentOccupancy,
    });
    const data = await PrisonRepo.save(newPrison);
    return data;
  } catch (error) {
    return new AppError(
      505,
      'Some Error Occured While Handling Individual Prison'
    );
  }
};

export default sendUpdatedPrison;
