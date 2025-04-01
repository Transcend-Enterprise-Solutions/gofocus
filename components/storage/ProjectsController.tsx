import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback } from 'react';

export interface Project {
    id: string;
    name: string;
    priorityType: number;
    createdAt: string;
}

export const ProjectController = () => {
  const db = useSQLiteContext();
  const [error, setError] = useState<string | null>(null);

  // Initialize the tasks table ------------------------------------------------------------------------
  const initializeDatabase = useCallback(async () => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          priorityType INTEGER NULL,
          createdAt TEXT NOT NULL
        )`
      );
    } catch (err) {
      setError(`Failed to initialize database: ${(err as Error).message}`);
    }
  }, [db]);

  // Create a new project ------------------------------------------------------------------------------
  const createProject = useCallback(async (project: Omit<Project, 'id'>) => {
    try {
      const id = Math.random().toString(36).substring(7);
      await db.runAsync(
        `INSERT INTO projects (id, name, priorityType, createdAt)
         VALUES (?, ?, ?, ?)`,
        [
          id,
          project.name,
          project.priorityType,
          project.createdAt,
        ]
      );
      return id;
    } catch (err) {
      setError(`Failed to create projects: ${(err as Error).message}`);
      return null;
    }
  }, [db]);

  // Get all projects ----------------------------------------------------------------------------------
  const getAllProjects = useCallback(async (): Promise<Project[]> => {
    try {
      const result = await db.getAllAsync<Project>(
        `SELECT id, name, priorityType, createdAt FROM projects`
      );
      return result.map(project => ({
        ...project,
        name: String(project.name),
        priorityType: Number(project.priorityType)
      }));
    } catch (err) {
      setError(`Failed to fetch projects: ${(err as Error).message}`);
      return [];
    }
  }, [db]);

  // Get a single project by ID ------------------------------------------------------------------------
  const getProjectById = useCallback(async (id: string): Promise<Project | null> => {
    try {
      const result = await db.getFirstAsync<Project>(
        `SELECT id, name, priorityType, createdAt 
         FROM projects WHERE id = ?`,
        [id]
      );
      if (!result) return null;
      return {
        ...result,
        name: String(result.name),
        priorityType: Number(result.priorityType)
      };
    } catch (err) {
      setError(`Failed to fetch projects: ${(err as Error).message}`);
      return null;
    }
  }, [db]);

  // Update a project ----------------------------------------------------------------------------------
  const updateProject = useCallback(async (project: Project): Promise<boolean> => {
    try {
      await db.runAsync(
        `UPDATE projects 
         SET name = ?, priorityType = ?, createdAt = ?
         WHERE id = ?`,
        [
          project.name,
          project.priorityType,
          project.createdAt,
          project.id,
        ]
      );
      return true;
    } catch (err) {
      setError(`Failed to update projects: ${(err as Error).message}`);
      return false;
    }
  }, [db]);

  // Delete a project ----------------------------------------------------------------------------------
  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      await db.runAsync(`DELETE FROM projects WHERE id = ?`, [id]);
      return true;
    } catch (err) {
      setError(`Failed to delete projects: ${(err as Error).message}`);
      return false;
    }
  }, [db]);

  return {
    initializeDatabase,
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    error
  };
};