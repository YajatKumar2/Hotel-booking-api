import { IBooking, IRoom, IUser } from '../models/interfaces';

// In-memory "database", since i can;t use a real databse
// We'll export the arrays so other services can access them.
export const users: IUser[] = [];
export const rooms: IRoom[] = [];
export const bookings: IBooking[] = [];