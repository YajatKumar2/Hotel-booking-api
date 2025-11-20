import { Router } from 'express';
import { createRoom, getAllRooms } from '../controllers/room.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';
import { UserRole } from '../models/enums';

const router = Router();

// --- Public Routes ---
// GET /api/rooms - Anyone can see the list of room types
router.get('/', getAllRooms);

// --- Admin Routes ---
// POST /api/rooms - Only Admins can create a new room type
router.post(
  '/',
  authenticate, // First, make sure they're logged in
  checkRole([UserRole.ADMIN]), // Second, make sure they are an ADMIN
  createRoom // If both checks pass, run the controller
);

export default router;