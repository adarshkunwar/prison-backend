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
    await PrisonRepo.find()
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
      relations: {
        blocks: true,
        staffs: true,
      },
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

    // Save the modified req.body data using the save method of BlockRepo
    await PrisonRepo.save(req.body)
      .then((result) => {
        // Send a JSON response with a 200 status code and the saved data
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
 * Handler for PATCH/PUT request to update a Prison instance.
 */
export const updatePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve the existing Block entity based on the id provided in the request parameters
    let service = await PrisonRepo.findOneBy({ id: req.params.id });

    if (!service) {
      // If the Block entity is not found, pass a 404 status code and "Block not found" message to the error-handling middleware
      return next(new AppError(404, 'Block not found'));
    }

    let product = [];

    // Parse each item in the req.body.service array as JSON and push into the product array
    req.body.service.map((item) => {
      let data = JSON.parse(item);
      return product.push(data);
    });

    // Reassign the req.body.service property with the updated product array
    req.body.service = [...product];

    console.log(req.body);

    // Update the existing Block entity with the properties from req.body using Object.assign
    Object.assign(service, req.body);

    // Save the modified Block entity using the save method of BlockRepo
    await PrisonRepo.save(service)
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
 * Handler for DELETE request to remove a Prison instance.
 */
export const deletePrisonHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve the existing Block entity based on the id provided in the request parameters
    let Service = await PrisonRepo.findOneBy({ id: req.params.id });

    if (!Service) {
      // If the Block entity is not found, pass a 404 status code and "Block not found" message to the error-handling middleware
      return next(new AppError(404, 'Block not found'));
    }

    // Remove the Block entity using the remove method of BlockRepo
    await PrisonRepo.remove(Service)
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
