import { SQLiteProvider } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const tasksDB = 'tasks.db';
const projectsDB = 'projects.db';
const databasePath = FileSystem.documentDirectory + 'SQLite/' + tasksDB;

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  return (
    <SQLiteProvider databaseName={tasksDB}>
      {/* <SQLiteProvider databaseName={projectsDB}> */}
        {children}
      {/* </SQLiteProvider> */}
    </SQLiteProvider>
  );
};