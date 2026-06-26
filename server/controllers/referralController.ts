import pool from '../config/database.js';
import { Request, Response } from 'express';

export const createReferralRequest = async (req: Request, res: Response) => {
    try {
        const { student_id, alumni_id, company, position, message, resume_url } = req.body;
        console.log('Creating referral request with resume_url:', resume_url);

        const [result]: any = await pool.query(
            `INSERT INTO referral_requests (student_id, alumni_id, company, position, message, resume_url) VALUES (?, ?, ?, ?, ?, ?)`,
            [student_id, alumni_id, company, position, message, resume_url]
        );

        res.status(201).json({
            message: 'Referral request sent successfully',
            referralRequestId: result.insertId
        });
    } catch (error) {
        console.error('Create referral request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getStudentReferralRequests = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        const [requests]: any[] = await pool.query(`
            SELECT 
                r.*,
                u.full_name as alumni_name,
                u.profile_picture as alumni_picture
            FROM referral_requests r
            JOIN users u ON r.alumni_id = u.id
            WHERE r.student_id = ?
            ORDER BY r.created_at DESC
        `, [studentId]);

        res.json({ referralRequests: requests });
    } catch (error) {
        console.error('Get student referral requests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAlumniReferralRequests = async (req: Request, res: Response) => {
    try {
        const { alumniId } = req.params;

        const [requests]: any[] = await pool.query(`
            SELECT 
                r.*,
                u.full_name as student_name,
                u.profile_picture as student_picture,
                sp.university,
                sp.department
            FROM referral_requests r
            JOIN users u ON r.student_id = u.id
            LEFT JOIN student_profiles sp ON u.id = sp.user_id
            WHERE r.alumni_id = ?
            ORDER BY r.created_at DESC
        `, [alumniId]);
        console.log('Returning referral requests:', requests.map(r => ({ id: r.id, resume_url: r.resume_url })));

        res.json({ referralRequests: requests });
    } catch (error) {
        console.error('Get alumni referral requests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateReferralRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, note } = req.body;

        await pool.query(
            `UPDATE referral_requests SET status = ?, note = ? WHERE id = ?`,
            [status, note || null, id]
        );

        res.json({ message: 'Referral request status updated successfully' });
    } catch (error) {
        console.error('Update referral request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
