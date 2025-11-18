import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.routes'; // Import our new auth routes
import roomRoutes from './routes/room.routes';
import bookingRoutes from './routes/booking.routes';
import { authenticate, checkRole } from './middleware/auth.middleware';
import { UserRole } from './models/enums';


// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// A simple middleware to parse JSON request bodies
app.use(express.json());

// --- API Routes ---
// Mount the auth routes under the /api/auth prefix
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// --- Test Routes ---

// 1. A protected route (just needs a valid login)
app.get('/api/protected', authenticate, (req: Request, res: Response) => {
  // Because of the 'authenticate' middleware, we can now access req.user
  res.json({ message: 'You are authenticated!', user: req.user });
});

// 2. An admin-only route (needs login + admin role)
app.get(
  '/api/admin',
  authenticate, // First, check if they are logged in
  checkRole([UserRole.ADMIN]), // Then, check if they are an ADMIN
  (req: Request, res: Response) => {
    res.json({ message: 'Welcome, Admin!', user: req.user });
  }
);

// Define a root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world! This is the Hotel Booking API.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});