import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; // We'll use uuid to create unique IDs
import { users } from '../services/db.service';
import { IUser } from '../models/interfaces';
import { UserRole } from '../models/enums';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // 1. Validate input (basic)
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // 3. Hash the password
    const passwordHash = await hashPassword(password);

    // 4. Create new user object (default role is GUEST)
    const newUser: IUser = {
      id: uuidv4(),
      email,
      passwordHash,
      name,
      role: UserRole.GUEST, 
      //if UserRole.ADMIN createsa admine every single time
      // All new users are guests by default
    };

    // 5. "Save" the user to our mock DB
    users.push(newUser);

    console.log('User registered:', newUser); // For debugging

    // 6. Send success response (don't send the password hash!)
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Find the user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Compare password with the stored hash
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Generate a JWT
    const token = generateToken(user);

    // 5. Send the token to the client
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};