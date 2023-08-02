import { Router } from 'express';
import { loginHandler } from '../controller/User.controller';
const router = Router();

router.route('/login').post(loginHandler);

export default router;
