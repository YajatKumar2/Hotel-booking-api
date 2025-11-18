import {UserRole, RoomType, BookingStatus} from './enums';

// we nned a interface for user;
export interface IUser{
    id: string;
    email: string;
    passwordHash: string; // we are storing a hash and never the plain password
    name: string;
    role: UserRole;
}

// interface for a room 
export interface IRoom{
    id: string;
    type: RoomType;
    pricePerNight: number;
    totalInventory: number; //for ex: the hotel has 20 'Suite ' rooms
}

//interface for a booking, a single one booking
export interface IBooking {
  id: string;
  userId: string;       // The user who made the booking
  roomId: string;       // The type of room being booked
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  totalPrice: number;
  guestInfo: {
    name: string;
    email: string;
    phone?: string; // Optional to givephone number
  };
  createdAt: Date;
}


export interface UserPayload {
  id: string;
  role: UserRole;
}