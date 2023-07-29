import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import { Cell } from '../entity/Cell';

const CellRepo = AppDataSource.getRepository(Cell);
const BlockRepo = AppDataSource.getRepository(Block);

// ------------------------------------------------------------------------------------------

const getCurrentOccupancy = (object) => {
  let currentOccupancy = 0;
  console.log(object.prisoners, 'prisoner');
  return object.prisoners.length;
};

const getCapacity = (object) => {
  return object.capacity;
};

const checkBlock = (object, newData) => {
  const capacity = getCapacity(object);
  const currentOccupancy = getCurrentOccupancy(object);
  const availableCapacityBlock = capacity - currentOccupancy;
  if (newData.capacity > availableCapacityBlock) return false;
  else return true;
};

const updateBlock = async (id) => {
  const cell = await CellRepo.findOneBy({ id });
  const currentOccupancy = getCurrentOccupancy(cell);

  cell.currentOccupancy = currentOccupancy;

  await CellRepo.save(cell);
};

// ------------------------------------------------------------------------------------------

export const getCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Cell get Started ---------------');
  try {
    const result = await CellRepo.find();
    if (!result) return next(new AppError(404, 'No Cell Found'));

    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  console.log('---------------Cell get Ended ---------------');
};

export const getSingleCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Cell get Single Started ---------------');
  try {
    const result = await CellRepo.findOneBy({ id: req.params.id });
    if (!result) return next(new AppError(404, 'No Cell Found'));
    const updatedData = updateBlock(req.params.id);
    res.status(200).json({
      status: 'success',
      updatedData,
    });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  console.log('---------------Cell get Single Ended ---------------');
};

export const createCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Cell Create Started ---------------');
  try {
    const block = await BlockRepo.findOneBy({ id: req.body.blockId });
    if (!block) return next(new AppError(404, 'No Block Found By this ID'));

    if (!checkBlock(block, req.body))
      return next(
        new AppError(400, 'Capacity cannot be greater than block capacity')
      );

    await CellRepo.save(req.body)
      .then((result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  console.log('---------------Cell Create Ended ---------------');
};

export const updateCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Cell Update Started ---------------');
  try {
    const block = await BlockRepo.findOneBy({ id: req.body.blockId });
    let cell = await CellRepo.findOneBy({ id: req.params.id });
    if (!cell) return next(new AppError(404, 'No Cell Found By this ID'));

    if (!checkBlock(block, req.body))
      return next(
        new AppError(400, 'Capacity cannot be greater than block capacity')
      );

    Object.assign(cell, req.body);

    await CellRepo.save(cell)
      .then((result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  console.log('---------------Cell Update Ended ---------------');
};

export const deleteCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Cell Delete Started ---------------');
  try {
    const cell = await CellRepo.findOneBy({ id: req.params.id });
    if (!cell) return next(new AppError(404, 'No Cell Found By this ID'));

    await CellRepo.remove(cell)
      .then((result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  console.log('---------------Cell Delete Started ---------------');
};
