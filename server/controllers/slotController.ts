import pool from '../config/database.ts';
import { Request, Response } from 'express';

export const getSlots = async (req: Request, res: Response) => {
  try {
    const [slots]: any[] = await pool.query(`
      SELECT 
        mentorship_slots.*,
        users.full_name as alumni_name,
        alumni_profiles.current_job_title as alumni_role,
        TIMESTAMPDIFF(MINUTE, mentorship_slots.start_time, mentorship_slots.end_time) as duration
      FROM mentorship_slots
      JOIN users ON mentorship_slots.alumni_id = users.id
      LEFT JOIN alumni_profiles ON users.id = alumni_profiles.user_id
      WHERE mentorship_slots.is_booked = 0
        AND mentorship_slots.booked_seats < mentorship_slots.max_seats
      ORDER BY mentorship_slots.date, mentorship_slots.start_time ASC
    `);
    
    // Map fields to what frontend expects
    const mappedSlots = slots.map((slot: any) => ({
      ...slot,
      topic: slot.title,
      max_bookings: slot.max_seats
    }));
    
    res.json({ slots: mappedSlots });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlumniSlots = async (req: Request, res: Response) => {
  try {
    const alumniId = req.params.alumniId;
    const showAll = req.query.showAll === 'true';
    console.log('Fetching slots for alumni:', alumniId, 'showAll:', showAll);
    
    let query = `
      SELECT 
        mentorship_slots.*,
        users.full_name as alumni_name,
        TIMESTAMPDIFF(MINUTE, mentorship_slots.start_time, mentorship_slots.end_time) as duration
      FROM mentorship_slots
      JOIN users ON mentorship_slots.alumni_id = users.id
      WHERE mentorship_slots.alumni_id = ?
    `;
    
    const params: any[] = [alumniId];
    
    if (!showAll) {
      query += `
        AND mentorship_slots.is_booked = 0
        AND mentorship_slots.booked_seats < mentorship_slots.max_seats
      `;
    }
    
    query += ` ORDER BY mentorship_slots.date, mentorship_slots.start_time ${showAll ? 'DESC' : 'ASC'}`;
    
    const [slots]: any[] = await pool.query(query, params);
    
    // Map fields to what frontend expects
    const mappedSlots = slots.map((slot: any) => ({
      ...slot,
      topic: slot.title,
      max_bookings: slot.max_seats
    }));
    
    console.log('Fetched slots:', mappedSlots);
    res.json({ slots: mappedSlots });
  } catch (error) {
    console.error('Get alumni slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const { alumni_id, title, date, start_time, end_time, meeting_url, max_seats } = req.body;
    console.log('Creating slot:', { alumni_id, title, date, start_time, end_time, meeting_url, max_seats });

    const [result]: any = await pool.query(
      `INSERT INTO mentorship_slots (alumni_id, title, date, start_time, end_time, meeting_url, max_seats) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [alumni_id, title, date, start_time, end_time, meeting_url, max_seats || 1]
    );

    console.log('Slot created with ID:', result.insertId);
    res.status(201).json({ message: 'Slot created successfully', slotId: result.insertId });
  } catch (error) {
    console.error('Create slot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const slotId = req.params.id;
    const { title, date, start_time, end_time, is_booked, meeting_url, max_seats } = req.body;
    console.log('Updating slot:', { slotId, title, date, start_time, end_time, is_booked, meeting_url, max_seats });

    await pool.query(
      `UPDATE mentorship_slots 
       SET title = COALESCE(?, title),
           date = COALESCE(?, date), 
           start_time = COALESCE(?, start_time), 
           end_time = COALESCE(?, end_time), 
           is_booked = COALESCE(?, is_booked),
           meeting_url = COALESCE(?, meeting_url),
           max_seats = COALESCE(?, max_seats)
       WHERE id = ?`,
      [title, date, start_time, end_time, is_booked, meeting_url, max_seats, slotId]
    );

    res.json({ message: 'Slot updated successfully' });
  } catch (error) {
    console.error('Update slot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const slotId = req.params.id;
    await pool.query('DELETE FROM mentorship_slots WHERE id = ?', [slotId]);
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Delete slot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
