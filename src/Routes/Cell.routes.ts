import { Router } from 'express';
import {
  deleteCellHandler,
  getCellByIdHandler,
  getCellHandler,
  postCellHandler,
  updateCellHandler,
} from '../controller/Cell.controller';

const router = Router();

router.route('/').get(getCellHandler).post(postCellHandler);
router
  .route('/:id')
  .get(getCellByIdHandler)
  .put(updateCellHandler)
  .delete(deleteCellHandler);

export default router;
