import { isWithinInterval, parseISO } from 'date-fns';

/**
 * Checks if two date ranges overlap.
 * @param newStart The start date of the new booking.
 * @param newEnd The end date of the new booking.
 * * @param existingStart The start date of the existing booking.
 * @param existingEnd The end date of the existing booking.
 * @returns {boolean} True if they overlap, false otherwise.
 */
export const doDatesOverlap = (
  newStart: Date,
  newEnd: Date,
  existingStart: Date,
  existingEnd: Date
): boolean => {
  // The logic is:
  // (New start is before existing end) AND (New end is after existing start)
  return newStart < existingEnd && newEnd > existingStart;
};

/**
 * Helper to get the number of nights between two dates.
 */
export const getNumberOfNights = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};