import { NextFunction, Request, Response } from 'express';
import AppError from '../../Utils/AppError';
import { AppDataSource } from '../../data-source';
import { Prison } from '../../entity/Prison';

const PrisonRepo = AppDataSource.getRepository(Prison);

const createPrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Prison Create Started---------------');
  console.log(req.body);

  const date = new Date();
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  try {
    await PrisonRepo.save({
      ...req.body,
      capacity: 0,
      currentOccupancy: 0,
      createdDate: dateStr,
    })
      .then((result) =>
        res.status(200).json({
          status: 'success',
          result,
        })
      )
      .catch((error) => next(new AppError(error.statusCode, error.message)));
  } catch (err) {
    return next(new AppError(err.statusCode, err.message));
  }
  console.log('---------------Prison Create Ended---------------');
};

export { createPrisonHandler };
