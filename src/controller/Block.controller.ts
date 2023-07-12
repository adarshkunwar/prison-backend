import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';

const BlockRepo = AppDataSource.getRepository(Block);

export const getBlockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BlockRepo.find();
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
    const result = await BlockRepo.save(req.body);
    res.status(201).json({
      status: 'success',
      result,
    });
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
