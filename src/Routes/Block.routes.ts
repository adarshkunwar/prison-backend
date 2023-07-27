import { Router } from 'express';
import {
  createBlockHandler,
  deleteBlockHandler,
  getBlockHandler,
  getSingleBlockHandler,
  updateBlockHandler,
} from '../controller/Block.controller';

const router = Router();

router.route('/').get(getBlockHandler).post(createBlockHandler);
router
  .route('/:id')
  .get(getSingleBlockHandler)
  .put(updateBlockHandler)
  .delete(deleteBlockHandler);

export default router;
