import pool from '../config/database.ts';
import { Request, Response } from 'express';

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const [conversations]: any[] = await pool.query(
      `SELECT 
        other_user.id as user_id,
        other_user.full_name,
        other_user.profile_picture,
        other_user.role,
        m.content as last_message,
        m.created_at as last_message_time,
        m.is_read,
        m.sender_id as last_sender_id
      FROM (
        SELECT 
          CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as other_user_id,
          MAX(created_at) as last_time
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        GROUP BY other_user_id
      ) conv
      JOIN messages m ON 
        (conv.other_user_id = m.sender_id AND ? = m.receiver_id) OR
        (conv.other_user_id = m.receiver_id AND ? = m.sender_id)
        AND m.created_at = conv.last_time
      JOIN users other_user ON other_user.id = conv.other_user_id
      ORDER BY conv.last_time DESC`,
      [userId, userId, userId, userId, userId]
    );

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.params;

    const [messages]: any[] = await pool.query(
      `SELECT 
        m.*,
        sender.full_name as sender_name,
        sender.profile_picture as sender_picture
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC`,
      [userId1, userId2, userId2, userId1]
    );

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [senderId, receiverId, content]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.params;

    await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ?',
      [userId2, userId1]
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
