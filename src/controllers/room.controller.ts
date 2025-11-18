import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { rooms } from '../services/db.service'; // Our mock DB
import { IRoom } from '../models/interfaces';
import { RoomType } from '../models/enums';

/**
 * Get all available room types
 */
export const getAllRooms = (req: Request, res: Response) => {
  try {
    // Simply return the list of rooms from our "database"
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create a new room type (Admin only)
 */
export const createRoom = (req: Request, res: Response) => {
  try {
    const { type, pricePerNight, totalInventory } = req.body;

    // 1. Basic validation
    if (!type || !pricePerNight || !totalInventory) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Validate the 'type' against our Enum
    // This ensures no one can create a room type like "penthouse_party"
    if (!Object.values(RoomType).includes(type)) {
      return res.status(400).json({ message: 'Invalid room type' });
    }

    // 3. Check if this room type already exists
    const existingRoom = rooms.find((room) => room.type === type);
    if (existingRoom) {
      return res
        .status(409)
        .json({ message: 'This room type already exists' });
    }

    // 4. Create the new room object
    const newRoom: IRoom = {
      id: uuidv4(),
      type,
      pricePerNight: Number(pricePerNight),
      totalInventory: Number(totalInventory),
    };

    // 5. "Save" it to our mock DB
    rooms.push(newRoom);

    console.log('Admin created new room:', newRoom); // For debugging

    // 6. Return the new room
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};