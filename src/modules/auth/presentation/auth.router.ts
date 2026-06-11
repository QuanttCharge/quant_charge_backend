import { Router } from 'express';
import { login, createUser } from './auth.controller.js';
import { authenticate, authorize } from '../../../common/middlewares/auth.middleware.js';
import { UserRole } from '../../users/domain/user.types.js';

const router = Router();

router.post('/login',       login);
router.post('/users',       authenticate, authorize(UserRole.SUPER_ADMIN), createUser);

export default router;
