import pool from '../config/database.ts';
import { Request, Response } from 'express';

export const getStudentBookings = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const [bookings]: any[] = await pool.query(`
      SELECT 
        bookings.*,
        mentorship_slots.date,
        mentorship_slots.start_time,
        mentorship_slots.end_time,
        mentorship_slots.meeting_url,
        mentorship_slots.title as slot_title,
        users.full_name as alumni_name,
        users.profile_picture as alumni_picture,
        alumni_profiles.current_job_title as alumni_role
      FROM bookings
      JOIN mentorship_slots ON bookings.slot_id = mentorship_slots.id
      JOIN users ON bookings.alumni_id = users.id
      LEFT JOIN alumni_profiles ON users.id = alumni_profiles.user_id
      WHERE bookings.student_id = ?
      ORDER BY mentorship_slots.date, mentorship_slots.start_time DESC
    `, [studentId]);
    res.json({ bookings });
  } catch (error) {
    console.error('Get student bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlumniBookings = async (req: Request, res: Response) => {
  try {
    const alumniId = req.params.alumniId;
    const [bookings]: any[] = await pool.query(`
      SELECT 
        bookings.*,
        mentorship_slots.date,
        mentorship_slots.start_time,
        mentorship_slots.end_time,
        mentorship_slots.meeting_url,
        mentorship_slots.title as slot_title,
        users.full_name as student_name,
        users.profile_picture as student_picture,
        student_profiles.university,
        student_profiles.department
      FROM bookings
      JOIN mentorship_slots ON bookings.slot_id = mentorship_slots.id
      JOIN users ON bookings.student_id = users.id
      LEFT JOIN student_profiles ON users.id = student_profiles.user_id
      WHERE bookings.alumni_id = ?
      ORDER BY mentorship_slots.date, mentorship_slots.start_time DESC
    `, [alumniId]);
    res.json({ bookings });
  } catch (error) {
    console.error('Get alumni bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { time_slot_id, slot_id, student_id, session_agenda, notes } = req.body;
    const finalSlotId = time_slot_id || slot_id;
    const finalNotes = session_agenda || notes;

    // Check if slot exists and has available seats
    const [slots]: any[] = await pool.query('SELECT * FROM mentorship_slots WHERE id = ?', [finalSlotId]);
    if (slots.length === 0) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    const slot = slots[0];
    if (slot.booked_seats >= slot.max_seats) {
      return res.status(400).json({ message: 'Slot is full' });
    }

    // Check if student already booked this slot
    const [existingBookings]: any[] = await pool.query(
      'SELECT * FROM bookings WHERE slot_id = ? AND student_id = ?',
      [finalSlotId, student_id]
    );
    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'You have already booked this slot' });
    }

    const [result]: any = await pool.query(
      'INSERT INTO bookings (slot_id, student_id, alumni_id, notes, status) VALUES (?, ?, ?, ?, ?)',
      [finalSlotId, student_id, slot.alumni_id, finalNotes, 'Pending']
    );

    res.status(201).json({
      message: 'Booking request created successfully',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const { status, notes } = req.body;

    // Get current booking to check current status
    const [bookings]: any[] = await pool.query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const currentBooking = bookings[0];

    // If we're accepting the booking
    if (status === 'Upcoming' && currentBooking.status === 'Pending') {
      // Get slot and increment booked_seats
      const [slots]: any[] = await pool.query('SELECT * FROM mentorship_slots WHERE id = ?', [currentBooking.slot_id]);
      if (slots.length === 0) {
        return res.status(404).json({ message: 'Slot not found' });
      }
      const slot = slots[0];

      if (slot.booked_seats >= slot.max_seats) {
        return res.status(400).json({ message: 'Slot is now full' });
      }

      await pool.query(`
        UPDATE mentorship_slots 
        SET booked_seats = booked_seats + 1,
            is_booked = CASE WHEN booked_seats + 1 >= max_seats THEN 1 ELSE is_booked END
        WHERE id = ?
      `, [currentBooking.slot_id]);
    }

    // If we're rejecting or cancelling an accepted booking
    if ((status === 'Cancelled' || status === 'Rejected') && (currentBooking.status === 'Upcoming' || currentBooking.status === 'Pending')) {
      // If it was accepted, decrement booked_seats
      if (currentBooking.status === 'Upcoming') {
        await pool.query(`
          UPDATE mentorship_slots 
          SET booked_seats = booked_seats - 1,
              is_booked = CASE WHEN booked_seats - 1 >= max_seats THEN 1 ELSE 0 END
          WHERE id = ?
        `, [currentBooking.slot_id]);
      }
    }

    await pool.query(
      `UPDATE bookings 
       SET status = COALESCE(?, status), 
           notes = COALESCE(?, notes) 
       WHERE id = ?`,
      [status, notes, bookingId]
    );

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
