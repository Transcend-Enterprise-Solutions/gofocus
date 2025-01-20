import { SQLiteProvider } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const databaseName = 'tasks.db';
const databasePath = FileSystem.documentDirectory + 'SQLite/' + databaseName;

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  return (
    <SQLiteProvider databaseName={databaseName}>
      {children}
    </SQLiteProvider>
  );
};