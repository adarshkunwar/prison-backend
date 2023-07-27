import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import { Prison } from './../entity/Prison';

const BlockRepo = AppDataSource.getRepository(Block);
const PrisonRepo = AppDataSource.getRepository(Prison);

// ------------------------------------------------------------------------------------------

const getCurrentOccupancy = (object) => {
  return object.cells.reduce((val, i) => {
    return val + i.currentOccupancy;
  }, 0);
};

const getCells = (object) => {
  return object.cells.length;
};

const updateBlockSimple = async (block, id) => {
  const data = await BlockRepo.findOneBy({ id });
  if (!data) return new AppError(404, 'No Block Found');
  const currentOccupancy = getCurrentOccupancy(data);
  const totalCell = getCells(data);
  await BlockRepo.save({
    ...block,
    currentOccupancy,
    totalCell,
  })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

// ------------------------------------------------------------------------------------------

const getBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Block get Single Started ---------------');
  try {
    const result = await BlockRepo.find();
    if (!result) return next(new AppError(404, 'No Block Found'));
    result.map((val) => {
      val.currentOccupancy = getCurrentOccupancy(val);
      val.totalCell = getCells(val);
    });
    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
  console.log('---------------Block get Single End ---------------');
};

const getSingleBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Block get Single Started ---------------');
  try {
    await BlockRepo.findOneBy({ id: req.params.id })
      .then((result) => {
        if (!result) return next(new AppError(404, 'No Block Found'));
        result.currentOccupancy = getCurrentOccupancy(result);
        result.totalCell = getCells(result);
        res.status(200).json({
          status: 'success',
          result,
        });
        updateBlockSimple(result, req.params.id);
      })
      .catch((error) => {
        next(new AppError(400, error.message));
      });
  } catch (error) {
    next(new AppError(500, error.message));
  }
  console.log('---------------Block get Single End ---------------');
};

const createBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Block Create Started ---------------');
  try {
    const prison = await PrisonRepo.findOneBy({ id: req.body.prison });
    if (!prison) return next(new AppError(404, 'No Prison Found'));

    await BlockRepo.save({
      ...req.body,
      totalCell: 0,
      currentOccupancy: 0,
    })
      .then(async (result) => {
        res.status(201).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        return next(new AppError(400, error.message));
      });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  console.log('---------------Block Create End ---------------');
};

const updateBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Block Update Started ---------------');
  try {
    const block = await BlockRepo.findOneBy({ id: req.params.id });
    if (!block) {
      return next(new AppError(404, 'Block not found'));
    }
    Object.assign(block, req.body);
    await BlockRepo.save(block)
      .then(async (result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        return next(new AppError(400, error.message));
      });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  console.log('---------------Block Update Ended ---------------');
};

const deleteBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Block Delete Started ---------------');
  try {
    const block = await BlockRepo.findOneBy({ id: req.params.id });
    if (!block) return next(new AppError(404, 'No Block Found'));
    await BlockRepo.remove(block)
      .then(async (result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        return next(new AppError(400, error.message));
      });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  console.log('---------------Block Delete Ended ---------------');
};

export {
  createBlockHandler,
  deleteBlockHandler,
  getBlockHandler,
  getSingleBlockHandler,
  updateBlockHandler,
};
