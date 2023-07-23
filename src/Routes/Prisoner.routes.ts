import { Router } from 'express';
import { upload } from '../Utils/UploadFile';
import { getPrisonByIdHandler } from '../controller/Prison.controller';
import {
  deletePrisonerHandler,
  getPrisonerHandler,
  postPrisonerHandler,
  updatePrisonerHandler,
} from '../controller/Prisoner.controller';

const router = Router();

router.route('/').get(getPrisonerHandler).post(postPrisonerHandler);
// .post(upload.single('image'), postPrisonerHandler);
router
  .route('/:id')
  .get(getPrisonByIdHandler)
  .put(updatePrisonerHandler)
  .delete(deletePrisonerHandler);

export default router;
