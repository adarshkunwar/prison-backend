import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Prison } from '../entity/Prison';

const PrisonRepo = AppDataSource.getRepository(Prison);

// ------------------------------------------------------------------------------------------

const getCapacity = (object) => {
  return object.blocks.reduce((val, i) => {
    return val + i.capacity;
  }, 0);
};

const getCurrentOccupancy = (object) => {
  return object.blocks.reduce((val, i) => {
    return (
      val +
      i.cells.reduce((val, i) => {
        return val + i.currentOccupancy;
      }, 0)
    );
  }, 0);
};

const getDate = () => {
  const date = new Date();
  const dateStr = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  return dateStr;
};

const updatePrisonSimple = async (prison, id) => {
  const data = await PrisonRepo.findOneBy({ id });
  if (!data) return new AppError(404, 'No Prison Found');
  const capacity = getCapacity(data);
  const currentOccupancy = getCurrentOccupancy(data);
  await PrisonRepo.save({
    ...prison,
    capacity,
    currentOccupancy,
  })
    .then((result) => {
      console.log('result');
    })
    .catch((error) => {
      console.log(error);
    });
};

// ------------------------------------------------------------------------------------------

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
        console.log('result');
        if (!result) {
          return new AppError(404, 'No Prison Found');
        }
        result.capacity = getCapacity(result);
        result.currentOccupancy = getCurrentOccupancy(result);
        res.status(200).json({
          status: 'success',
          result,
        });
        updatePrisonSimple(result, req.params.id);
      })
      .catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });
  } catch (err) {
    return next(new AppError(err.statusCode, err.message));
  }
  console.log('---------------Prison get Single Ended ---------------');
};

const createPrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Prison Create Started---------------');
  try {
    await PrisonRepo.save({
      ...req.body,
      capacity: 0,
      currentOccupancy: 0,
      createdDate: getDate(),
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

const updatePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Prison Update Started---------------');
  try {
    let prison = await PrisonRepo.findOneBy({ id: req.params.id });
    if (!prison) return next(new AppError(404, 'Prison not found'));
    Object.assign(prison, req.body);
    await PrisonRepo.save(prison)
      .then((result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 'error',
          error,
        });
      });
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
  console.log('---------------Prison Update Ended---------------');
};

const deletePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('---------------Prison Delete Started---------------');
  try {
    const prison = await PrisonRepo.findOneBy({ id: req.params.id });
    if (!prison) return next(new AppError(404, 'Prison not found'));

    await PrisonRepo.delete(prison)
      .then((result: any) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error: any) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    console.log(error, 'jjhj');
    next(new AppError(error.statusCode, error.message));
  }
  console.log('---------------Prison Delete Ended---------------');
};

export {
  createPrisonHandler,
  deletePrisonHandler,
  getPrisonHandler,
  getSinglePrisonHandler,
  updatePrisonHandler,
};
