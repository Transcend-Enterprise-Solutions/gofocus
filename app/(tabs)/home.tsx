import React, { useState, useEffect } from 'react';
import { SafeAreaView, ImageBackground, Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const radius = width * 0.35;
const circumference = 2 * Math.PI * radius;

export default function HomeScreen() {
  const [seconds, setSeconds] = useState(1500); // 1500 seconds = 25 minutes
  const totalSeconds = 1500; // Total time for the countdown

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const strokeDashoffset = circumference * (1 - seconds / totalSeconds);

  const handleAddTask = () => {
    console.log('Add Task button pressed');
    // You can open a modal or navigate to another screen here
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 justify-center items-center">

        <TouchableOpacity
            onPress={handleAddTask}
            className="absolute top-12 right-5 bg-black/60 p-4 rounded-full drop-shadow-lg"
          >
          <Ionicons name="add" size={22} color="white" />
        </TouchableOpacity>

        <View style={styles.circleContainer}>
          <Svg height={radius * 2 + 20} width={radius * 2 + 20} style={{ overflow: 'visible' }} className='absolute'>
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

          <Text className="text-white text-5xl font-bold">{formatTime(seconds)}</Text>
        </View>

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
});
