import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.ts';
import { Request, Response } from 'express';

// Student Registration
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, full_name, university, department, current_year } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const [existingUsers]: any[] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult]: any = await pool.query(
      'INSERT INTO users (email, password, full_name, role, is_verified) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, 'student', true]
    );

    const userId = userResult.insertId;

    await pool.query(
      'INSERT INTO student_profiles (user_id, university, department, current_year) VALUES (?, ?, ?, ?)',
      [userId, university, department, current_year]
    );

    const token = jwt.sign(
      { userId, role: 'student' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: { id: userId, email, full_name, role: 'student' }
    });

  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Alumni Registration Step 1: Start application (store basic info)
export const registerAlumniStep1 = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, full_name, graduation_year, field_of_study } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists in users or verification queue
    const [existingUsers]: any[] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    const [existingApplications]: any[] = await pool.query(
      'SELECT id FROM verification_queue WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0 || existingApplications.length > 0) {
      return res.status(400).json({ message: 'Email already registered or application pending' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO verification_queue (email, password, full_name, graduation_year, field_of_study, status) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, graduation_year, field_of_study, 'Pending']
    );

    res.status(200).json({
      message: 'Step 1 completed',
      email
    });

  } catch (error) {
    console.error('Alumni step 1 error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Alumni Registration Step 2: Professional profile
export const registerAlumniStep2 = async (req: Request, res: Response) => {
  try {
    const { email, current_job_title, current_company, industry, professional_bio, linkedin_url, github_url, portfolio_url, research_url, profile_picture } = req.body;

    const [applications]: any[] = await pool.query(
      'SELECT id FROM verification_queue WHERE email = ?',
      [email]
    );

    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await pool.query(
      'UPDATE verification_queue SET current_job_title = ?, current_company = ?, industry = ?, professional_bio = ?, linkedin_url = ?, github_url = ?, portfolio_url = ?, research_url = ?, profile_picture = ? WHERE email = ?',
      [current_job_title, current_company, industry, professional_bio, linkedin_url, github_url, portfolio_url, research_url, profile_picture, email]
    );

    res.status(200).json({
      message: 'Step 2 completed',
      email
    });

  } catch (error) {
    console.error('Alumni step 2 error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Alumni Registration Step 3: Work history & submit for verification
export const registerAlumniStep3 = async (req: Request, res: Response) => {
  try {
    const { email, work_history } = req.body;

    const [applications]: any[] = await pool.query(
      'SELECT id FROM verification_queue WHERE email = ?',
      [email]
    );

    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await pool.query(
      'UPDATE verification_queue SET work_history = ? WHERE email = ?',
      [JSON.stringify(work_history), email]
    );

    res.status(200).json({
      message: 'Application submitted for verification successfully',
      email
    });

  } catch (error) {
    console.error('Alumni step 3 error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [users]: any[] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Check if user is in verification queue (pending)
      const [pendingApps]: any[] = await pool.query(
        'SELECT status FROM verification_queue WHERE email = ?',
        [email]
      );
      
      if (pendingApps.length > 0) {
        const status = pendingApps[0].status;
        if (status === 'Pending') {
          return res.status(403).json({ message: 'Your application is pending approval' });
        } else if (status === 'Rejected') {
          return res.status(403).json({ message: 'Your application was rejected' });
        }
      }
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    
    // Check if alumni is verified (approved)
    if (user.role === 'alumni' && !user.is_verified) {
      return res.status(403).json({ message: 'Your account is not verified yet' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all pending alumni applications
export const getPendingApplications = async (req: Request, res: Response) => {
  try {
    const [applications]: any[] = await pool.query(
      'SELECT * FROM verification_queue WHERE status = "Pending" ORDER BY created_at DESC'
    );

    res.status(200).json({
      applications
    });

  } catch (error) {
    console.error('Get pending applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Approve alumni application
export const approveAlumniApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [applications]: any[] = await pool.query(
      'SELECT * FROM verification_queue WHERE id = ?',
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const app = applications[0];

    // Create user in users table
    const [userResult]: any = await pool.query(
      'INSERT INTO users (email, password, full_name, role, is_verified, profile_picture) VALUES (?, ?, ?, ?, ?, ?)',
      [app.email, app.password, app.full_name, 'alumni', true, app.profile_picture]
    );

    const userId = userResult.insertId;

    // Create alumni profile
    const [alumniProfileResult]: any = await pool.query(
      'INSERT INTO alumni_profiles (user_id, graduation_year, field_of_study, current_job_title, current_company, industry, bio, linkedin_url, github_url, portfolio_url, research_url, expertise, referral_companies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, app.graduation_year, app.field_of_study, app.current_job_title, app.current_company, app.industry, app.professional_bio, app.linkedin_url, app.github_url, app.portfolio_url, app.research_url, app.expertise, app.referral_companies]
    );

    const alumniProfileId = alumniProfileResult.insertId;

    // Create work history entries if any
    if (app.work_history) {
      const workHistoryArray = JSON.parse(app.work_history);
      for (const work of workHistoryArray) {
        await pool.query(
          'INSERT INTO work_history (alumni_profile_id, job_title, company, location, start_date, end_date, is_current, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [alumniProfileId, work.job_title, work.company, work.location, work.start_date, work.end_date, work.is_current || false, work.description]
        );
      }
    }

    // Update application status to Approved
    await pool.query(
      'UPDATE verification_queue SET status = "Approved" WHERE id = ?',
      [id]
    );

    res.status(200).json({
      message: 'Alumni application approved successfully',
      userId
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Reject alumni application
export const rejectAlumniApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const [applications]: any[] = await pool.query(
      'SELECT id FROM verification_queue WHERE id = ?',
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await pool.query(
      'UPDATE verification_queue SET status = "Rejected", notes = ? WHERE id = ?',
      [notes, id]
    );

    res.status(200).json({
      message: 'Alumni application rejected successfully'
    });

  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
