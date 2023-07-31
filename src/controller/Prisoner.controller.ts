import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { consoleLog, getDate } from '../Utils/date';
import { sendUpdatedCell } from '../Utils/getCell';
import { AppDataSource } from '../data-source';
import { Cell } from '../entity/Cell';
import { Prisoner } from '../entity/Prisoner';

const PrisonerRepo = AppDataSource.getRepository(Prisoner);
const cellRepo = AppDataSource.getRepository(Cell);

const checkCellSpace = async (cell) => {
  if (cell.capacity <= cell.currentOccupancy) return 0;
  return cell.capacity - cell.currentOccupancy;
};

export const getPrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('get Prisoner Started');
  try {
    await PrisonerRepo.find({ relations: ['cell'] })
      .then((result) => {
        if (!result) return next(new AppError(404, 'Prisoner not found'));
        return res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
  consoleLog('get Prisoner Ended');
};

export const getSinglePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('get single prisoner started' + req.params.id);
  try {
    await PrisonerRepo.find({
      where: { id: req.params.id },
      relations: ['cell'],
    })
      .then((result) => {
        if (!result) return next(new AppError(404, 'Prisoner not found'));
        return res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
  consoleLog('get single prisoner ended');
};

export const createPrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('create prisoner started');
  try {
    const data = await cellRepo.findOneBy({ id: req.body.cell });

    if (!data) return next(new AppError(404, 'Cell not found'));
    const space = await checkCellSpace(data);
    if (space <= 0) return next(new AppError(404, 'Cell is full'));

    await PrisonerRepo.save({
      ...req.body,
      age: parseInt(req.body.age),
      contactNumber: parseInt(req.body.contactNumber),
      dateOfAdmission: getDate(),
    })
      .then(async (result) => {
        if (!result)
          return next(new AppError(404, 'Prisoner Could not be saved'));
        res.status(200).json({
          status: 'success',
          result,
        });
        const updatedCell = sendUpdatedCell(req.body.cell);
      })
      .catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
  consoleLog('create prisoner ended');
};

export const updatePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('update prisoner started');
  try {
    const data = await PrisonerRepo.findOne({
      where: { id: req.params.id },
      relations: ['cell'],
    });
    if (!data) return next(new AppError(404, 'Prisoner not found'));

    if (req.body.cell) {
      const cellNew = await cellRepo.findOneBy({ id: req.body.cell });
      if (!cellNew) return next(new AppError(404, 'Cell not found'));
      if ((await checkCellSpace(cellNew)) <= 0)
        return next(new AppError(404, 'Cell is full'));

      const cellOld = await cellRepo.findOneBy({ id: data.cell.id });
      console.log(cellOld.id, cellNew.id);
      if (cellOld.id !== cellNew.id) {
        cellOld.prisoners.filter((prisoner) => prisoner.id !== data.id);
        const temp = await cellRepo.save({
          ...cellOld,
          currentOccupancy: cellOld.currentOccupancy - 1,
        });
        const temp2 = sendUpdatedCell(temp.id);
      }
    }
    Object.assign(data, req.body);
    PrisonerRepo.save({
      ...data,
      age: parseInt(req.body.age) || data.age,
      contactNumber: parseInt(req.body.contactNumber) || data.contactNumber,
    })
      .then((result) => {
        if (!result) return next(new AppError(404, 'Prisoner not found'));
        res.status(200).json({
          status: 'success',
          result,
        });
        const updatedCell = sendUpdatedCell(req.body.cell);
      })
      .catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
};

export const deletePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisoner = await PrisonerRepo.findOne({
      where: { id: req.params.id },
      relations: ['cell'],
    });
    if (!prisoner) return next(new AppError(404, 'Prisoner not found'));

    await PrisonerRepo.remove(prisoner)
      .then(async (result) => {
        if (!result) return next(new AppError(404, 'Prisoner not found'));
        res.status(200).json({
          status: 'success',
          result,
        });
        const updatedCell = sendUpdatedCell(prisoner.cell.id);
      })
      .catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
};
