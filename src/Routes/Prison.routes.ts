import { Router } from 'express';
import { deletePrisonHandler } from '../controller/prisons/Prisons.delete.controller';
import {
  getPrisonHandler,
  getSinglePrisonHandler,
} from '../controller/prisons/Prisons.get.controller';
import { createPrisonHandler } from '../controller/prisons/Prisons.post.controller';
import { updatePrisonHandler } from '../controller/prisons/Prisons.put.controller';

const router = Router();

router.route('/').get(getPrisonHandler).post(createPrisonHandler);
router
  .route('/:id')
  .get(getSinglePrisonHandler)
  .put(updatePrisonHandler)
  .delete(deletePrisonHandler);

export default router;
