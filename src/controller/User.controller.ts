import * as bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AppError from '../Utils/AppError';
import { consoleLog, getDate } from '../Utils/date';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

const userRepo = AppDataSource.getRepository(User);

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await userRepo.findOneBy({ userName: req.body.userName });
  if (!user) return next(new AppError(404, 'user not found'));

  const user_true = await bcrypt.compare(req.body.password, user.password);
  if (!user_true)
    return next(new AppError(401, 'password and username did not match'));

  const payload = {
    id: user.id,
  };

  return res.status(200).json({
    message: 'Login Successful',
    token: jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    }),
  });
};
