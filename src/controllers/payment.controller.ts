import { Request, Response } from 'express';
import { bookings } from '../services/db.service';
import { processPayment } from '../services/payment.service';
import { sendBookingConfirmation } from '../services/email.service';
import { BookingStatus } from '../models/enums';

export const makePayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, cardNumber } = req.body;

    // 1. Validate input
    if (!bookingId || !cardNumber) {
      return res.status(400).json({ message: 'Booking ID and Card Number are required' });
    }

    // 2. Find the booking
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 3. Check if already paid
    if (booking.status === BookingStatus.CONFIRMED) {
      return res.status(400).json({ message: 'Booking is already paid and confirmed' });
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return res.status(400).json({ message: 'Cannot pay for a cancelled booking' });
    }

    // 4. Call the Mock Payment Service
    const isSuccess = await processPayment(booking.totalPrice, cardNumber);

    if (!isSuccess) {
      return res.status(402).json({ message: 'Payment failed. Please try a different card.' });
    }

    // 5. Payment Successful! Update Booking Status
    booking.status = BookingStatus.CONFIRMED;

    // 6. Send Confirmation Email (Now moved here!)
    const userForEmail = {
      name: booking.guestInfo.name,
      email: booking.guestInfo.email,
    };
    sendBookingConfirmation(userForEmail, booking).catch(console.error);

    // 7. Respond
    res.status(200).json({
      message: 'Payment successful! Booking confirmed.',
      booking,
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};