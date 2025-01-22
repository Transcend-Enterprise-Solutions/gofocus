import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useTaskController, Task } from '@/components/storage/TasksController';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TaskListViewProps {
  setTaskView: (show: boolean) => void;
  setAddTaskView: (show: boolean) => void;
  onSelectTask: (task: Task) => void; 
}

export const TaskListView: React.FC<TaskListViewProps> = ({ 
  setTaskView, 
  setAddTaskView,
  onSelectTask 
}) => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const { getAllTasks, toggleTaskCompletion } = useTaskController();
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const allTasks = await getAllTasks();
      const incompleteTasks = allTasks.filter(task => !task.completed);
      setTasks(incompleteTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    await toggleTaskCompletion(taskId);
    loadTasks(); // Reload tasks after toggling
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <View className="flex-row items-center py-3 border-b border-slate-500" style={styles.task}>
        <View className='flex-row items-center justify-between w-full'>
            <View className="flex-1">
                <Text className="text-white font-semibold" style={{ fontSize: 18 }}>
                {task.name}
                </Text>
                <View className='flex-row items-center'>
                    <Image
                        source={require('@/assets/images/food.png')} // Update the path based on where your image is stored
                        style={styles.pomodoroImage}
                    />
                    <Text style={{ color: 'lightgrey', fontSize: 15 }}>
                        {task.numberOfPomodoros} pomodoro{task.numberOfPomodoros !== 1 ? 's' : ''}
                    </Text>
                </View>
            </View>
            <View>
                <TouchableOpacity onPress={() => {
                      onSelectTask(task);
                      setTaskView(false);
                    }}>
                    <Ionicons name="play" size={20} color={'#ffd6d6'} />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );

  return (
    <View className="w-full h-full bg-slate-600" style={{ marginTop: 20 }}>
      <ScrollView className="flex-1"
            contentContainerStyle={{
                  paddingBottom: Dimensions.get('window').height - 500,}}>
        <View className="flex-1 px-4">
          <View className="flex-1 mt-4">
            {tasks.length === 0 ? (
              <Text className="text-gray-200 text-lg">No tasks added</Text>
            ) : (
              tasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  task: {
    padding: 10,
    marginBottom: 10,
    borderBottomColor: '#4B5563',
    borderBottomWidth: 1,
  },
  pomodoroImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});