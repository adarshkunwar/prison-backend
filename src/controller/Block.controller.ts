import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { consoleLog, getDate } from '../Utils/date';
import sendUpdatedBlock from '../Utils/getBlock';
import sendUpdatedPrison from '../Utils/getPrison';
import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import { Prison } from './../entity/Prison';

const BlockRepo = AppDataSource.getRepository(Block);
const PrisonRepo = AppDataSource.getRepository(Prison);

export const getBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Block get Started');
  try {
    const result = await BlockRepo.find();
    if (!result) return next(new AppError(404, 'No Block Found'));

    const newBlock = [];

    for (let i = 0; i < result.length; i++) {
      const block = await sendUpdatedBlock(result[i].id);
      newBlock.push(block);
    }

    res.status(200).json({
      status: 'success',
      result: newBlock,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
  consoleLog('Block get Ended');
};

export const getSingleBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Block get Single Started');
  try {
    const oldPrison = await BlockRepo.findOneBy({ id: req.params.id });
    if (!oldPrison) return next(new AppError(404, 'No Block Found'));

    const newPrison = await sendUpdatedBlock(req.params.id);

    res.status(200).json({
      status: 'success',
      result: newPrison,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
  console.log('---------------Block get Single End ---------------');
};

export const createBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Block Create Started');
  try {
    const prison = await PrisonRepo.findOneBy({ id: req.body.prisonId });
    if (!prison) return next(new AppError(404, 'Prison not found'));

    console.log(req.body);
    const data = await BlockRepo.save({
      ...req.body,
      capacity: parseInt(req.body.capacity),
      totalCell: req.body.totalCell ? parseInt(req.body.totalCell) : 0,
      createdDate: getDate(),
      currentOccupancy: 0,
    })
      .then((result) =>
        res.status(200).json({
          status: 'success',
          result,
        })
      )
      .catch((err) => next(new AppError(err.statusCode, err.message)));
    console.log(data);
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  consoleLog('Block Create Ended');
};

export const updateBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Block Update Started');
  try {
    const block = await BlockRepo.findOneBy({ id: req.params.id });
    if (!block) return next(new AppError(404, 'Block not found'));

    Object.assign(block, {
      ...req.body,
      capacity: parseInt(req.body.capacity),
      currentOccupancy: req.body.currentOccupancy
        ? parseInt(req.body.currentOccupancy)
        : block.currentOccupancy,
    });
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
  consoleLog('Block Update Ended');
};

export const deleteBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Block Delete Started');
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
  consoleLog('Block Delete Ended');
};
