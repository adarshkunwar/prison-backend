import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Cell } from '../entity/Cell';

const CellRepo = AppDataSource.getRepository(Cell);

export const getCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CellRepo.find()
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

    await CellRepo.save(req.body.Service)
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

    let cells = [];

    req.body.service.map((item) => {
      let data = JSON.parse(item);
      return cells.push(data);
    });

    req.body.service = [...cells];

    console.log(req.body);

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
    await CellRepo.delete(req.params.id)
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
