import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Cell } from '../entity/Cell';
import { Prisoner } from '../entity/Prisoner';
// import { Block } from '../entity/Block';
// import { Prison } from '../entity/Prison';

const PrisonerRepo = AppDataSource.getRepository(Prisoner);
const cellRepo = AppDataSource.getRepository(Cell);
// const blockRepo = AppDataSource.getRepository(Block);
// const prisonRepo = AppDataSource.getRepository(Prison);

// ----------------------------------------------------------------------------------------
const check = (cell) => {
  if (cell.currentOccupancy < cell.capacity) {
    return true;
  }
  return false;
};
const createConsole = (message) => {
  const string = `----------${message}----------`;
  return string;
};

const getData = async (id) => {
  const data = await cellRepo.findOne({
    where: { id },
    relations: ['cell'],
  });
  return data;
};
// ----------------------------------------------------------------------------------------

export const getPrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(createConsole('get Prisoner Started'));
  try {
    await PrisonerRepo.find({
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
  console.log(createConsole('get Prisoner Ended'));
};

// ----------------------------------------------------------------------------------------

export const getSinglePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(createConsole('get single prisoner started' + req.params.id));
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
  console.log(createConsole('get single prisoner ended' + req.params.id));
};

// ----------------------------------------------------------------------------------------

export const createPrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(createConsole('create prisoner start'));
  try {
    const data = await cellRepo.findOneBy({ id: req.body.cell });

    if (!data) return next(new AppError(404, 'Cell not found'));
    if (!check(data)) return next(new AppError(404, 'Cell is full'));

    await PrisonerRepo.save({
      ...req.body,
      age: parseInt(req.body.age),
      contactNumber: parseInt(req.body.contactNumber),
    }).then(async (result) => {
      if (!result) return next(new AppError(404, 'Prisoner not found'));
      Object.assign(result, { cell: data });
      await cellRepo
        .save({
          ...data,
          currentOccupancy: data.currentOccupancy + 1,
          prisoners: [...data.prisoners, result],
        })
        .then(async (result) => {
          res.status(200).json({
            status: 'success',
            result,
          });
        })
        .catch((error) => {
          return next(new AppError(error.statusCode, error.message));
        });
    });
  } catch (error) {
    return next(new AppError(error.statusCode, error.message));
  }
  console.log(createConsole('create prisoner ended'));
};

// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

export const updatePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(createConsole('move prisoner started'));
  try {
    const cellNew = await cellRepo.findOneBy({ id: req.body.cell });
    if (!cellNew) return next(new AppError(404, 'Cell not found'));

    const data = await PrisonerRepo.findOne({
      where: { id: req.params.id },
      relations: ['cell'],
    });
    if (!data) return next(new AppError(404, 'Prisoner not found'));

    const cellOld = await cellRepo.findOneBy({ id: data.cell.id });
    console.log(cellOld.id, cellNew.id);
    if (cellOld.id !== cellNew.id) {
      cellOld.currentOccupancy -= 1;
      cellNew.currentOccupancy += 1;

      cellOld.prisoners.filter((val) => val.id !== req.params.id);
      cellNew.prisoners = [...cellNew.prisoners, data];

      Object.assign(cellOld, req.body);
      await cellRepo.save(cellOld).catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });

      Object.assign(cellNew, req.body);
      await cellRepo.save(cellNew).catch((error) => {
        return next(new AppError(error.statusCode, error.message));
      });
    }

    Object.assign(data, req.body);
    PrisonerRepo.save(data)
      .then((result) => {
        if (!result) return next(new AppError(404, 'Prisoner not found'));
        res.status(200).json({
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
};

// ----------------------------------------------------------------------------------------
// TODO: yet to work on delete
export const deletePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve the existing Block entity based on the id provided in the request parameters
    let Service = await PrisonerRepo.findOneBy({ id: req.params.id });

    if (!Service) {
      // If the Block entity is not found, pass a 404 status code and "Block not found" message to the error-handling middleware
      return next(new AppError(404, 'Block not found'));
    }

    // Remove the Block entity using the remove method of BlockRepo
    await PrisonerRepo.remove(Service)
      .then((result: any) => {
        console.log(result);
        // Send a JSON response with a 200 status code and the removed data
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error: any) => {
        // If an error occurs, pass it to the error-handling middleware using the AppError class
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    // If an error occurs, pass it to the error-handling middleware using the AppError class
    next(new AppError(error.statusCode, error.message));
  }
};
