import { Router } from 'express';
import {
  deleteStaffHandler,
  getStaffByIdHandler,
  getStaffHandler,
  postStaffHandler,
  updateStaffHandler,
} from '../controller/Staff.controller';

const router = Router();

router.route('/').get(getStaffHandler).post(postStaffHandler);
router
  .route('/:id')
  .get(getStaffByIdHandler)
  .put(updateStaffHandler)
  .delete(deleteStaffHandler);

export default router;
