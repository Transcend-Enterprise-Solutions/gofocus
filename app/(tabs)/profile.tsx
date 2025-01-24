import React from 'react';
import { SafeAreaView, TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile () {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-slate-600">
            <View className='w-full h-full'>
                <View className='p-4 mt-4 flex-row items-center justify-between'>
                    <View className='flex flex-row items-center justify-between gap-4'>
                        <TouchableOpacity 
                            onPress={() => {
                                router.push('/');
                            }}
                        >
                            <Image source={require('@/assets/images/back.png')} style={{ height: 25, width: 25 }}/>
                        </TouchableOpacity>
                        <Image source={require('@/assets/images/blank_profile_pic.png')} className='rounded-full border border-white' style={{ height: 50, width: 50 }}/>
                    </View>
                    <View className='flex flex-row items-center justify-between gap-6 mr-2'>
                        <Image source={require('@/assets/images/premium.png')} style={{ height: 28, width: 28 }}/>
                        <Image source={require('@/assets/images/group.png')} style={{ height: 28, width: 28 }}/>
                        <Image source={require('@/assets/images/trophy.png')} style={{ height: 25, width: 25 }}/>
                        <Image source={require('@/assets/images/graph.png')} style={{ height: 25, width: 25 }}/>
                    </View>
                </View>

                <View className='p-6'>
                    <View className='flex flex-row items-center justify-left gap-4 mb-6 border-b border-slate-500 pb-2'>
                        <Image source={require('@/assets/images/today.png')} style={{ height: 28, width: 28 }}/>
                        <Text className='text-lg text-white'>Today</Text>
                    </View>
                    <View className='flex flex-row items-center justify-left gap-4 mb-6 border-b border-slate-500 pb-2'>
                        <Image source={require('@/assets/images/tomorrow.png')} style={{ height: 28, width: 28 }}/>
                        <Text className='text-lg text-white'>Tomorrow</Text>
                    </View>
                    <View className='flex flex-row items-center justify-left gap-4 mb-6 border-b border-slate-500 pb-2'>
                        <Image source={require('@/assets/images/planned.png')} style={{ height: 28, width: 28 }}/>
                        <Text className='text-lg text-white'>Planned</Text>
                    </View>
                    <View className='flex flex-row items-center justify-left gap-4 mb-6 border-b border-slate-500 pb-2'>
                        <Image source={require('@/assets/images/completed.png')} style={{ height: 28, width: 28 }}/>
                        <Text className='text-lg text-white'>Completed</Text>
                    </View>
                    <View className='flex flex-row items-center justify-left gap-4 mb-6 border-b border-slate-500 pb-2'>
                        <Image source={require('@/assets/images/projects.png')} style={{ height: 28, width: 28 }}/>
                        <Text className='text-lg text-white'>Projects</Text>
                    </View>
                </View>


                <View className='flex flex-col items-center justify-center absolute bottom-10 w-full'>
                    <Text className='text-gray-100 mb-4'>Synchronize across all devices</Text>
                    <TouchableOpacity className='bg-green-200 rounded-full py-4 px-12'>
                        <Text className='text-2xl text-black'>Sign In | Sign Up</Text>
                    </TouchableOpacity>                
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
 
});