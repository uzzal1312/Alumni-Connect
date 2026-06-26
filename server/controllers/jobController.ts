import pool from '../config/database.ts';
import { Request, Response } from 'express';

export const getJobs = async (req: Request, res: Response) => {
  try {
    const [jobs]: any[] = await pool.query(`
      SELECT 
        jobs.*,
        users.full_name as poster_name,
        alumni_profiles.current_job_title as poster_role,
        users.profile_picture as poster_img,
        alumni_profiles.bio as poster_bio,
        COUNT(CASE WHEN job_applications.status = 'Accepted' THEN job_applications.id END) as filled_spots
      FROM jobs
      JOIN users ON jobs.alumni_id = users.id
      LEFT JOIN alumni_profiles ON users.id = alumni_profiles.user_id
      LEFT JOIN job_applications ON jobs.id = job_applications.job_id
      WHERE jobs.deadline >= CURDATE() OR jobs.status = 'Closed'
      GROUP BY jobs.id
      ORDER BY jobs.created_at DESC
    `);
    res.json({ jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const [jobs]: any[] = await pool.query(`
      SELECT 
        jobs.*,
        users.full_name as poster_name,
        alumni_profiles.current_job_title as poster_role,
        users.profile_picture as poster_img,
        alumni_profiles.bio as poster_bio,
        COUNT(CASE WHEN job_applications.status = 'Accepted' THEN job_applications.id END) as filled_spots
      FROM jobs
      JOIN users ON jobs.alumni_id = users.id
      LEFT JOIN alumni_profiles ON users.id = alumni_profiles.user_id
      LEFT JOIN job_applications ON jobs.id = job_applications.job_id
      WHERE jobs.id = ?
      GROUP BY jobs.id
    `, [jobId]);

    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job: jobs[0] });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const { alumni_id, company, company_logo, title, description, responsibilities, location, job_type, industry, experience_required, total_spots, deadline } = req.body;

    const [result]: any = await pool.query(
      `INSERT INTO jobs (alumni_id, company, company_logo, title, description, responsibilities, location, job_type, industry, experience_required, total_spots, deadline, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Open')`,
      [alumni_id, company, company_logo, title, description, responsibilities, location, job_type, industry, experience_required, total_spots, deadline]
    );

    res.status(201).json({
      message: 'Job posted successfully',
      jobId: result.insertId
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const applyForJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const { student_id, alumni_id, cover_note, resume_url } = req.body;

    let finalResumeUrl = resume_url;
    if (req.file) {
      finalResumeUrl = `/uploads/${req.file.filename}`;
    }

    const [result]: any = await pool.query(
      'INSERT INTO job_applications (job_id, student_id, alumni_id, cover_note, resume_url) VALUES (?, ?, ?, ?, ?)',
      [jobId, student_id, alumni_id, cover_note, finalResumeUrl]
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.insertId
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlumniJobs = async (req: Request, res: Response) => {
  try {
    const alumniId = req.params.alumniId;
    const [jobs]: any[] = await pool.query(`
      SELECT 
        jobs.*,
        users.full_name as poster_name,
        alumni_profiles.current_job_title as poster_role,
        users.profile_picture as poster_img,
        COUNT(job_applications.id) as total_applications,
        COUNT(CASE WHEN job_applications.status = 'Accepted' THEN job_applications.id END) as filled_spots
      FROM jobs
      JOIN users ON jobs.alumni_id = users.id
      LEFT JOIN alumni_profiles ON users.id = alumni_profiles.user_id
      LEFT JOIN job_applications ON jobs.id = job_applications.job_id
      WHERE jobs.alumni_id = ?
      GROUP BY jobs.id
      ORDER BY jobs.created_at DESC
    `, [alumniId]);
    res.json({ jobs });
  } catch (error) {
    console.error('Get alumni jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const { company, company_logo, title, description, responsibilities, location, job_type, industry, experience_required, total_spots, deadline, status } = req.body;

    await pool.query(
      `UPDATE jobs 
       SET company = COALESCE(?, company), 
           company_logo = COALESCE(?, company_logo), 
           title = COALESCE(?, title), 
           description = COALESCE(?, description), 
           responsibilities = COALESCE(?, responsibilities), 
           location = COALESCE(?, location), 
           job_type = COALESCE(?, job_type), 
           industry = COALESCE(?, industry), 
           experience_required = COALESCE(?, experience_required), 
           total_spots = COALESCE(?, total_spots), 
           deadline = COALESCE(?, deadline), 
           status = COALESCE(?, status) 
       WHERE id = ?`,
      [company, company_logo, title, description, responsibilities, location, job_type, industry, experience_required, total_spots, deadline, status, jobId]
    );

    res.json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    await pool.query('DELETE FROM jobs WHERE id = ?', [jobId]);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const closeJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    await pool.query("UPDATE jobs SET status = 'Closed' WHERE id = ?", [jobId]);
    res.json({ message: 'Job closed successfully' });
  } catch (error) {
    console.error('Close job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    // First, get the job details (total_spots, filled_spots)
    const [jobResult]: any[] = await pool.query(`
      SELECT 
        jobs.total_spots,
        COUNT(CASE WHEN job_applications.status = 'Accepted' THEN job_applications.id END) as filled_spots
      FROM jobs
      LEFT JOIN job_applications ON jobs.id = job_applications.job_id
      WHERE jobs.id = ?
      GROUP BY jobs.id
    `, [jobId]);
    const job = jobResult[0];
    
    // Then get the applications
    const [applications]: any[] = await pool.query(`
      SELECT 
        job_applications.*,
        users.full_name as student_name,
        users.profile_picture,
        student_profiles.university,
        student_profiles.department
      FROM job_applications
      JOIN users ON job_applications.student_id = users.id
      LEFT JOIN student_profiles ON users.id = student_profiles.user_id
      WHERE job_applications.job_id = ?
      ORDER BY job_applications.created_at DESC
    `, [jobId]);
    res.json({ applications, job });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentJobApplications = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const [applications]: any[] = await pool.query(`
      SELECT 
        job_applications.*,
        jobs.company,
        jobs.title,
        users.full_name as poster_name
      FROM job_applications
      JOIN jobs ON job_applications.job_id = jobs.id
      JOIN users ON jobs.alumni_id = users.id
      WHERE job_applications.student_id = ?
      ORDER BY job_applications.created_at DESC
    `, [studentId]);
    res.json({ applications });
  } catch (error) {
    console.error('Get student job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.id;
    const { status, note } = req.body;

    // First, get the job ID and current filled spots
    const [appResult]: any[] = await pool.query(
      'SELECT job_id FROM job_applications WHERE id = ?',
      [applicationId]
    );
    if (!appResult.length) {
      return res.status(404).json({ message: 'Application not found' });
    }
    const jobId = appResult[0].job_id;

    // If we're accepting, check if we have available slots
    if (status === 'Accepted') {
      const [jobResult]: any[] = await pool.query(`
        SELECT 
          total_spots,
          COUNT(CASE WHEN job_applications.status = 'Accepted' THEN job_applications.id END) as filled_spots
        FROM jobs
        LEFT JOIN job_applications ON jobs.id = job_applications.job_id
        WHERE jobs.id = ?
        GROUP BY jobs.id
      `, [jobId]);
      const job = jobResult[0];
      if (job.filled_spots >= job.total_spots) {
        return res.status(400).json({ message: 'All referral slots for this job are already filled' });
      }
    }

    await pool.query(
      'UPDATE job_applications SET status = ?, note = ? WHERE id = ?',
      [status, note || null, applicationId]
    );

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
