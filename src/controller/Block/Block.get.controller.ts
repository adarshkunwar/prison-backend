import { NextFunction, Request, Response } from 'express';
import AppError from '../../Utils/AppError';
import { AppDataSource } from '../../data-source';
import { Block } from '../../entity/Block';
import { Cell } from '../../entity/Cell';
import { Prison } from './../../entity/Prison';
