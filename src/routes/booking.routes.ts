import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
} from '../controllers/booking.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';
import { UserRole } from '../models/enums';

const router = Router();

// --- Guest Routes ---

// POST /api/bookings - Create a new booking
router.post(
  '/',
  authenticate,
  checkRole([UserRole.GUEST]),
  createBooking
);

// GET /api/bookings/my-bookings - Get all bookings for this user
router.get(
  '/my-bookings',
  authenticate,
  checkRole([UserRole.GUEST]),
  getMyBookings
);

// --- Staff/Admin Routes ---

// GET /api/bookings - Get ALL bookings
router.get(
  '/',
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  getAllBookings
);

export default router;