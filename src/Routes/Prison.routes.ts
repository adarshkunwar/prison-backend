import { Router } from 'express';

import {
  createPrisonHandler,
  deletePrisonHandler,
  getPrisonHandler,
  getSinglePrisonHandler,
  updatePrisonHandler,
} from '../controller/Prison.controller';

const router = Router();

router.route('/').get(getPrisonHandler).post(createPrisonHandler);
router
  .route('/:id')
  .get(getSinglePrisonHandler)
  .put(updatePrisonHandler)
  .delete(deletePrisonHandler);

export default router;
