import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { rooms, bookings, users } from '../services/db.service';
import { checkAvailability } from '../services/availability.service';
import { getNumberOfNights } from '../utils/date.utils';
import { IBooking } from '../models/interfaces';
import { BookingStatus } from '../models/enums';
import { sendBookingConfirmation } from '../services/email.service';

/**
 * Create a new booking (Guest only)
 */
export const createBooking = (req: Request, res: Response) => {
  try {
    const { roomId, startDate, endDate, guestInfo } = req.body;
    const userId = req.user!.id; // We know user exists from 'authenticate' middleware

    // 1. Basic validation
    if (!roomId || !startDate || !endDate || !guestInfo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (endDateObj <= startDateObj) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // 2. Check availability
    const isAvailable = checkAvailability(roomId, startDateObj, endDateObj);
    if (!isAvailable) {
      return res
        .status(409)
        .json({ message: 'Room not available for the selected dates' });
    }

    // 3. Get room info to calculate price
    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // 4. Calculate price
    const numNights = getNumberOfNights(startDateObj, endDateObj);
    const totalPrice = numNights * room.pricePerNight;

    // 5. Create new booking object
    const newBooking: IBooking = {
      id: uuidv4(),
      userId,
      roomId,
      startDate: startDateObj,
      endDate: endDateObj,
      guestInfo,
      totalPrice,
      // We set to PENDING. A payment step would change this to CONFIRMED.
      // For this project, we'll confirm it immediately.
      status: BookingStatus.CONFIRMED, // Simulate successful payment
      createdAt: new Date(),
    };

    // 6. "Save" to our mock DB
    bookings.push(newBooking);
    
    // 7. --- NEW: Send confirmation email ---
    // We do this *after* saving, but *before* sending the response.
    // We use .catch() so that if the email fails, it doesn't crash the
    // entire booking request. It just logs the error.

    // We need the user's name/email. We can get it from guestInfo.
    const userForEmail = {
        name: guestInfo.name,
        email: guestInfo.email,
    };

    sendBookingConfirmation(userForEmail, newBooking).catch((err) => {
        console.error('Email failed to send:', err);
    });

    // 7. Send success response
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all bookings for the currently logged-in user (Guest)
 */
export const getMyBookings = (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const myBookings = bookings.filter((b) => b.userId === userId);
    res.status(200).json(myBookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all bookings in the system (Admin/Staff)
 */
export const getAllBookings = (req: Request, res: Response) => {
  try {
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};