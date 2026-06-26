import pool from '../config/database.ts';
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    let query: any[] = [];
    let params: any[] = [];

    if (role === 'alumni') {
      const [users]: any[] = await pool.query(`
        SELECT 
          u.id as id,
          u.id as user_id,
          u.email,
          u.full_name,
          u.role,
          u.profile_picture,
          u.is_verified,
          u.created_at,
          ap.industry,
          ap.graduation_year,
          ap.current_job_title,
          ap.current_company,
          ap.bio,
          ap.is_mentor,
          IF(COALESCE(ap.is_mentor, FALSE) = TRUE, 'on', 'off') as mentoring_mode,
          (SELECT AVG(rating) FROM session_reviews WHERE alumni_id = u.id) as average_rating
        FROM users u
        LEFT JOIN alumni_profiles ap ON u.id = ap.user_id
        WHERE u.role = ? AND u.is_verified = TRUE
        ORDER BY u.created_at DESC
      `, [role]);
      console.log('Alumni data from DB:', users);
      res.json({ users });
    } else {
      let baseQuery = 'SELECT id, email, full_name, role, profile_picture, is_verified, created_at FROM users';
      if (role) {
        baseQuery += ' WHERE role = ?';
        params.push(role);
      }
      const [users]: any[] = await pool.query(baseQuery, params);
      res.json({ users });
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const [users]: any[] = await pool.query(
            'SELECT id, email, full_name, role, profile_picture, is_verified, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        if (user.role === 'student') {
            const [profiles]: any[] = await pool.query(
                'SELECT * FROM student_profiles WHERE user_id = ?',
                [userId]
            );
            user.profile = profiles[0] || null;
            if (user.profile) {
                try {
                    user.profile.skills = user.profile.skills ? JSON.parse(user.profile.skills) : [];
                    user.profile.career_interests = user.profile.career_interests ? JSON.parse(user.profile.career_interests) : [];
                } catch (e) {
                    user.profile.skills = [];
                    user.profile.career_interests = [];
                }
            }
        } else if (user.role === 'alumni') {
            const [profiles]: any[] = await pool.query(
                'SELECT * FROM alumni_profiles WHERE user_id = ?',
                [userId]
            );
            user.profile = profiles[0] || null;

            if (user.profile) {
                try {
                    user.profile.expertise = user.profile.expertise ? JSON.parse(user.profile.expertise) : [];
                    user.profile.referral_companies = user.profile.referral_companies ? JSON.parse(user.profile.referral_companies) : [];
                } catch (e) {
                    user.profile.expertise = [];
                    user.profile.referral_companies = [];
                }

                const [workHistory]: any[] = await pool.query(
                    'SELECT * FROM work_history WHERE alumni_profile_id = ? ORDER BY start_date DESC',
                    [user.profile.id]
                );
                user.workHistory = workHistory;

                const [reviews]: any[] = await pool.query(`
                    SELECT 
                        r.*,
                        u.full_name as student_name,
                        u.profile_picture as student_picture
                    FROM session_reviews r
                    JOIN users u ON r.student_id = u.id
                    WHERE r.alumni_id = ?
                    ORDER BY r.created_at DESC
                `, [userId]);
                user.reviews = reviews;

                const [avgRating]: any[] = await pool.query(
                    'SELECT AVG(rating) as avg_rating FROM session_reviews WHERE alumni_id = ?',
                    [userId]
                );
                user.avgRating = avgRating[0]?.avg_rating || 0;
            } else {
                user.workHistory = [];
                user.reviews = [];
                user.avgRating = 0;
            }
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { full_name } = req.body;
    let profile_picture = req.body.profile_picture;

    // Handle uploaded profile picture
    if (req.file) {
      profile_picture = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      'UPDATE users SET full_name = COALESCE(?, full_name), profile_picture = COALESCE(?, profile_picture) WHERE id = ?',
      [full_name, profile_picture, userId]
    );

    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudentProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { university, department, current_year, bio, linkedin_url, resume_url, gpa, github_url, academic_research_url, personal_website_url } = req.body;
    let skills = req.body.skills;
    let career_interests = req.body.career_interests;

    console.log('=== UPDATE STUDENT PROFILE CALLED ===');
    console.log('User ID:', userId);
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    // Parse skills and career interests if they are strings
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch (e) {
        skills = [];
      }
    }
    if (typeof career_interests === 'string') {
      try {
        career_interests = JSON.parse(career_interests);
      } catch (e) {
        career_interests = [];
      }
    }

    let finalResumeUrl = resume_url;
    let finalProfilePicture = req.body.profile_picture;

    // Handle uploaded resume
    if (req.files && (req.files as any)['resume'] && (req.files as any)['resume'][0]) {
      finalResumeUrl = `/uploads/${(req.files as any)['resume'][0].filename}`;
    }
    // Handle uploaded profile picture
    if (req.files && (req.files as any)['profilePicture'] && (req.files as any)['profilePicture'][0]) {
      finalProfilePicture = `/uploads/${(req.files as any)['profilePicture'][0].filename}`;
      // Also update user table's profile_picture
      await pool.query(
        'UPDATE users SET profile_picture = ? WHERE id = ?',
        [finalProfilePicture, userId]
      );
    }

    const [profiles]: any[] = await pool.query('SELECT id FROM student_profiles WHERE user_id = ?', [userId]);
    console.log('Existing profiles found:', profiles);

    const skillsJson = skills ? JSON.stringify(skills) : null;
    const careerInterestsJson = career_interests ? JSON.stringify(career_interests) : null;

    if (profiles.length > 0) {
      console.log('Updating existing profile');
      const [updateResult]: any = await pool.query(
        `UPDATE student_profiles 
         SET university = COALESCE(?, university), 
             department = COALESCE(?, department), 
             current_year = COALESCE(?, current_year), 
             bio = COALESCE(?, bio), 
             linkedin_url = COALESCE(?, linkedin_url), 
             resume_url = COALESCE(?, resume_url),
             gpa = COALESCE(?, gpa),
             skills = COALESCE(?, skills),
             career_interests = COALESCE(?, career_interests),
             github_url = COALESCE(?, github_url),
             academic_research_url = COALESCE(?, academic_research_url),
             personal_website_url = COALESCE(?, personal_website_url)
         WHERE user_id = ?`,
        [university, department, current_year, bio, linkedin_url, finalResumeUrl, gpa, skillsJson, careerInterestsJson, github_url, academic_research_url, personal_website_url, userId]
      );
      console.log('Update result:', updateResult);
    } else {
      console.log('Creating new profile');
      const [insertResult]: any = await pool.query(
        `INSERT INTO student_profiles (user_id, university, department, current_year, bio, linkedin_url, resume_url, gpa, skills, career_interests, github_url, academic_research_url, personal_website_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, university, department, current_year, bio, linkedin_url, finalResumeUrl, gpa, skillsJson, careerInterestsJson, github_url, academic_research_url, personal_website_url]
      );
      console.log('Insert result:', insertResult);
    }

    res.json({ message: 'Student profile updated successfully' });
  } catch (error) {
    console.error('=== UPDATE STUDENT PROFILE ERROR ===', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateAlumniProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { 
      university, department, graduation_year, field_of_study, 
      current_job_title, current_company, industry, bio, 
      linkedin_url, github_url, portfolio_url, research_url, 
      is_mentor, expertise, referral_companies 
    } = req.body;

    const [profiles]: any[] = await pool.query('SELECT id FROM alumni_profiles WHERE user_id = ?', [userId]);

    const expertiseJson = expertise ? JSON.stringify(expertise) : null;
    const referralCompaniesJson = referral_companies ? JSON.stringify(referral_companies) : null;

    if (profiles.length > 0) {
      await pool.query(
        `UPDATE alumni_profiles 
         SET university = COALESCE(?, university), 
             department = COALESCE(?, department), 
             graduation_year = COALESCE(?, graduation_year), 
             field_of_study = COALESCE(?, field_of_study), 
             current_job_title = COALESCE(?, current_job_title), 
             current_company = COALESCE(?, current_company), 
             industry = COALESCE(?, industry), 
             bio = COALESCE(?, bio), 
             linkedin_url = COALESCE(?, linkedin_url),
             github_url = COALESCE(?, github_url),
             portfolio_url = COALESCE(?, portfolio_url),
             research_url = COALESCE(?, research_url),
             is_mentor = COALESCE(?, is_mentor),
             expertise = COALESCE(?, expertise),
             referral_companies = COALESCE(?, referral_companies)
         WHERE user_id = ?`,
        [
          university, department, graduation_year, field_of_study, 
          current_job_title, current_company, industry, bio, 
          linkedin_url, github_url, portfolio_url, research_url, 
          is_mentor, expertiseJson, referralCompaniesJson, userId
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO alumni_profiles (
          user_id, university, department, graduation_year, field_of_study, 
          current_job_title, current_company, industry, bio, 
          linkedin_url, github_url, portfolio_url, research_url, 
          is_mentor, expertise, referral_companies
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, university, department, graduation_year, field_of_study, 
          current_job_title, current_company, industry, bio, 
          linkedin_url, github_url, portfolio_url, research_url, 
          is_mentor, expertiseJson, referralCompaniesJson
        ]
      );
    }

    res.json({ message: 'Alumni profile updated successfully' });
  } catch (error) {
    console.error('Update alumni profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addWorkHistory = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.params.id;
    const { job_title, company, location, start_date, end_date, is_current, description } = req.body;

    await connection.beginTransaction();

    let [profiles]: any[] = await connection.query('SELECT id FROM alumni_profiles WHERE user_id = ?', [userId]);
    let alumniProfileId: number;

    if (profiles.length === 0) {
      const [profileResult]: any = await connection.query('INSERT INTO alumni_profiles (user_id) VALUES (?)', [userId]);
      alumniProfileId = profileResult.insertId;
    } else {
      alumniProfileId = profiles[0].id;
    }

    const [result]: any = await connection.query(
      `INSERT INTO work_history (alumni_profile_id, job_title, company, location, start_date, end_date, is_current, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [alumniProfileId, job_title, company, location, start_date, end_date, is_current, description]
    );

    await connection.commit();
    res.status(201).json({ 
      message: 'Work history added successfully', 
      workHistoryId: result.insertId 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Add work history error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  } finally {
    connection.release();
  }
};

export const updateWorkHistory = async (req: Request, res: Response) => {
  try {
    const workHistoryId = req.params.id;
    const { job_title, company, location, start_date, end_date, is_current, description } = req.body;

    await pool.query(
      `UPDATE work_history 
       SET job_title = COALESCE(?, job_title), 
           company = COALESCE(?, company), 
           location = COALESCE(?, location), 
           start_date = COALESCE(?, start_date), 
           end_date = COALESCE(?, end_date), 
           is_current = COALESCE(?, is_current), 
           description = COALESCE(?, description)
       WHERE id = ?`,
      [job_title, company, location, start_date, end_date, is_current, description, workHistoryId]
    );

    res.json({ message: 'Work history updated successfully' });
  } catch (error) {
    console.error('Update work history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteWorkHistory = async (req: Request, res: Response) => {
  try {
    const workHistoryId = req.params.id;

    await pool.query('DELETE FROM work_history WHERE id = ?', [workHistoryId]);

    res.json({ message: 'Work history deleted successfully' });
  } catch (error) {
    console.error('Delete work history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
