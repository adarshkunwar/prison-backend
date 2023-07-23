import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import { Cell } from '../entity/Cell';
import { Prison } from '../entity/Prison';

const CellRepo = AppDataSource.getRepository(Cell);
const BlockRepo = AppDataSource.getRepository(Block);
const PrisonRepo = AppDataSource.getRepository(Prison);

export const getCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CellRepo.find({
      relations: {
        block: true,
      },
    })
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
    next(new AppError(error.statusCode, error.message));
  }
};

export const getCellByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CellRepo.findOne({
      where: {
        id: req.params.id,
      },
      relations: {
        block: true,
        prisoners: true,
      },
    })
      .then((result) => {
        if (!result) {
          return next(new AppError(404, 'Cell not found'));
        }
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
};

export const postCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    if (req.body.currentOccupancy > req.body.capacity) {
      return next(
        new AppError(400, 'Current occupancy cannot be greater than capacity')
      );
    }
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
    next(new AppError(error.statusCode, error.message));
  }
};

export const updateCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let service = await CellRepo.findOneBy({ id: req.params.id });

    if (!service) {
      return next(new AppError(404, 'Cell not found'));
    }

    if (req.body.currentOccupancy > req.body.capacity) {
      return next(
        new AppError(400, 'Current occupancy cannot be greater than capacity')
      );
    }

    Object.assign(service, req.body);

    await CellRepo.save(service)
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
    next(new AppError(error.statusCode, error.message));
  }
};

export const deleteCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cell = await CellRepo.find({
      where: {
        id: req.params.id,
      },
      relations: {
        block: true,
      },
    });
    if (!cell) {
      return next(new AppError(404, 'cell not found'));
    }
    await CellRepo.remove(cell)
      .then(async (result) => {
        console.log(result);
        await BlockRepo.update(result[0].block.id, {
          capacity: result[0].block.capacity - result[0].capacity,
          currentOccupancy:
            result[0].block.currentOccupancy - result[0].currentOccupancy,
        });
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
};
