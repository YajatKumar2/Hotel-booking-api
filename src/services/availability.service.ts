import { rooms, bookings } from './db.service';
import { BookingStatus } from '../models/enums';
import { doDatesOverlap } from '../utils/date.utils';

/**
 * Checks if a specific room type has availability for the given dates.
 * This is the core logic to prevent double-booking.
 */
export const checkAvailability = (
  roomId: string,
  startDate: Date,
  endDate: Date
): boolean => {
  // 1. Find the room to get its total inventory
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    throw new Error('Room not found');
  }
  const totalInventory = room.totalInventory;

  // 2. Find all CONFIRMED bookings for this room type
  const confirmedBookings = bookings.filter(
    (b) => b.roomId === roomId && b.status === BookingStatus.CONFIRMED
  );

  // 3. Count how many of those bookings conflict with the new dates
  const conflictingBookingsCount = confirmedBookings.filter((booking) => {
    return doDatesOverlap(
      startDate,
      endDate,
      booking.startDate,
      booking.endDate
    );
  }).length; // .length gives us the count of overlapping bookings

  // 4. Make the decision
  // If the number of conflicts is less than the total inventory, we have a free room.
  // In a real DB, this would be a single atomic transaction (Step 3 & 4)
  return conflictingBookingsCount < totalInventory;
};