import { UserRole } from "../models/interfaces";

// Define the shape of our user payload (from the JWT)
export interface UserPayload {
  id: string;
  role: UserRole;
}

// Extend the Express Request interface
declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload; // Make it optional, as not all requests will be authenticated
    }
  }
}