import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Prison } from '../entity/Prison';

const PrisonRepo = AppDataSource.getRepository(Prison);

/**
 * Handler for GET request to retrieve all Prison instances.
 */
export const getPrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve all instances of the Block entity from BlockRepo
    await PrisonRepo.find({
      // relations: {
      //   blocks: true,
      // },
    })
      .then((result) => {
        // Send a JSON response with a 200 status code and the retrieved data
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        // If an error occurs, pass it to the error-handling middleware using the AppError class
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    // If an error occurs, pass it to the error-handling middleware using the AppError class
    next(new AppError(error.statusCode, error.message));
  }
};

/**
 * Handler for GET request to retrieve only one Prison instances
 */
export const getPrisonByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await PrisonRepo.findOne({
      where: {
        id: req.params.id,
      },
      // relations: {
      //   blocks: true,
      // },
    }).then((result) => {
      if (!result) {
        return new AppError(404, 'Prison not found');
      }
      res.status(200).json({
        status: 'success',
        result,
      });
    });
  } catch (error) {
    next(new AppError(error.statusCode, error.message));
  }
};

/**
 * Handler for POST request to create a new Prison instance.
 */
export const postPrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    await PrisonRepo.save({
      ...req.body,
      capacity: 0,
      currentOccupancy: 0,
    })
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
    next(new AppError(error.statusCode, error.message));
  }
};

// export const postPrisonHandler2 = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log('-----inserting new prison -----');
//     await PrisonRepo.save({
//       ...req.body,
//       currentOccupancy: 0,
//     })
//       .then((result) => {
//         res.status(200).json({
//           status: 'Prison Added',
//           result,
//         });
//       })
//       .catch((error) => {
//         return next(new AppError(error.statusCode, error.message));
//       });
//   } catch (err) {
//     next(new AppError(err.statusCode, err.message));
//   }
// };

export const updatePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let prison = await PrisonRepo.findOneBy({ id: req.params.id });

    if (!prison) {
      return next(new AppError(404, 'Prison not found'));
    }

    // Update the existing Block entity with the properties from req.body using Object.assign
    Object.assign(prison, req.body);

    // Save the modified Block entity using the save method of BlockRepo
    await PrisonRepo.save(prison)
      .then((result) => {
        // Send a JSON response with a 200 status code and the saved data
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error) => {
        // If an error occurs, send a JSON response with a 500 status code and the error
        res.status(500).json({
          status: 'error',
          error,
        });
      });
  } catch (error) {
    // If an error occurs, pass it to the error-handling middleware using the AppError class
    next(new AppError(error.statusCode, error.message));
  }
};

export const deletePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let prison = await PrisonRepo.find({
      where: {
        id: req.params.id,
      },
    });

    if (!prison) {
      return next(new AppError(404, 'Prison not found'));
    }

    // if (prison.blocks.length > 0) {
    //   return next(new AppError(400, 'Prison has blocks'));
    // }

    console.log(prison[0]);

    await PrisonRepo.delete(prison[0])
      .then((result: any) => {
        console.log(result);
        res.status(200).json({
          status: 'success',
          result,
        });
      })
      .catch((error: any) => {
        console.log(error, 'jjhj');
        next(new AppError(error.statusCode, error.message));
      });
  } catch (error) {
    console.log(error, 'jjhj');
    next(new AppError(error.statusCode, error.message));
  }
};
