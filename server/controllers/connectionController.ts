import pool from '../config/database.ts';
import { Request, Response } from 'express';

export const getConnections = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const [connections]: any[] = await pool.query(
      `SELECT 
        c.*,
        u1.id as user1_id, u1.full_name as user1_name, u1.profile_picture as user1_picture, u1.role as user1_role,
        u2.id as user2_id, u2.full_name as user2_name, u2.profile_picture as user2_picture, u2.role as user2_role
      FROM connections c
      JOIN users u1 ON c.user_id_1 = u1.id
      JOIN users u2 ON c.user_id_2 = u2.id
      WHERE c.user_id_1 = ? OR c.user_id_2 = ?
      ORDER BY c.updated_at DESC`,
      [userId, userId]
    );

    const formattedConnections = connections.map((conn: any) => {
      const isUser1 = conn.user_id_1 === parseInt(userId);
      return {
        id: conn.id,
        user: isUser1 ? {
          id: conn.user2_id,
          full_name: conn.user2_name,
          profile_picture: conn.user2_picture,
          role: conn.user2_role
        } : {
          id: conn.user1_id,
          full_name: conn.user1_name,
          profile_picture: conn.user1_picture,
          role: conn.user1_role
        },
        status: conn.status,
        initiated_by: conn.initiated_by,
        created_at: conn.created_at,
        updated_at: conn.updated_at
      };
    });

    res.json({ connections: formattedConnections });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendConnectionRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, reason } = req.body;
    console.log('=== sendConnectionRequest called ===');
    console.log('senderId:', senderId, 'receiverId:', receiverId, 'reason:', reason);

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot send connection request to yourself' });
    }

    const [existing]: any[] = await pool.query(
      'SELECT id FROM connections WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)',
      [senderId, receiverId, receiverId, senderId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    // Try to insert with reason if column exists, otherwise without
    try {
      await pool.query(
        'INSERT INTO connections (user_id_1, user_id_2, status, initiated_by, reason) VALUES (?, ?, ?, ?, ?)',
        [senderId, receiverId, 'Pending', senderId, reason]
      );
    } catch (err) {
      console.log('Insert without reason (column doesn\'t exist):', err);
      await pool.query(
        'INSERT INTO connections (user_id_1, user_id_2, status, initiated_by) VALUES (?, ?, ?, ?)',
        [senderId, receiverId, 'Pending', senderId]
      );
    }

    console.log('Connection request inserted successfully');
    res.status(201).json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptConnectionRequest = async (req: Request, res: Response) => {
  try {
    const connectionId = req.params.id;

    const [connections]: any[] = await pool.query(
      'SELECT * FROM connections WHERE id = ?',
      [connectionId]
    );

    if (connections.length === 0) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    await pool.query(
      'UPDATE connections SET status = ? WHERE id = ?',
      ['Accepted', connectionId]
    );

    res.json({ message: 'Connection request accepted successfully' });
  } catch (error) {
    console.error('Accept connection request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectConnectionRequest = async (req: Request, res: Response) => {
  try {
    const connectionId = req.params.id;

    await pool.query('DELETE FROM connections WHERE id = ?', [connectionId]);

    res.json({ message: 'Connection request rejected successfully' });
  } catch (error) {
    console.error('Reject connection request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlumniConnections = async (req: Request, res: Response) => {
  try {
    const alumniId = req.params.alumniId;
    const status = req.params.status;
    const statusValue = status === 'accepted' ? 'Accepted' : 'Pending';
    
    console.log('=== getAlumniConnections called ===');
    console.log('alumniId:', alumniId, 'status:', status, 'statusValue:', statusValue);

    // Try query with reason first, fall back without it
    let connections: any[] = [];
    try {
      const [result] = await pool.query(
        `SELECT 
          c.*,
          u.id as student_id,
          u.full_name,
          u.profile_picture,
          u.role,
          sp.department as major,
          sp.current_year as year,
          c.reason
        FROM connections c
        JOIN users u ON (c.user_id_1 = u.id OR c.user_id_2 = u.id)
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE (c.user_id_1 = ? OR c.user_id_2 = ?)
          AND u.role = 'student'
          AND c.status = ?
        ORDER BY c.updated_at DESC`,
        [alumniId, alumniId, statusValue]
      );
      connections = result as any[];
    } catch (err) {
      console.log('Query without reason (column doesn\'t exist):', err);
      const [result] = await pool.query(
        `SELECT 
          c.*,
          u.id as student_id,
          u.full_name,
          u.profile_picture,
          u.role,
          sp.department as major,
          sp.current_year as year
        FROM connections c
        JOIN users u ON (c.user_id_1 = u.id OR c.user_id_2 = u.id)
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE (c.user_id_1 = ? OR c.user_id_2 = ?)
          AND u.role = 'student'
          AND c.status = ?
        ORDER BY c.updated_at DESC`,
        [alumniId, alumniId, statusValue]
      );
      connections = result as any[];
    }
    
    console.log('Found connections:', connections.length, connections);

    res.json({ 
      [status === 'accepted' ? 'students' : 'requests']: connections 
    });
  } catch (error) {
    console.error('Get alumni connections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateConnectionStatus = async (req: Request, res: Response) => {
  try {
    const connectionId = req.params.id;
    const { status } = req.body;

    if (status === 'accepted') {
      await pool.query('UPDATE connections SET status = ? WHERE id = ?', ['Accepted', connectionId]);
    } else if (status === 'rejected') {
      await pool.query('DELETE FROM connections WHERE id = ?', [connectionId]);
    }

    res.json({ message: 'Connection updated successfully' });
  } catch (error) {
    console.error('Update connection status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};