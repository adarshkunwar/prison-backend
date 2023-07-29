import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { consoleLog, getDate } from '../Utils/date';
import sendUpdatedPrison from '../Utils/getPrison';
import { AppDataSource } from '../data-source';
import { Prison } from '../entity/Prison';
const PrisonRepo = AppDataSource.getRepository(Prison);

export const getPrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Prison get Started');
  try {
    const prison = await PrisonRepo.find();
    if (!prison) return new AppError(404, 'No Prison Found');

    const newPrison = [];
    for (let i = 0; i < prison.length; i++) {
      const updatedPrison = await sendUpdatedPrison(prison[i].id);
      newPrison.push(updatedPrison);
    }

    res.status(200).json({
      status: 'success',
      result: newPrison,
    });
  } catch (error) {
    return next(new AppError(502, error.message));
  }
};

export const getSinglePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Prison get Single Started');
  try {
    const singlePrison = await PrisonRepo.findOneBy({ id: req.params.id });
    if (!singlePrison) return new AppError(404, 'No Prison Found');

    const updatedPrison = await sendUpdatedPrison(req.params.id);

    res.status(200).json({
      status: 'success',
      result: updatedPrison,
    });
  } catch (err) {
    return next(new AppError(err.statusCode, err.message));
  }
  consoleLog('Prison get Single Ended');
};

export const createPrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Prison Create Started');
  try {
    await PrisonRepo.save({
      ...req.body,
      capacity: 0,
      currentOccupancy: 0,
      description: req.body.description || 'No description provided',
      createdDate: getDate(),
    })
      .then((result) =>
        res.status(200).json({
          status: 'success',
          result,
        })
      )
      .catch(() => next(new AppError(504, 'could not save new prison')));
  } catch (err) {
    return next(new AppError(500, 'some error occured'));
  }
  consoleLog('Prison Create Ended');
};

export const updatePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Prison Update Started');
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
  consoleLog('Prison Update Ended');
};

export const deletePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Prison Delete Started');
  try {
    const prison = await PrisonRepo.findOneBy({ id: req.params.id });
    if (!prison) return next(new AppError(404, 'Prison not found'));

    await PrisonRepo.remove(prison)
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
    next(new AppError(error.statusCode, error.message));
  }
  consoleLog('Prison Delete Ended');
};
