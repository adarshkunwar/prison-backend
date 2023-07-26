import { NextFunction, Request, Response } from 'express';
import AppError from '../../Utils/AppError';
import { AppDataSource } from '../../data-source';
import { Prison } from '../../entity/Prison';

const PrisonRepo = AppDataSource.getRepository(Prison);

const getPrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Prison get Single Started ---------------');
  try {
    await PrisonRepo.find()
      .then((result) => {
        if (!result) {
          return new AppError(404, 'No Prison Found');
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
    return next(new AppError(error.statusCode, error.message));
  }
  console.log('---------------Prison get Single Ended ---------------');
};

const getSinglePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Prison get Single Started ---------------');
  try {
    await PrisonRepo.findOneBy({ id: req.params.id })
      .then((result) => {
        if (!result) {
          return new AppError(404, 'No Prison Found');
        }
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });
  } catch (err) {
    return next(new AppError(err.statusCode, err.message));
  }
  console.log('---------------Prison get Single Ended ---------------');
};

export { getPrisonHandler, getSinglePrisonHandler };
