import { Router } from 'express';
import {
  deleteVisitorHandler,
  getVisitorByIdHandler,
  getVisitorHandler,
  postVisitorHandler,
  updateVisitorHandler,
} from '../controller/Visitor.controller';

const router = Router();

router.route('/').get(getVisitorHandler).post(postVisitorHandler);
router
  .route('/:id')
  .get(getVisitorByIdHandler)
  .put(updateVisitorHandler)
  .delete(deleteVisitorHandler);

export default router;
