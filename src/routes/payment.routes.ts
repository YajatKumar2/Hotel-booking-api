import { Router } from 'express';
import { makePayment } from '../controllers/payment.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';
import { UserRole } from '../models/enums';

const router = Router();

// POST /api/payments
// Only guests can make payments
router.post(
  '/',
  authenticate,
  checkRole([UserRole.GUEST]),
  makePayment
);

export default router;