import { Router } from 'express';
import {
  deletePrisonHandler,
  getPrisonByIdHandler,
  getPrisonHandler,
  postPrisonHandler,
  updatePrisonHandler,
} from '../controller/Prison.controller';

const router = Router();

router.route('/').get(getPrisonHandler).post(postPrisonHandler);
router
  .route('/:id')
  .get(getPrisonByIdHandler)
  .put(updatePrisonHandler)
  .delete(deletePrisonHandler);

export default router;
