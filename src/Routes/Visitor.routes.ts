import { Router } from 'express';
import {
  createVisitorHandler,
  deleteVisitorHandler,
  getSingleVisitorHandler,
  getVisitorHandler,
  updateVisitorHandler,
} from '../controller/Visitor.controller';

const router = Router();

router.route('/').get(getVisitorHandler).post(createVisitorHandler);
router
  .route('/:id')
  .get(getSingleVisitorHandler)
  .put(updateVisitorHandler)
  .delete(deleteVisitorHandler);

export default router;
