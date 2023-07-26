import { NextFunction, Request, Response } from 'express';
import AppError from '../../Utils/AppError';
import { AppDataSource } from '../../data-source';
import { Prison } from '../../entity/Prison';

const PrisonRepo = AppDataSource.getRepository(Prison);

const updatePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Prison Updated Started---------------');
  console.log('id: ', req.params.id);
  try {
    const prison = await PrisonRepo.findOneBy({ id: req.params.id });
    if (!prison) {
      return new AppError(404, 'No Prison Found');
    }
    Object.assign(prison, req.body);
    await PrisonRepo.save(prison)
      .then((result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (err) {
    return next(new AppError(err.statusCode, err.message));
  }
  console.log('---------------Prison Updated Ended---------------');
};

export { updatePrisonHandler };
