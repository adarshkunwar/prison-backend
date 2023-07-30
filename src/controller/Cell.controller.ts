import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { consoleLog, getDate } from '../Utils/date';
import sendUpdatedBlock from '../Utils/getBlock';
import { checkEmptySpace, getStatus, sendUpdatedCell } from '../Utils/getCell';
import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import { Cell } from '../entity/Cell';

const CellRepo = AppDataSource.getRepository(Cell);
const BlockRepo = AppDataSource.getRepository(Block);

export const getCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('cell Get Started');
  try {
    const result = await CellRepo.find();
    if (!result) return next(new AppError(404, 'No Cell Found'));

    const updatedCell = [];
    for (let i = 0; i < result.length; i++) {
      console.log('result', result[i].id);
      const updatedData = await sendUpdatedCell(result[i].id);
      console.log('updatedData', updatedData);
      updatedCell.push(updatedData);
    }

    console.log('updatedCell', updatedCell);
    res.status(200).json({
      status: 'success',
      result: updatedCell,
    });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  consoleLog('cell Get Ended');
};

export const getSingleCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('cell get Single Started');
  try {
    const result = await sendUpdatedCell(req.params.id);

    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  consoleLog('cell get Single Ended');
};

export const createCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('cell Create Started');
  try {
    const block = await BlockRepo.findOneBy({ id: req.body.block });
    if (!block) return next(new AppError(404, 'No Block Found By this ID'));

    const check = await checkEmptySpace(req.body.block);
    const cellCapacity = parseInt(req.body.capacity);
    if (check < cellCapacity)
      return next(new AppError(400, 'Not Enough Space'));

    await CellRepo.save({
      ...req.body,
      capacity: cellCapacity,
      currentOccupancy: 0,
      status: 'empty',
      createdDate: getDate(),
    })
      .then((result) => {
        const updatedBlock = sendUpdatedBlock(req.body.block);
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  consoleLog('cell Create Ended');
};

export const updateCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('cell Update Started');
  try {
    const block = await sendUpdatedBlock(req.body.blockId);
    if (!block) return next(new AppError(404, 'No Block Found By this ID'));
    const cell = await sendUpdatedCell(req.params.id);

    const check = await checkEmptySpace(req.body.blockId);
    if (check < req.body.capacity)
      return next(new AppError(400, 'Not Enough Space'));

    if (req.body.capacity < cell.currentOccupancy)
      return next(new AppError(400, 'Current Occupancy is more than Capacity'));

    Object.assign(cell, {
      ...req.body,
      capacity: parseInt(req.body.capacity),
      status: getStatus(req.body),
    });

    await CellRepo.save(cell)
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
    return next(new AppError(500, error.message));
  }
  consoleLog('cell Update Ended');
};

export const deleteCellHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  consoleLog('cell Delete Started');
  try {
    const cell = await sendUpdatedCell(req.params.id);

    await CellRepo.remove(cell)
      .then((result) => {
        const updatedBlock = sendUpdatedBlock(cell.block.id);
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
  consoleLog('cell Delete Ended');
};
