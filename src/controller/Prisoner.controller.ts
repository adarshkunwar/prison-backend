import { NextFunction, Request, Response } from 'express';
import AppError from '../Utils/AppError';
import { AppDataSource } from '../data-source';
import { Block } from '../entity/Block';
import { Cell } from '../entity/Cell';
import { Prison } from '../entity/Prison';
import { Prisoner } from '../entity/Prisoner';

const PrisonerRepo = AppDataSource.getRepository(Prisoner);
const cellRepo = AppDataSource.getRepository(Cell);
const blockRepo = AppDataSource.getRepository(Block);
const prisonRepo = AppDataSource.getRepository(Prison);

export const getPrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve all instances of the Block entity from BlockRepo
    await PrisonerRepo.find({
      // relations: {
      //   cell: true,
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

export const getPrisonerByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve the existing Block entity based on the id provided in the request parameters
    await PrisonerRepo.findOneBy({ id: req.params.id })
      .then((result) => {
        if (!result) {
          // If no Block instance is found, pass an error to the error-handling middleware using the AppError class
          return next(new AppError(404, 'Prisoner not found'));
        }
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

export const postPrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    // retrieve exisiting cell from cellRepo
    const cell = await cellRepo.find({
      where: {
        id: req.body.cell,
      },
    });

    if (!cell) {
      return next(new AppError(404, 'Cell not found'));
    }
    // if (cell[0].currentOccupancy >= cell[0].capacity) {
    //   return next(new AppError(404, 'Cell is full'));
    // } else {
    // starting to save the prisoner
    await PrisonerRepo.save({
      ...req.body,
      age: parseInt(req.body.age),
      contactNumber: parseInt(req.body.contactNumber),
    })
      .then(async (result) => {
        // update the cell occupancy by 1 and also update block occupancy and prison occupancy
        cell[0].currentOccupancy += 1;
        res.status(200).json({
          status: 'success',
          result,
        });
        await cellRepo
          .save({
            ...cell[0],
            currentOccupancy: cell[0].currentOccupancy + 1,
          })
          .then(async (result) => {
            // update the block occupancy by 1 and also update prison occupancy
            /* cell[0].block.currentOccupancy += 1;
            cell[0].block.prison.currentOccupancy += 1; */
            console.log(result);
            await cellRepo.save({
              ...cell[0],
              block: {
                ...cell[0].block,
                currentOccupancy: cell[0].block.currentOccupancy + 1,
                prison: {
                  ...cell[0].block.prison,
                  currentOccupancy: cell[0].block.prison.currentOccupancy + 1,
                },
              },
            });
          });
      })
      .catch((error) => {
        next(new AppError(error.statusCode, error.message));
      });
    // everything is done
    console.log('Prisoner is added');
    // }
  } catch (error) {
    console.log('-------------------');
    next(new AppError(error.statusCode, error.message));
  }
};

// export const postPrisonerHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log(req, 'req');
//   // console.log(req.body);
//   try {
//     console.log(
//       '------------------------Prisoner Post Starts Here----------------------'
//     );
//     console.log(req.body);

//     const cell = await cellRepo.findOneBy({ id: req.params.id });
//     if (!cell) return next(new AppError(404, 'Cell Not Found'));

//     await PrisonerRepo.save({
//       ...req.body,
//       id: parseInt(req.body.id),
//       contactNumber: parseInt(req.body.contactNumber),
//     }).then((result) => {
//       console.log(result);
//       res.status(200).json({
//         status: 'success',
//         result,
//       });
//     });
//   } catch (error) {
//     console.log('try catch error');
//     return next(new AppError(error.statusCode, error.message));
//   }
// };

/**
 * Handler for PATCH/PUT request to update a Block instance.
 */
export const updatePrisonerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let service = await PrisonerRepo.findOneBy({ id: req.params.id });
    if (!service) {
      return next(new AppError(404, 'Block not found'));
    }

    let prisoner = [];
    req.body.service.map((item) => {
      let data = JSON.parse(item);
      return prisoner.push(data);
    });

    // Reassign the req.body.service property with the updated product array
    req.body.service = [...prisoner];

    console.log(req.body);

    // Update the existing Block entity with the properties from req.body using Object.assign
    Object.assign(service, req.body);

    // Save the modified Block entity using the save method of BlockRepo
    await PrisonerRepo.save(service)
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

/**
 * Handler for DELETE request to remove a Block instance.
 */
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
