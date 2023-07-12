import { Router } from 'express';
import {
  deleteBlockHandler,
  getBlockByIdHandler,
  getBlockHandler,
  postBlockHandler,
  updateBlockHandler,
} from '../controller/Block.controller';

const router = Router();

router.route('/').get(getBlockHandler).post(postBlockHandler);
router
  .route('/:id')
  .get(getBlockByIdHandler)
  .put(updateBlockHandler)
  .delete(deleteBlockHandler);

export default router;
