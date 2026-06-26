import pool from '../config/database.ts';
import { Request, Response } from 'express';

export const createSessionReview = async (req: Request, res: Response) => {
    try {
        const { booking_id, student_id, alumni_id, rating, comment } = req.body;

        const [result]: any = await pool.query(
            `INSERT INTO session_reviews (booking_id, student_id, alumni_id, rating, comment) VALUES (?, ?, ?, ?, ?)`,
            [booking_id, student_id, alumni_id, rating, comment]
        );

        res.status(201).json({
            message: 'Session review created successfully',
            reviewId: result.insertId
        });
    } catch (error) {
        console.error('Create session review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAlumniReviews = async (req: Request, res: Response) => {
    try {
        const { alumniId } = req.params;

        const [reviews]: any[] = await pool.query(`
            SELECT 
                r.*,
                u.full_name as student_name,
                u.profile_picture as student_picture
            FROM session_reviews r
            JOIN users u ON r.student_id = u.id
            WHERE r.alumni_id = ?
            ORDER BY r.created_at DESC
        `, [alumniId]);

        res.json({ reviews });
    } catch (error) {
        console.error('Get alumni reviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getReviewForBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;

        const [reviews]: any[] = await pool.query(
            `SELECT * FROM session_reviews WHERE booking_id = ?`,
            [bookingId]
        );

        res.json({ review: reviews[0] || null });
    } catch (error) {
        console.error('Get review for booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
