import React from 'react';
import { SafeAreaView, TouchableOpacity, Image, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

export default function Menu () {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-slate-600">
            <View className='w-full h-full'>
                <View className='p-4 mt-4 flex-row items-center justify-between'>
                    <View className='flex flex-row items-center justify-between gap-4'>
                        <TouchableOpacity 
                            onPress={() => {
                                router.push('/');
                            }}>
                            <Image source={require('@/assets/images/back.png')} style={{ height: 25, width: 25 }}/>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                        onPress={() => {
                            router.push('/(tabs)/profile');
                        }}>
                            <Image source={require('@/assets/images/blank_profile_pic.png')} className='rounded-full border border-white' style={{ height: 50, width: 50 }}/>
                        </TouchableOpacity>
                    </View>

                    <View className='flex flex-row items-center justify-between gap-6 mr-2'>
                        <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/premium');
                            }}>
                            <Image source={require('@/assets/images/premium.png')} style={{ height: 28, width: 28 }}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={() => {
                            router.push('/(tabs)/groups');
                        }}>
                            <Image source={require('@/assets/images/group.png')} style={{ height: 28, width: 28 }}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={() => {
                            router.push('/(tabs)/leaderboard');
                        }}>
                            <Image source={require('@/assets/images/trophy.png')} style={{ height: 25, width: 25 }}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={() => {
                            router.push('/(tabs)/analytics');
                        }}>
                            <Image source={require('@/assets/images/graph.png')} style={{ height: 25, width: 25 }}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='p-6'>
                    <Text className='text-slate-300 mb-8'>Tasks</Text>

                    <View className='mb-4 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/today');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/today.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>Today</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className='mb-4 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/tomorrow');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/tomorrow.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>Tomorrow</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                
                    <View className='mb-4 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/planned');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/planned.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>Planned</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                
                    <View className='mb-4 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/completed');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/completed.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>Completed</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                
                    <View className='mb-6 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/projects');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/projects.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>Projects</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text className='text-slate-300 mb-8'>Preferences</Text>

                    <View className='mb-4 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/appearance');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/appearance.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>Appearance</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                
                    <View className='mb-4 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/notifs_sounds');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/notif.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>Notifications and Sound</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                
                    <View className='mb-4 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/privacy');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/privacy.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>Privacy and Safety</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                
                    <View className='mb-4 pb-2'>
                          <TouchableOpacity 
                            onPress={() => {
                                router.push('/(tabs)/updates');
                            }}>
                            <View className="flex flex-row items-center justify-left gap-4">
                                <Image source={require('@/assets/images/updates.png')} style={{ height: 28, width: 28 }}/>
                                <Text className='text-lg text-white'>App Updates</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>


                <View className='flex flex-col items-center justify-center absolute bottom-10 w-full'>
                    <Text className='text-gray-100 mb-4'>Synchronize across all devices</Text>
                    <TouchableOpacity 
                        onPress={() => {
                            router.push('/(auth)/sign_in');
                        }}
                        className='bg-green-200 rounded-full py-4 px-12'>
                        <Text className='text-xl text-black'>Sign In | Sign Up</Text>
                    </TouchableOpacity>                
                </View>
            </View>
        </SafeAreaView>
    );
};