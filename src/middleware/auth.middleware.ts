import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '../models/enums';
import { UserPayload } from '../models/interfaces'; // Import our new type

// Re-use the secret from our auth.utils (or a central config)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-not-secret';

/**
 * Middleware to verify JWT token and attach user to request.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // 1. Get the token from the 'Authorization' header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // 2. If no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // 3. Verify the token
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;

    // 4. Attach the user payload to req.user
    // Now, all following middleware/controllers can access req.user
    req.user = payload;

    // 5. Pass control to the next middleware
    next();
  } catch (err) {
    // If token is invalid (expired, wrong secret, etc.)
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

/**
 * Middleware factory to check for specific roles.
 * This function *returns* another middleware function.
 */
export const checkRole = (roles: UserRole[]) => {
  // The returned function is the actual middleware
  return (req: Request, res: Response, next: NextFunction) => {
    // We assume 'authenticate' middleware has run before this
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    // Check if the user's role is in the allowed 'roles' array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden. Insufficient permissions.' });
    }

    // User has the correct role, proceed
    next();
  };
};