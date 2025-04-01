import React, { useState, useEffect, useRef } from 'react';
import { 
  TextInput, SafeAreaView, ImageBackground, Text, View, Dimensions, Image, 
  StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated, Keyboard 
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import CyclicScrollPicker from '@/components/home-components/CyclicScrollPicker';
import HorizontalScrollLoopPicker from '@/components/home-components/HorizontalScrollLoopPicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TaskController, Task } from '@/components/storage/TasksController';
import { TaskListView } from '@/components/home-components/TaskListView';
import { PomodoroTimer } from '@/components/home-components/PomodoroTimer';
import CustomTabBar from '@/components/home-components/CustomTabBar';
import { Calendar } from 'react-native-calendars';
import { ProjectListView } from '@/components/home-components/ProjectListView';

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
  const { createTask } = TaskController();
  const strokeDashoffset = circumference * (1 - seconds / (selectedMinutes * 60));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { initializeDatabase } = TaskController();
  const [isToggling, setIsToggling] = useState(false);
  const { toggleTaskCompletion } = TaskController();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTaskTypeModal, setShowTaskTypeModal] = useState(false);
  const [showPriorityTypeModal, setShowPriorityTypeModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [ taskType, setTaskType] = useState('today');
  const [ priorityType, setPriorityType] = useState(1);
  const [ project, setProject] = useState('Tasks');
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setUTCDate(dayAfterTomorrow.getDate() + 2);
  const defaultSelectedDate = dayAfterTomorrow.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
  const [showCalendar, setShowCalendar] = useState(false);

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
      taskType: taskType,
      taskDate: selectedDate ? selectedDate : new Date().toISOString(),
      priorityType: priorityType,
      project: project,
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

  const setSelectedTaskType = () => {
    if(taskType == 'today'){
      setSelectedDate(getTodayDate);
    }else if(taskType == 'tomorrow'){
      setSelectedDate(getTomorrowDate);
    }else{
      return
    }
  }

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleProjectSelect = () => {

  }

  return (
    <ImageBackground
      source={require('@/assets/images/bg.jpg')}
      className="flex-1 justify-center items-center"
      resizeMode="cover">
      <SafeAreaView className="flex-1 justify-center items-center">

        {/* Modal Overlay ------------------------------------------------------------------- */}
        {(showAddTaskView || showTaskView || showConfirmModal || showTaskTypeModal) && (
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
              setShowTaskTypeModal(false);
              setShowPriorityTypeModal(false);
              setShowProjectModal(false);
            }}
          ></TouchableOpacity>
              <View className='absolute bottom-0 w-full'>
                  <TouchableWithoutFeedback onPress={() => Keyboard.isVisible()}>
                      <View className="bg-slate-600 rounded-t-3xl w-full">
                          <View className='w-full flex justify-center mt-2 p-4'>
                            <TextInput
                              ref={inputRef}
                              className="rounded-lg px-4 py-2 text-2xl text-white"
                              placeholder="Add new task..."
                              placeholderTextColor="#94a3b8"
                              autoFocus={true}
                              value={taskName}
                              onChangeText={setTaskName}
                              onFocus={() => {
                                setShowTaskTypeModal(false);
                                setShowPriorityTypeModal(false);
                                setShowProjectModal(false);
                              }}
                            />
                          </View>
                        
                          <View className='w-full flex justify-center border-t border-slate-500 pt-2'>
                            <Text className='text-center text-gray-300 mb-2'>Number of Pomodoros</Text>
                          </View>

                          {/* Loop of number 1 to 60 here */}
                          <HorizontalScrollLoopPicker onSelect={handleSetNumberOfPomodoro} />

                          <View className='w-full flex-row justify-between items-center mt-2'>
                            <View className='w-1/2 flex-row justify-start items-center'>

                              <TouchableOpacity 
                                activeOpacity={1} 
                                onPress={() => {
                                  setShowTaskTypeModal(true);
                                  setShowPriorityTypeModal(false);
                                  setShowProjectModal(false);
                                  Keyboard.dismiss()
                                }} 
                                className={`px-4 py-2 flex-row justify-center items-center ${showTaskTypeModal ? 'bg-slate-700 rounded-t-lg' : ''}`}>
                                    <Image 
                                      source={
                                        taskType === 'today' 
                                          ? require('@/assets/images/today.png')
                                          : taskType === 'tomorrow' 
                                            ? require('@/assets/images/tomorrow.png')
                                            : require('@/assets/images/planned.png')
                                      }
                                      className='' 
                                      style={{ height: 22, width: 22 }}
                                    />
                              </TouchableOpacity>

                              <TouchableOpacity 
                                activeOpacity={1} 
                                onPress={() => {
                                  setShowTaskTypeModal(false);
                                  setShowPriorityTypeModal(true);
                                  setShowProjectModal(false);
                                  Keyboard.dismiss()
                                }} 
                                className={`px-4 py-2 flex-row justify-center items-center ${showPriorityTypeModal ? 'bg-slate-700 rounded-t-lg' : ''}`}>
                                <Ionicons className='' name="flag" size={21} 
                                      color={
                                        priorityType === 1 ? 'white' : 
                                        priorityType === 2 ? 'lightgreen' : 
                                        priorityType === 3 ? 'orange' :
                                        'red'} />
                              </TouchableOpacity>

                              <TouchableOpacity 
                                activeOpacity={1} 
                                onPress={() => {
                                  setShowTaskTypeModal(false);
                                  setShowPriorityTypeModal(false);
                                  setShowProjectModal(true);
                                  Keyboard.dismiss()
                                }} 
                                className={`px-4 py-2 flex-row justify-center items-center gap-2 ${showProjectModal ? 'bg-slate-700 rounded-t-lg' : ''}`}>
                                    <Image 
                                      source={require('@/assets/images/task_proj.png')}
                                      style={{ height: 22, width: 22 }}
                                    />
                                    <Text className='text-gray-100 text-lg'>{project}</Text>
                              </TouchableOpacity>

                            </View>

                            <View className='w-1/2 flex-row justify-end items-center'>
                              <TouchableOpacity 
                                activeOpacity={1} 
                                onPress={handleCreateTask}>
                                <Text className='text-2xl text-right text-gray-200 mr-4'>Done</Text>
                              </TouchableOpacity>
                            </View>
                            
                          </View>
                      </View>
                  </TouchableWithoutFeedback>

                  {/* Task Type Modal ----------------------------------------------------------- */}
                  <View className={`flex-1 w-full justify-center items-center transition-all ${showTaskTypeModal ? '' : 'hidden'}`}>
                      <View className="p-6 w-full items-center bg-slate-700">
                        <View className='w-full absolute top-0 flex-row justify-end'>
                            <TouchableOpacity
                                  onPress={() => {
                                    setSelectedTaskType;
                                    setShowCalendar(false);
                                    setShowTaskTypeModal(false);
                                    Keyboard.isVisible();
                                    }} className="py-3">
                                  <Text className="text-gray-300 text-lg font-medium">Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xl font-semibold text-white mb-4">
                          {taskType === 'today' ? 'Today' : 
                          taskType === 'tomorrow' ? 'Tomorrow' : 'Planned'}
                        </Text>
                        

                        <View className='flex-row justify-center gap-4 w-full'>
                          <View className='flex justify-center items-center p-2 rounded-full bg-gray-50/10'>
                            <TouchableOpacity onPress={() => {setTaskType('today');}}>
                                <Image 
                                  source={taskType === 'today' 
                                    ? require('@/assets/images/today.png')
                                    : require('@/assets/images/today-unselected.png')} 
                                  style={{ height: 28, width: 28 }}
                                />
                            </TouchableOpacity>
                          </View>
                          <View className='flex justify-center items-center p-2 rounded-full bg-gray-50/10'>
                            <TouchableOpacity onPress={() => {setTaskType('tomorrow');}}>
                                <Image 
                                  source={taskType === 'tomorrow'
                                    ? require('@/assets/images/tomorrow.png')
                                    : require('@/assets/images/tomorrow-unselected.png')}
                                  style={{ height: 28, width: 28 }}
                                />
                            </TouchableOpacity>
                          </View>
                          <View className='flex justify-center items-center p-2 rounded-full bg-gray-50/10'>
                            <TouchableOpacity onPress={() => {
                                setTaskType('planned');
                                setShowCalendar(true);
                              }}>
                                <Image 
                                  source={taskType === 'planned'
                                    ? require('@/assets/images/planned.png')
                                    : require('@/assets/images/planned-unselected.png')}
                                  style={{ height: 28, width: 28 }}
                                />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {showCalendar && taskType === 'planned' && (
                          <View className="w-full mt-4">
                            <Calendar
                              minDate={defaultSelectedDate}
                              onDayPress={(day: any) => {
                                setSelectedDate(day.dateString);
                              }}
                              markedDates={{
                                [selectedDate]: {
                                  selected: true,
                                  selectedColor: '#1e293b'
                                }
                              }}
                              theme={{
                                backgroundColor: 'transparent',
                                calendarBackground: 'transparent',
                                textSectionTitleColor: '#94a3b8',
                                selectedDayBackgroundColor: '#64748b',
                                selectedDayTextColor: '#93DC5C',
                                todayTextColor: '#5c6e87',
                                dayTextColor: '#ffffff',
                                textDisabledColor: '#5c6e87',
                                dotColor: '#1e293b',
                                selectedDotColor: '#ffffff',
                                arrowColor: '#94a3b8',
                                monthTextColor: '#ffffff',
                                textDayFontFamily: 'System',
                                textMonthFontFamily: 'System',
                                textDayHeaderFontFamily: 'System',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 14
                              }}
                            />
                          </View>
                        )}

                      </View>
                  </View>

                  {/* Priority Type Modal ----------------------------------------------------------- */}
                  <View className={`flex-1 w-full justify-center items-center transition-all ${showPriorityTypeModal ? '' : 'hidden'}`}>
                      <View className="p-6 w-full items-center bg-slate-700">
                        <View className='w-full absolute top-0 flex-row justify-end'>
                            <TouchableOpacity
                                  onPress={() => {
                                    setShowPriorityTypeModal(false);
                                    Keyboard.isVisible();
                                    }} className="py-3">
                                  <Text className="text-gray-300 text-lg font-medium">Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xl font-semibold text-white mb-4">
                          {priorityType === 1 ? 'No Priority' : 
                          priorityType === 2 ? 'Low Priority' : 
                          priorityType === 3 ? 'Medium Priority' :
                          'High Priority'}
                        </Text>
                        

                        <View className='flex-row justify-center gap-6 w-full'>
                          <View className={`flex justify-center items-center p-2 rounded-full ${priorityType === 1 ? 'bg-gray-50/10' : ''}`}>
                            <TouchableOpacity onPress={() => {setPriorityType(1);}}>
                                <Ionicons name="flag" size={23} color={ 'white' } />
                            </TouchableOpacity>
                          </View>
                          <View className={`flex justify-center items-center p-2 rounded-full ${priorityType === 2 ? 'bg-gray-50/10' : ''}`}>
                            <TouchableOpacity onPress={() => {setPriorityType(2);}}>
                                <Ionicons name="flag" size={23} color={ 'lightgreen' } />
                            </TouchableOpacity>
                          </View>
                          <View className={`flex justify-center items-center p-2 rounded-full ${priorityType === 3 ? 'bg-gray-50/10' : ''}`}>
                            <TouchableOpacity onPress={() => {setPriorityType(3);}}>
                                <Ionicons name="flag" size={23} color={ 'orange' } />
                            </TouchableOpacity>
                          </View>
                          <View className={`flex justify-center items-center p-2 rounded-full ${priorityType === 4 ? 'bg-gray-50/10' : ''}`}>
                            <TouchableOpacity onPress={() => {setPriorityType(4);}}>
                                <Ionicons name="flag" size={23} color={ 'red' } />
                            </TouchableOpacity>
                          </View>
                        </View>

                      </View>
                  </View>

                  {/* Priority Type Modal ----------------------------------------------------------- */}
                  <View className={`flex-1 w-full justify-center items-center transition-all ${showProjectModal ? '' : 'hidden'}`}>
                      <View className="p-6 w-full items-center bg-slate-700">
                        <View className='w-full absolute top-0 flex-row justify-end'>
                            <TouchableOpacity
                                  onPress={() => {
                                    setShowProjectModal(false);
                                    Keyboard.isVisible();
                                    }} className="py-3">
                                  <Text className="text-gray-300 text-lg font-medium">Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xl font-semibold text-white mb-4">Select a Project</Text>
                        
                        {/* Project List ---------------------------------------------------- */}
                        <View className='flex-row justify-center w-full'>
                            <ProjectListView
                              onSelectProject={handleProjectSelect}
                            />
                        </View>

                      </View>
                  </View>
              </View>
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