import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

export default function  CustomTabBar () {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View className='flex-row bg-transparent absolute bottom-0 w-full justify-between items-center' style={{ height: 100, paddingHorizontal: 50 }}>

        <Link href={'/menu'}>
            <Image source={require('@/assets/images/user.png')} style={{ height: 30, width: 30 }}/>
        </Link>

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