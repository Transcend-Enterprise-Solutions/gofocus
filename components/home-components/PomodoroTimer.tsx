import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Modal, Text, TouchableOpacity, Animated } from 'react-native';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

interface PomodoroTimerProps {
  numberOfPomodoros: number;
  onComplete?: () => void;
  currentSeconds: number;
  onPhaseChange: (duration: number) => void;
}

type TimerPhase = 'work' | 'break';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  numberOfPomodoros,
  onComplete,
  currentSeconds,
  onPhaseChange
}) => {
  const [currentPomodoro, setCurrentPomodoro] = React.useState(1);
  const [phase, setPhase] = React.useState<TimerPhase>('work');
  const [showBreakModal, setShowBreakModal] = React.useState(false);
  const [showCompleteModal, setShowCompleteModal] = React.useState(false);
  const [showNextPomodoroModal, setShowNextPomodoroModal] = React.useState(false);
  const [overlayOpacity] = useState(new Animated.Value(0));

  const startNewPhase = (newPhase: TimerPhase, autoStart: boolean = true) => {
    const duration = newPhase === 'work' ? 1 * 60 : 2 * 60;
    // const duration = newPhase === 'work' ? 25 * 60 : 5 * 60;
    setPhase(newPhase);
    onPhaseChange(duration);
    if (!autoStart) {
      // This will set the time but not start the countdown
      setPhase(newPhase);
      onPhaseChange(duration);
    }
  };

  useEffect(() => {
    if (currentSeconds === 0) {
      if (phase === 'work') {
        if (currentPomodoro < numberOfPomodoros) {
          setShowBreakModal(true);
        } else {
          setShowCompleteModal(true);
        }
      } else {
        setShowNextPomodoroModal(true);
      }
    }
  }, [currentSeconds]);

  useEffect(() => {
    if (showBreakModal || showNextPomodoroModal || showCompleteModal) {
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
  }, [showBreakModal]);

  return (
    <>
      <View className="flex-row justify-evenly items-center w-full px-6">
        {[...Array(numberOfPomodoros)].map((_, index) => (
          <View key={index} className="mx-1">
            <Image 
              source={require('@/assets/images/food.png')} 
              style={[
                styles.pomodoroImg,
                { opacity: index < currentPomodoro ? 1 : 0.3 }
              ]}
            />
          </View>
        ))}
      </View>

      {(showBreakModal || showNextPomodoroModal || showCompleteModal) && (
        <Animated.View 
          className='w-full h-full bg-black absolute'
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Break Modal */}
      <Modal
        visible={showBreakModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center px-6 items-center">
          <View className="rounded-2xl p-6 w-full items-center" style={ styles.alert }>
            <Text className="text-2xl font-semibold text-white mb-4">
              Pomodoro Complete
            </Text>
            <Text className="text-lg text-gray-200 mb-6 text-center">
              ( {currentPomodoro} of {numberOfPomodoros} ){'\n'}
              Take a 5-minute break?
            </Text>
            <View className="w-full mt-10 flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => {
                  setShowBreakModal(false);
                  setCurrentPomodoro(prev => prev + 1);
                  startNewPhase('work');
                }}
                className="bg-slate-200 px-6 py-3 rounded-full"
              >
                <Text className="text-gray-300 text-lg font-medium">Skip Break</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowBreakModal(false);
                  startNewPhase('break');
                }}
                className="bg-slate-800 px-6 py-4 rounded-full"
              >
                <Text className="text-white text-lg font-medium">Take Break</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Complete Modal */}
      <Modal
        visible={showCompleteModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center px-6 items-center">
          <View className="rounded-2xl p-6 w-full items-center" style={ styles.alert }>
            <Text className="text-2xl font-semibold text-white mb-4">
              All Pomodoros Complete!
            </Text>
            <Text className="text-lg text-slate-600 mb-6 text-center">
              Congratulations! You've completed all your pomodoros.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowCompleteModal(false);
                onComplete?.();
              }}
              className="bg-slate-800 px-6 py-4 rounded-full"
            >
              <Text className="text-white text-lg font-medium">Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Next Pomodoro Modal */}
      <Modal
        visible={showNextPomodoroModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center px-6 items-center">
          <View className="bg-white rounded-2xl p-6 w-full items-center" style={ styles.alert }>
            <Text className="text-2xl font-semibold text-white mb-4">
              Break Complete
            </Text>
            <Text className="text-lg text-gray-200 mb-6 text-center">
              Ready to start Pomodoro {currentPomodoro + 1} of {numberOfPomodoros}?
            </Text>
            <View className="w-full mt-10 flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => {
                  setShowNextPomodoroModal(false);
                  setCurrentPomodoro(prev => prev + 1);
                  startNewPhase('work', false); // Don't auto-start
                }}
                className="bg-slate-200 px-6 py-3 rounded-full"
              >
                <Text className="text-gray-300 text-lg font-medium">Later</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowNextPomodoroModal(false);
                  setCurrentPomodoro(prev => prev + 1);
                  startNewPhase('work');
                }}
                className="bg-slate-800 px-6 py-4 rounded-full"
              >
                <Text className="text-white text-lg font-medium">Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pomodoroImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  alert: {
    backgroundColor: '#47576b',
    padding: 20,
    borderRadius: 15
  },
});