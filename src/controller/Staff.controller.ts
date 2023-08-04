import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { consoleLog, getDate } from '../Utils/date';
import { AppDataSource } from '../data-source';
import { Prison } from '../entity/Prison';
import { Staff } from '../entity/Staff';

const StaffRepo = AppDataSource.getRepository(Staff);
const prisonRepo = AppDataSource.getRepository(Prison);

export const getStaffHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Get Staff Started');
  try {
    await StaffRepo.find({ relations: ['prison'] })
      .then((result) => res.status(200).json({ status: 'success', result }))
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
  consoleLog('Get Staff Ended');
};

export const getSingleStaffHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Get Single Staff Started');
  try {
    await StaffRepo.findOne({
      where: { id: req.params.id },
      relations: ['prison'],
    })
      .then((result) => {
        if (!result) return next(new AppError(404, 'Staff not found'));
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => next(new AppError(error.statusCode, error.message)));
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
  consoleLog('Get Single Staff Ended');
};

export const createStaffHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('Create Single Staff Started');
  console.log('req.body', req.body);
  try {
    const prison = await prisonRepo.findOneBy({ id: req.body.prison });
    if (!prison) return next(new AppError(404, 'Prison not found'));

    await StaffRepo.save({ ...req.body, dateOfJoining: getDate() })
      .then((result) => res.status(200).json({ status: 'success', result }))
      .catch((error) => next(new AppError(error.statusCode, error.message)));
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
};

export const updateStaffHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('update staff started');
  try {
    let staff = await StaffRepo.findOneBy({ id: req.params.id });
    if (!staff) return next(new AppError(404, 'staff not found'));

    Object.assign(staff, req.body);
    await StaffRepo.save(staff)
      .then((result) => res.status(200).json({ status: 'success', result }))
      .catch((error) => new AppError(error.statusCode, error.message));
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
  consoleLog('update Staff ended');
};

export const deleteStaffHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('delete Staff Started');
  try {
    let staff = await StaffRepo.findOneBy({ id: req.params.id });
    if (!staff) return next(new AppError(404, 'staff not found'));
    await StaffRepo.remove(staff)
      .then((result) => res.status(200).json({ status: 'success', result }))
      .catch((error) => next(new AppError(error.statusCode, error.message)));
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
  consoleLog('delete staff ended');
};
