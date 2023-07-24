import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import { Cell } from '../entity/Cell';
import { Prison } from './../entity/Prison';

const BlockRepo = AppDataSource.getRepository(Block);
const PrisonRepo = AppDataSource.getRepository(Prison);
const cellRepo = AppDataSource.getRepository(Cell);

export const getBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BlockRepo.find({
      relations: {
        prison: true,
      },
    });
    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

export const getBlockByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BlockRepo.findOne({
      where: {
        id: req.params.id,
      },
      relations: {
        cells: true,
        prison: true,
      },
    });
    if (!result) {
      return next(new AppError(404, 'Block not found'));
    }
    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

export const postBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prison = await PrisonRepo.findOne({
      where: {
        id: req.body.prison,
      },
    });
    if (!prison) {
      console.log('could not find prison with id of' + req.body.prison);
      return next(new AppError(404, 'could not fidn prison'));
    }

    const result = await BlockRepo.save(req.body);
    res.status(201).json({
      status: 'success',
      result,
    });

    await PrisonRepo.save({
      id: req.body.prison,
      ...prison,
      capacity: prison.capacity + req.body.capacity,
      currentOccupancy: prison.currentOccupancy + req.body.currentOccupancy,
    });

    const cellCapacity = Math.floor(result.capacity / result.totalCell);
    const extraRemaining = Math.floor(result.capacity % result.totalCell);
    try {
      const abc = async () => {
        for (let i = 1; i <= req.body.totalCell; i++) {
          await cellRepo.save({
            cellName: result.blockName + i,
            block: result.id,
            capacity:
              i === req.body.totalCell
                ? cellCapacity + extraRemaining
                : cellCapacity,
            currentOccupancy: 0,
          });
        }
      };
      abc();
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

export const updateBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('update was called');
    const block = await BlockRepo.findOneBy({ id: req.params.id });
    if (!block) {
      return next(new AppError(404, 'Block not found'));
    }

    Object.assign(block, req.body);

    const result = await BlockRepo.save(block);
    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

export const deleteBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const block = await BlockRepo.findOneBy({ id: req.params.id });
    if (!block) {
      return next(new AppError(404, 'Block not found'));
    }
    await BlockRepo.remove(block);
    res.status(204).end();
  } catch (error) {
    next(new AppError(500, error.message));
  }
};
