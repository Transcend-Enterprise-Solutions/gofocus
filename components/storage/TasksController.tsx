import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback } from 'react';

export interface Task {
    id: string;
    name: string;
    numberOfPomodoros: number;
    completed: boolean;
    createdAt: string;
}

export const useTaskController = () => {
  const db = useSQLiteContext();
  const [error, setError] = useState<string | null>(null);

  // Initialize the tasks table
  const initializeDatabase = useCallback(async () => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          numberOfPomodoros INTEGER NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL
        )`
      );
    } catch (err) {
      setError(`Failed to initialize database: ${(err as Error).message}`);
    }
  }, [db]);

  // Create a new task -----------------------------------------------------------------------------
  const createTask = useCallback(async (task: Omit<Task, 'id'>) => {
    try {
      const id = Math.random().toString(36).substring(7);
      await db.runAsync(
        `INSERT INTO tasks (id, name, numberOfPomodoros, completed, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [
          id,
          task.name,
          task.numberOfPomodoros,
          task.completed ? 1 : 0,
          task.createdAt,
        ]
      );
      return id;
    } catch (err) {
      setError(`Failed to create task: ${(err as Error).message}`);
      return null;
    }
  }, [db]);

  // Get all tasks ---------------------------------------------------------------------------------
  const getAllTasks = useCallback(async (): Promise<Task[]> => {
    try {
      const result = await db.getAllAsync<Task>(
        `SELECT id, name, numberOfPomodoros, completed, createdAt FROM tasks`
      );
      return result.map(task => ({
        ...task,
        completed: Boolean(task.completed),
        numberOfPomodoros: Number(task.numberOfPomodoros)
      }));
    } catch (err) {
      setError(`Failed to fetch tasks: ${(err as Error).message}`);
      return [];
    }
  }, [db]);

  // Get a single task by ID ------------------------------------------------------------------------
  const getTaskById = useCallback(async (id: string): Promise<Task | null> => {
    try {
      const result = await db.getFirstAsync<Task>(
        `SELECT id, name, numberOfPomodoros, completed, createdAt 
         FROM tasks WHERE id = ?`,
        [id]
      );
      if (!result) return null;
      return {
        ...result,
        completed: Boolean(result.completed),
        numberOfPomodoros: Number(result.numberOfPomodoros)
      };
    } catch (err) {
      setError(`Failed to fetch task: ${(err as Error).message}`);
      return null;
    }
  }, [db]);

  // Update a task ----------------------------------------------------------------------------------
  const updateTask = useCallback(async (task: Task): Promise<boolean> => {
    try {
      await db.runAsync(
        `UPDATE tasks 
         SET name = ?, numberOfPomodoros = ?, completed = ?, createdAt = ?
         WHERE id = ?`,
        [
          task.name,
          task.numberOfPomodoros,
          task.completed ? 1 : 0,
          task.createdAt,
          task.id,
        ]
      );
      return true;
    } catch (err) {
      setError(`Failed to update task: ${(err as Error).message}`);
      return false;
    }
  }, [db]);

  // Delete a task ----------------------------------------------------------------------------------
  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [id]);
      return true;
    } catch (err) {
      setError(`Failed to delete task: ${(err as Error).message}`);
      return false;
    }
  }, [db]);

  // Toggle task completion ----------------------------------------------------------------------------------
  const toggleTaskCompletion = useCallback(async (id: string): Promise<boolean> => {
    try {
      await db.runAsync(
        `UPDATE tasks SET completed = NOT completed WHERE id = ?`,
        [id]
      );
      return true;
    } catch (err) {
      setError(`Failed to toggle task completion: ${(err as Error).message}`);
      return false;
    }
  }, [db]);

  return {
    initializeDatabase,
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    error
  };
};