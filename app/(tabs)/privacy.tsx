import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

const Privacy = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-slate-600">
      <View className='w-full h-full'>
        <View className='p-4 mt-4 flex-row items-center justify-between'>
            <View className='flex flex-row items-center justify-between gap-4'>
                <TouchableOpacity 
                    onPress={() => {
                        router.push('/menu');
                    }}>
                    <Image source={require('@/assets/images/back.png')} style={{ height: 25, width: 25 }}/>
                </TouchableOpacity>
              </View>
          </View>
      </View>
  </SafeAreaView>
  )
}

export default Privacy