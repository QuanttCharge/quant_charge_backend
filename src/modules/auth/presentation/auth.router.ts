import { Router } from 'express';
import { login, createUser, setupPassword } from './auth.controller.js';
import { authenticate, authorize } from '../../../common/middlewares/auth.middleware.js';
import { UserRole } from '../../users/domain/user.types.js';

const router = Router();

router.post('/login',          login);
router.post('/setup-password', setupPassword);
router.post('/users', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN), createUser);

export default router;
