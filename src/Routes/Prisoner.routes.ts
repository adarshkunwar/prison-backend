import { Router } from 'express';
import { upload } from '../Utils/UploadFile';
import {
  createPrisonerHandler,
  deletePrisonerHandler,
  getPrisonerHandler,
  getSinglePrisonerHandler,
  updatePrisonerHandler,
} from '../controller/Prisoner.controller';

const router = Router();

router.route('/').get(getPrisonerHandler).post(createPrisonerHandler);
// .post(upload.single('image'), postPrisonerHandler);
router
  .route('/:id')
  .get(getSinglePrisonerHandler)
  .put(updatePrisonerHandler)
  .delete(deletePrisonerHandler);

export default router;
