import { Router } from 'express';

import {
  createCellHandler,
  deleteCellHandler,
  getCellHandler,
  getSingleCellHandler,
  updateCellHandler,
} from '../controller/Cell.controller';

const router = Router();

router.route('/').get(getCellHandler).post(createCellHandler);
router
  .route('/:id')
  .get(getSingleCellHandler)
  .put(updateCellHandler)
  .delete(deleteCellHandler);

export default router;
