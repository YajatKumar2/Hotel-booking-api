import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../models/interfaces';

// We need a secret-key to sign our tokens. we will Store this in an .env file in a usual real app
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-not-secret';
const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password. WE  don't do plain passwords
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain text password with a hash.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generates a JWT for a user.
 */
export const generateToken = (user: IUser): string => {
  // Create a payload with the user's ID and role
  const payload = {
    id: user.id,
    role: user.role,
  };

  // Sign the token
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d', // Token will expire in 1 day
  });
};