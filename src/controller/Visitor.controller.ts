import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { consoleLog, getDate } from '../Utils/date';
import { AppDataSource } from '../data-source';
import { Prisoner } from '../entity/Prisoner';
import { Visitor } from '../entity/Visitor';

const VisitorRepo = AppDataSource.getRepository(Visitor);
const PrisonerRepo = AppDataSource.getRepository(Prisoner);

export const getVisitorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Visitor get Started');
  try {
    await VisitorRepo.find({ relations: ['prisoner'] })
      .then((result) => {
        if (!result) return next(new AppError(404, 'No Visitor Found'));
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((err) => next(new AppError(err.statusCode, err.message)));
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
  consoleLog('Visitor get Ended');
};

export const getSingleVisitorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Visitor Single Get Started');
  try {
    await VisitorRepo.findOne({
      where: { id: req.params.id },
      relations: ['prisoner'],
    })
      .then((result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((err) => next(new AppError(err.statusCode, err.message)));
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
  consoleLog('Visitor Single Get Ended');
};

export const createVisitorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Visitor Add Started');
  try {
    const prisoner = await PrisonerRepo.findOneBy({ id: req.body.prisoner });
    if (!prisoner) return next(new AppError(404, 'Prisoner Not Found'));

    await VisitorRepo.save({
      ...req.body,
      age: parseInt(req.body.age),
      dateOfVisit: getDate(),
    })
      .then((result) => {
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((err) => next(new AppError(err.statusCode, err.message)));
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
  consoleLog('Visitor Add Ended');
};

export const updateVisitorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const visitor = await VisitorRepo.findOneBy({ id: req.params.id });
    if (!visitor) return next(new AppError(404, 'no Visitor found'));

    Object.assign(visitor, req.body);
    await VisitorRepo.save({
      ...visitor,
      age: req.body.age ? parseInt(req.body.age) : visitor.age,
    })
      .then((result) =>
        res.status(200).json({
          status: 'Success',
          result,
        })
      )
      .catch((err) => next(new AppError(err.statusCode, err.message)));
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
};

export const deleteVisitorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const visitor = await VisitorRepo.findOneBy({ id: req.params.id });
    if (!visitor) next(new AppError(404, 'No Visitor Found'));

    await VisitorRepo.remove(visitor)
      .then((result) =>
        res.status(200).json({
          status: 'success',
          result,
        })
      )
      .catch((err) => next(new AppError(err.statusCode, err.message)));
  } catch (err) {
    return next(new AppError(err.statusCode, err.message));
  }
};
