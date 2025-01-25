import React, { useState, useEffect, useRef } from 'react';
import { TextInput, SafeAreaView, ImageBackground, Text, View, Dimensions, Image, 
  StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated, Keyboard 
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import CyclicScrollPicker from '@/components/home-components/CyclicScrollPicker';
import HorizontalScrollLoopPicker from '@/components/home-components/HorizontalScrollLoopPicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTaskController, Task } from '@/components/storage/TasksController';
import { TaskListView } from '@/components/home-components/TaskListView';
import { PomodoroTimer } from '@/components/home-components/PomodoroTimer';
import CustomTabBar from '@/components/home-components/CustomTabBar'


const { width } = Dimensions.get('window');
const radius = width * 0.35;
const circumference = 2 * Math.PI * radius;

export default function HomeScreen() {
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showTaskView, setTaskView] = useState(false);
  const [showAddTaskView, setAddTaskView] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [numberOfPomodoros, setNumberOfPomodoro] = useState(1);
  const [overlayOpacity] = useState(new Animated.Value(0));
  const inputRef = useRef<TextInput>(null);
  const [taskName, setTaskName] = useState('');
  const { createTask } = useTaskController();
  const strokeDashoffset = circumference * (1 - seconds / (selectedMinutes * 60));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { initializeDatabase } = useTaskController();
  const [isToggling, setIsToggling] = useState(false);
  const { toggleTaskCompletion } = useTaskController();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
    };
    init();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  useEffect(() => {
    if (showAddTaskView && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddTaskView]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleContinue = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    if (selectedTask){
        setShowConfirmModal(true);
        setIsPaused(true);
    }else{
      setIsActive(false);
      setIsPaused(false);
      setSelectedMinutes(25);
      setSeconds(25 * 60);
    }
  };

  const handleTimePress = () => {
    if (!isActive) {
      setSelectedMinutes(selectedMinutes);
      setShowDurationPicker(true);
    }
  };

  const handleSelectDuration = (minutes: number) => {
    setSelectedMinutes(minutes);
    setSeconds(minutes * 60);
    setShowDurationPicker(false);
  };

  const handleSetNumberOfPomodoro = (num: number) => {
    setNumberOfPomodoro(num);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const openTaskView = () =>{
    setTaskView(true);
  }

  useEffect(() => {
    if (showAddTaskView || showTaskView || showConfirmModal) {
      Animated.timing(overlayOpacity, {
        toValue: 0.2,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showAddTaskView, showTaskView, showConfirmModal]);

  const handleCreateTask = async () => {
    if (!taskName.trim()) {
      return;
    }

    const newTask: Omit<Task, 'id'> = {
      name: taskName.trim(),
      numberOfPomodoros: numberOfPomodoros,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const taskId = await createTask(newTask);
    
    if (taskId) {
      setTaskName('');
      setNumberOfPomodoro(1);
      setAddTaskView(false);
    }else{
      setTaskName('Failed to add');
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleToggleComplete = async () => {
    alert('called');
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

  const handleCloseTask = () => {
    setSelectedTask(null);
    setSeconds(1500);
    setIsActive(false);
    setSelectedMinutes(25);
  };

  const handlePhaseChange = (newDuration: number) => {
    setSeconds(newDuration);
    setSelectedMinutes(newDuration / 60);
    setIsActive(true);
    setIsPaused(false);
  };

  const handleStatusChange = (newStatus: boolean) => {
    setIsPaused(true);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/bg.jpg')}
      className="flex-1 justify-center items-center"
      resizeMode="cover">
      <SafeAreaView className="flex-1 justify-center items-center">

        {/* Modal Overlay ------------------------------------------------------------------- */}
        {(showAddTaskView || showTaskView || showConfirmModal) && (
          <Animated.View 
            className='w-full h-full bg-black absolute'
            style={{ opacity: overlayOpacity }}
          />
        )}

        {/* Task View Button ---------------------------------------------------------------- */}
        <View className='absolute top-32 w-full flex-row justify-center px-6'>
          
              {selectedTask ? (
                <View className='bg-white/30 border border-white/80 p-4 flex-row justify-between rounded-full w-full'>
                  <View className='flex-row justify-left items-center'>
                    <TouchableOpacity 
                      onPress={handleToggleComplete}
                      disabled={isToggling}
                      className='mr-3'
                    >
                      <View className={`w-8 h-8 rounded-full border border-slate-800 items-center justify-center
                        ${selectedTask.completed ? 'bg-slate-800' : 'bg-transparent'}`}
                      >
                        {selectedTask.completed && (
                          <Ionicons name="checkmark" size={16} color="white" />
                        )}
                      </View>
                    </TouchableOpacity>

                    <View className='flex-row items-center'>
                        <Text className="text-slate-800 text-lg font-medium">
                          {selectedTask.name}
                        </Text>
                        <Text className="text-slate-600 text-sm ml-2">
                          ( {selectedTask.numberOfPomodoros} pomodoro{selectedTask.numberOfPomodoros !== 1 ? 's' : ''} )
                        </Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    onPress={handleCloseTask}
                    className='ml-3'
                  >
                    <Ionicons name="close-circle" size={24} color="#4b5563" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                    onPress={openTaskView}
                    disabled={isActive}
                    className='bg-white/30 border border-white/80 px-8 flex-row justify-center py-4 rounded-full w-full'>
                    <Text className="text-slate-800 text-lg font-medium text-center">
                      Select Task...
                    </Text>
                </TouchableOpacity>
              )}
        </View>

        {/* Number of Pomodoro View --------------------------------------------------------- */}
        {selectedTask && (
           <PomodoroTimer 
            numberOfPomodoros={selectedTask.numberOfPomodoros}
            onComplete={() => {
              setIsActive(false);
              setSeconds(1500);
              setSelectedMinutes(25);
              handleToggleComplete();
            }}
            currentSeconds={seconds}
            onPhaseChange={handlePhaseChange}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Timer --------------------------------------------------------------------------- */}
        <View style={styles.circleContainer}>
          <Svg height={radius * 2 + 20} width={radius * 2 + 20} style={styles.svg} className='absolute'>
            <Circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              stroke="white"
              strokeWidth={10}
              fill="none"
              opacity={0.3}
            />
            <Circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              stroke="white"
              strokeWidth={10}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${radius + 10} ${radius + 10})`}
            />
          </Svg>

          {!showDurationPicker && (
            <TouchableOpacity 
              onPress={handleTimePress}
              disabled={isActive}
            >
              <Text className="text-slate-600 font-light" style={{ fontSize: 72 }}>
                {formatTime(seconds)}
              </Text>
            </TouchableOpacity>
          )}

          {showDurationPicker && (
            <CyclicScrollPicker
              selectedOption={selectedMinutes}
              onSelect={handleSelectDuration}
            />
          )}
        </View>

        {/* Timer Control ------------------------------------------------------------------- */}
        {!showDurationPicker && (
          <View className="flex-row mt-10 space-x-4 absolute" style={{ bottom: 180 }}>
            {!isActive ? (
              <TouchableOpacity
                onPress={handleStart}
                className="bg-white/80 px-8 py-4 rounded-full"
              >
                <Text className="text-slate-600 text-lg font-semibold">Start Focus</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={isPaused ? handleContinue : handlePause}
                  className="bg-white/80 px-8 mr-4 py-4 rounded-full"
                >
                  <Text className="text-slate-600 text-lg font-semibold">
                    {isPaused ? 'Continue' : 'Pause'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleStop}
                  className="bg-white/80 px-8 py-4 rounded-full"
                >
                  <Text className="text-slate-600 text-lg font-semibold">Stop</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Task View Modal ----------------------------------------------------------------- */}
        <Modal
          visible={showTaskView}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setTaskView(false)}>
              <TouchableOpacity 
                className="w-full h-full absolute"
                onPress={() => setTaskView(false)}
              ></TouchableOpacity>
              <View className="bg-slate-600 rounded-t-3xl absolute bottom-0 w-full h-2/3">
                  <View className="flex-row w-full justify-center items-center mt-4">
                      <TouchableOpacity onPress={() => {
                            setAddTaskView(true);
                            setTaskView(false);
                          }} className='px-4 flex-row items-end'>
                        <Text className="text-white font-semibold text-2xl mr-2">Today</Text>
                        <Ionicons name="chevron-down" size={20} color="white" />
                      </TouchableOpacity>
                  </View>
                  <TaskListView 
                    setTaskView={setTaskView}
                    setAddTaskView={setAddTaskView}
                    onSelectTask={handleTaskSelect}
                  />

                  <View className="flex-row w-full justify-center items-center px-4 py-4 mt-2 absolute bottom-0 bg-slate-600">
                    <TouchableOpacity onPress={() => {
                          setAddTaskView(true);
                          setTaskView(false);
                        }} className='bg-slate-50 rounded-full px-4 py-2'>
                      <Text className="text-slate-600 text-4xl">+</Text>
                    </TouchableOpacity>
                    
                    <View className="absolute right-4">
                      <TouchableOpacity onPress={() => {
                            setTaskView(false);
                          }} className='px-4 flex-row items-end'>
                        <Text className="text-gray-200 text-xl mr-2">Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
              </View>
        </Modal>

        {/* Add Task View Modal ------------------------------------------------------------- */}
        <Modal
          visible={showAddTaskView}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setAddTaskView(false)}
        >
          <TouchableOpacity 
            className="flex-1 w-full h-full absolute" 
            onPress={() => {
              setAddTaskView(false);
              setTaskName('');
              setNumberOfPomodoro(1);
            }}
          ></TouchableOpacity>
              <TouchableWithoutFeedback onPress={() => Keyboard.isVisible()}>
                  <View className="bg-slate-600 rounded-t-3xl absolute bottom-0 w-full">
                      <View className='w-full flex justify-center mt-2 p-4'>
                        <TextInput
                          ref={inputRef}
                          className="rounded-lg px-4 py-2 text-2xl text-white"
                          placeholder="Add new task..."
                          placeholderTextColor="#94a3b8"
                          autoFocus={true}
                          value={taskName}
                          onChangeText={setTaskName}
                        />
                      </View>
                    
                      <View className='w-full flex justify-center border-t border-slate-500 pt-2'>
                        <Text className='text-center text-gray-300 mb-2'>Number of Pomodoros</Text>
                      </View>

                      {/* Loop of number 1 to 60 here */}
                      <HorizontalScrollLoopPicker onSelect={handleSetNumberOfPomodoro} />

                      <View className='w-full flex-row justify-between mt-2 px-4'>
                        <View className='w-1/2 flex-row justify-start mt-2'>
                          <TouchableOpacity 
                            activeOpacity={1} 
                            onPress={handleCreateTask}>
                            <Ionicons className='mr-6' name="calendar" size={20} color={'#4dc3ff'} />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            activeOpacity={1} 
                            onPress={handleCreateTask}>
                            <Ionicons className='mr-6' name="flag" size={20} color={'#b3ffb3'} />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            activeOpacity={1} 
                            onPress={handleCreateTask}>
                            <Ionicons name="pricetag" size={20} color={'#ffccff'} />
                          </TouchableOpacity>
                        </View>
                        <View className='w-1/2 flex-row justify-end mt-2'>
                          <TouchableOpacity 
                            activeOpacity={1} 
                            onPress={handleCreateTask}>
                            <Text className='text-2xl text-right text-gray-200 mb-2'>Done</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
              </TouchableWithoutFeedback>
        </Modal>

        {/* Confirm Modal ------------------------------------------------------------------- */}
        <Modal
          visible={showConfirmModal}
          transparent={true}
          animationType="fade"
        >
          <View className="flex-1 justify-center px-6 items-center">
            <View className="rounded-2xl p-6 w-full items-center" style={ styles.alert }>
              <Text className="text-2xl font-semibold text-white mb-4">
                Stop this Pomodoro?
              </Text>
              <View className="w-full mt-10 flex-row justify-between items-center">
                  <TouchableOpacity
                    onPress={() => {
                      setShowConfirmModal(false);
                      setIsPaused(false);
                    }}
                    className="px-6 py-3 rounded-full"
                  >
                    <Text className="text-gray-300 text-lg font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTask(null);
                      setShowConfirmModal(true);
                      setSelectedMinutes(25);
                      setSeconds(1500);
                      setIsActive(false);
                      setShowConfirmModal(false);
                    }}
                    className="bg-slate-800 px-6 py-4 rounded-full"
                  >
                    <Text className="text-white text-lg font-medium">Stop</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>

        {/* Navigation Bar ------------------------------------------------------------------ */}
        <CustomTabBar />

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    width: radius * 2 + 40,
    height: radius * 2 + 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  svg: {
    overflow: 'visible',
    position: 'absolute',
  },
  pickerContent: {
    paddingVertical: 20,
  },
  pomodoroImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  alert: {
    backgroundColor: '#47576b',
    padding: 20,
    borderRadius: 15
  },
});