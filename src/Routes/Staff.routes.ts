import { Router } from 'express';
import {
  createStaffHandler,
  deleteStaffHandler,
  getSingleStaffHandler,
  getStaffHandler,
  updateStaffHandler,
} from '../controller/Staff.controller';

const router = Router();

router.route('/').get(getStaffHandler).post(createStaffHandler);
router
  .route('/:id')
  .get(getSingleStaffHandler)
  .put(updateStaffHandler)
  .delete(deleteStaffHandler);

export default router;
