import { Router } from 'express';
import { upload } from '../Utils/UploadFile';
import {
  createPrisonerHandler,
  deletePrisonerHandler,
  getPrisonerHandler,
  getSinglePrisonerHandler,
  movePrisonerHandler,
  updatePrisonerHandler,
} from '../controller/Prisoner.controller';

const router = Router();

router
  .route('/')
  .get(getPrisonerHandler)
  // .post(createPrisonerHandler)
  .post(upload.single('image'), createPrisonerHandler);

router
  .route('/:id')
  .get(getSinglePrisonerHandler)
  .put(updatePrisonerHandler)
  .delete(deletePrisonerHandler);

router.route('move/:id/').put(movePrisonerHandler);

export default router;
