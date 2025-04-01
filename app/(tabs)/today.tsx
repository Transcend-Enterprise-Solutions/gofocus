import { View, Text, SafeAreaView, ScrollView, ImageBackground, 
  TouchableOpacity, StyleSheet, Dimensions, Image } 
from 'react-native'
import React, { useEffect, useState } from 'react';
import { TaskController, Task } from '@/components/storage/TasksController';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Today = () => {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const { getAllTasks, toggleTaskCompletion } = TaskController();
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [totalPomos, setTotalPomos] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
    let total = 0;
    tasks.forEach(task => {
      total += task.numberOfPomodoros;
    });
    setTotalPomos(total);
    setTotalMinutes(total * 25);
  }, [tasks]);


  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleComplete = async () => {
    if (!selectedTask || isToggling) return;
    
    setIsToggling(true);
    setSelectedTask(prev => prev ? {
      ...prev,
      completed: !prev.completed
    } : null);

    setTimeout(async () => {
      await toggleTaskCompletion(selectedTask.id);
      setIsToggling(false);
      setSelectedTask(null);
    }, 500);
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <TouchableOpacity>
        <View className="flex-row items-center py-3 border-b border-slate-500" style={styles.task}>
            <View className='flex-row items-center justify-between w-full'>

                <TouchableOpacity 
                    onPress={handleToggleComplete}
                    disabled={isToggling}
                    className='mr-3'
                  >
                  <View className={`w-8 h-8 rounded-full border border-slate-800 items-center justify-center
                    ${selectedTask && selectedTask.completed ? 'bg-slate-800' : 'bg-slate-500'}`}
                  >
                    {selectedTask && selectedTask.completed && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>

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
                          // onSelectTask(task);
                          // setTaskView(false);
                        }}>
                        <Ionicons name="play" size={20} color={'#ffd6d6'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
        source={require('@/assets/images/gradient.png')}
        className="flex justify-center items-center"
        resizeMode="cover">
        <SafeAreaView className="flex justify-center items-center w-full h-full">


            <View className='w-full h-full'>
                <View className='p-4 flex-row items-center justify-between bg-slate-600 shadow-lg'>
                    <View className='mt-6 flex flex-row items-center justify-left gap-4'>
                        <TouchableOpacity 
                            onPress={() => {
                                router.push('/menu');
                            }}>
                            <Image source={require('@/assets/images/back.png')} style={{ height: 25, width: 25 }}/>
                        </TouchableOpacity>
                        <Text className="text-white font-semibold" style={{ fontSize: 20 }}>
                            Today
                        </Text>
                    </View>
                </View>

                <View className='p-4 flex justify-center w-full'>
                    <TouchableOpacity 
                        onPress={() => {
                            // router.push('/menu');
                        }} className='rounded-lg bg-slate-600 py-4 w-full flex justify-center items-center'>
                        <Text className='text-gray-200 text-center w-full' style={{ fontSize: 17 }}>+ Add Task</Text>
                    </TouchableOpacity>
                </View>

                <Text className='text-slate-400 ml-4 text-lg'>Tasks • {totalPomos} pomodoro{totalPomos > 1 ? 's' : ''} • {totalMinutes} min{totalMinutes > 1 ? 's' : ''}</Text>

                <View className="w-full h-full " style={{ marginTop: 20 }}>
                    <ScrollView className="flex-1"
                          contentContainerStyle={{
                                paddingBottom: Dimensions.get('window').height - 500,}}>
                      <View className="flex-1 px-4">
                        <View className="flex-1">
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
            </View>


        </SafeAreaView>
    </ImageBackground>
  )
}

export default Today

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