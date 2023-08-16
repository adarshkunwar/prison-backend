import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { consoleLog, getDate } from '../Utils/date';
import { sendUpdatedCell } from '../Utils/getCell';
import { AppDataSource } from '../data-source';
import { Cell } from '../entity/Cell';
import { Prisoner } from '../entity/Prisoner';

const PrisonerRepo = AppDataSource.getRepository(Prisoner);
const cellRepo = AppDataSource.getRepository(Cell);

const checkCellSpace = (cell) => {
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
    await PrisonerRepo.findOne({
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
    console.log(req.body, 'adf');
    if (req.file) req.body.image = req.file.filename;
    const data = await cellRepo.findOneBy({ id: req.body.cell });

    if (!data) return next(new AppError(404, 'Cell not found'));
    const space = await checkCellSpace(data);
    if (space < 1) return next(new AppError(480, 'Cell is full'));

    await PrisonerRepo.save({
      ...req.body,
      age: parseInt(req.body.age),
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
    const data = await PrisonerRepo.findOneBy({ id: req.params.id });
    if (!data) return next(new AppError(404, 'Prisoner not found'));

    Object.assign(data, req.body);
    console.log(data, 'data');

    PrisonerRepo.save({
      ...data,
      age: parseInt(req.body.age) || data.age,
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

export const movePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisoner = await PrisonerRepo.findOne({
      where: { id: req.params.id },
      relations: ['cell'],
    });
    if (!prisoner) return next(new AppError(404, 'prisoner does not exist'));

    const newPrison = await cellRepo.findOneBy({ id: req.params.id });
    if (!newPrison) return next(new AppError(404, 'cell not found'));
    const newCheck = checkCellSpace(newPrison);
    if (newCheck < 1) return next(new AppError(406, 'no empty space'));
    Object.assign(prisoner, req.body);
    PrisonerRepo.save(prisoner).then((result) => {
      res.status(200).json({
        status: 'success',
        result,
      });
      const oldCellUpdate = sendUpdatedCell(prisoner.cell.id);
      const newCellUpdate = sendUpdatedCell(req.body.cell);
    });
  } catch (err) {
    return next(new AppError(err.statusCode, err.message));
  }
};

export const deletePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisoner = await PrisonerRepo.findOneBy({ id: req.params.id });
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
