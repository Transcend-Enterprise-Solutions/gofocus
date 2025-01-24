import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function  CustomTabBar () {
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <View className='flex-row bg-transparent absolute bottom-0 w-full justify-between items-center' style={{ height: 100, paddingHorizontal: 50 }}>

        <TouchableOpacity 
            onPress={() => {
                router.push('/profile');
            }}
        >
            <Image source={require('@/assets/images/user.png')} style={{ height: 30, width: 30 }}/>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={() => {
            setModalVisible(true);
            }}
        >
            <Image source={require('@/assets/images/timer.png')} style={{ height: 30, width: 30 }}/>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={() => {
            setModalVisible(true);
            }}
        >
            <Image source={require('@/assets/images/fullscreen.png')} style={{ height: 30, width: 30 }}/>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={() => {
            setModalVisible(true);
            }}
        >
            <Image source={require('@/assets/images/music.png')} style={{ height: 32, width: 32 }}/>
        </TouchableOpacity>
       
    </View>
  );
}