import { Router } from 'express';
import { createTenant, getAllTenants } from './tenant.controller.js';
import { authenticate, authorize } from '../../../common/middlewares/auth.middleware.js';
import { UserRole } from '../../users/domain/user.types.js';

const router = Router();

router.use(authenticate, authorize(UserRole.SUPER_ADMIN));

router.post('/',  createTenant);
router.get('/',   getAllTenants);

export default router;
