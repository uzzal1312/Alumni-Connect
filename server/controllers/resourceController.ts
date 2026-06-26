import pool from '../config/database.js';
import { Request, Response } from 'express';

export const getResources = async (req: Request, res: Response) => {
  try {
    const [resources]: any[] = await pool.query(
      `SELECT r.*, u.full_name as alumni_name, u.profile_picture as alumni_picture 
       FROM resources r 
       JOIN users u ON r.alumni_id = u.id 
       ORDER BY r.created_at DESC`
    );

    res.json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlumniResources = async (req: Request, res: Response) => {
  try {
    const alumniId = req.params.alumniId;

    const [resources]: any[] = await pool.query(
      'SELECT * FROM resources WHERE alumni_id = ? ORDER BY created_at DESC',
      [alumniId]
    );

    res.json({ resources });
  } catch (error) {
    console.error('Get alumni resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const { alumniId, title, description, fileUrl, resourceType } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO resources (alumni_id, title, description, file_url, resource_type) VALUES (?, ?, ?, ?, ?)',
      [alumniId, title, description, fileUrl, resourceType]
    );

    res.status(201).json({
      message: 'Resource created successfully',
      resourceId: result.insertId
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  try {
    const resourceId = req.params.id;
    const { title, description, fileUrl, resourceType } = req.body;

    await pool.query(
      `UPDATE resources 
       SET title = COALESCE(?, title), 
           description = COALESCE(?, description), 
           file_url = COALESCE(?, file_url), 
           resource_type = COALESCE(?, resource_type) 
       WHERE id = ?`,
      [title, description, fileUrl, resourceType, resourceId]
    );

    res.json({ message: 'Resource updated successfully' });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const resourceId = req.params.id;

    await pool.query('DELETE FROM resources WHERE id = ?', [resourceId]);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
