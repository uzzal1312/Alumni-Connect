import pool from '../config/database.ts';
import { Request, Response } from 'express';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [usersCount]: any[] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [studentsCount]: any[] = await pool.query("SELECT COUNT(*) as total FROM users WHERE role = 'student'");
    const [alumniCount]: any[] = await pool.query("SELECT COUNT(*) as total FROM users WHERE role = 'alumni'");
    const [pendingVerifications]: any[] = await pool.query("SELECT COUNT(*) as total FROM verification_queue WHERE status = 'Pending'");
    const [jobsCount]: any[] = await pool.query('SELECT COUNT(*) as total FROM jobs');
    const [connectionsCount]: any[] = await pool.query("SELECT COUNT(*) as total FROM connections WHERE status = 'Accepted'");

    res.json({
      stats: {
        totalUsers: usersCount[0].total,
        totalStudents: studentsCount[0].total,
        totalAlumni: alumniCount[0].total,
        pendingVerifications: pendingVerifications[0].total,
        totalJobs: jobsCount[0].total,
        totalConnections: connectionsCount[0].total
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, search } = req.query;
    console.log('=== getAllUsers called ===');
    console.log('Query params:', { role, search });
    
    // First get basic users
    let query = `
      SELECT id, email, full_name, role, profile_picture, is_verified, created_at
      FROM users
      WHERE 1=1
    `;
    const params: any[] = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';
    console.log('Final query:', query);
    console.log('Params:', params);

    const [users]: any[] = await pool.query(query, params);
    console.log('Fetched users:', users.length, users);

    // Then fetch student profiles for students
    const studentIds = users.filter((u: any) => u.role === 'student').map((u: any) => u.id);
    if (studentIds.length > 0) {
      const [studentProfiles]: any[] = await pool.query(
        'SELECT user_id, university, department, current_year, gpa FROM student_profiles WHERE user_id IN (?)',
        [studentIds]
      );
      // Create a map of student profiles
      const profileMap = new Map();
      studentProfiles.forEach((profile: any) => {
        profileMap.set(profile.user_id, profile);
      });
      // Attach profiles to users
      users.forEach((user: any) => {
        if (user.role === 'student' && profileMap.has(user.id)) {
          const profile = profileMap.get(user.id);
          user.university = profile.university;
          user.department = profile.department;
          user.current_year = profile.current_year;
          user.gpa = profile.gpa;
        }
      });
    }

    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    const [users]: any[] = await pool.query(`
      SELECT 
        u.id, u.email, u.full_name, u.role, u.profile_picture, u.is_verified, u.created_at,
        sp.*
      FROM users u
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      WHERE u.id = ? AND u.role = 'student'
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = users[0];
    if (student.skills) {
      try {
        student.skills = JSON.parse(student.skills);
      } catch (e) {
        student.skills = [];
      }
    }
    if (student.career_interests) {
      try {
        student.career_interests = JSON.parse(student.career_interests);
      } catch (e) {
        student.career_interests = [];
      }
    }

    res.json({ student });
  } catch (error) {
    console.error('Get student by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const {
      full_name,
      university,
      department,
      current_year,
      gpa,
      linkedin_url,
      github_url,
      academic_research_url,
      personal_website_url,
      bio,
      skills,
      career_interests
    } = req.body;

    // Update user table
    if (full_name) {
      await pool.query('UPDATE users SET full_name = ? WHERE id = ?', [full_name, userId]);
    }

    // Check if student profile exists
    const [existingProfiles]: any[] = await pool.query('SELECT id FROM student_profiles WHERE user_id = ?', [userId]);
    const skillsJson = skills ? JSON.stringify(skills) : null;
    const careerInterestsJson = career_interests ? JSON.stringify(career_interests) : null;

    if (existingProfiles.length > 0) {
      await pool.query(`
        UPDATE student_profiles SET
          university = COALESCE(?, university),
          department = COALESCE(?, department),
          current_year = COALESCE(?, current_year),
          gpa = COALESCE(?, gpa),
          linkedin_url = COALESCE(?, linkedin_url),
          github_url = COALESCE(?, github_url),
          academic_research_url = COALESCE(?, academic_research_url),
          personal_website_url = COALESCE(?, personal_website_url),
          bio = COALESCE(?, bio),
          skills = COALESCE(?, skills),
          career_interests = COALESCE(?, career_interests)
        WHERE user_id = ?
      `, [
        university, department, current_year, gpa, linkedin_url,
        github_url, academic_research_url, personal_website_url, bio,
        skillsJson, careerInterestsJson, userId
      ]);
    } else {
      await pool.query(`
        INSERT INTO student_profiles
        (user_id, university, department, current_year, gpa, linkedin_url, github_url, academic_research_url, personal_website_url, bio, skills, career_interests)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, university, department, current_year, gpa, linkedin_url,
        github_url, academic_research_url, personal_website_url, bio,
        skillsJson, careerInterestsJson
      ]);
    }

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const manageUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { action } = req.body;

    if (action === 'delete') {
      await pool.query('DELETE FROM users WHERE id = ?', [userId]);
      return res.json({ message: 'User deleted successfully' });
    }

    if (action === 'verify') {
      await pool.query('UPDATE users SET is_verified = TRUE WHERE id = ?', [userId]);
      return res.json({ message: 'User verified successfully' });
    }

    if (action === 'suspend') {
      await pool.query('UPDATE users SET is_verified = FALSE WHERE id = ?', [userId]);
      return res.json({ message: 'User suspended successfully' });
    }

    res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    console.error('Manage user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const [jobApplicationsByStatus]: any[] = await pool.query(
      'SELECT status, COUNT(*) as count FROM job_applications GROUP BY status'
    );
    const [verificationsByStatus]: any[] = await pool.query(
      'SELECT status, COUNT(*) as count FROM verification_queue GROUP BY status'
    );
    const [recentSignups]: any[] = await pool.query(
      'SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7'
    );

    res.json({
      analytics: {
        jobApplications: jobApplicationsByStatus,
        verifications: verificationsByStatus,
        recentSignups
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkManageUsers = async (req: Request, res: Response) => {
  try {
    const { userIds, action } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'No users selected' });
    }

    if (action === 'delete') {
      await pool.query('DELETE FROM users WHERE id IN (?)', [userIds]);
      return res.json({ message: 'Users deleted successfully' });
    }

    if (action === 'verify') {
      await pool.query('UPDATE users SET is_verified = TRUE WHERE id IN (?)', [userIds]);
      return res.json({ message: 'Users verified successfully' });
    }

    if (action === 'suspend') {
      await pool.query('UPDATE users SET is_verified = FALSE WHERE id IN (?)', [userIds]);
      return res.json({ message: 'Users suspended successfully' });
    }

    res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    console.error('Bulk manage users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
