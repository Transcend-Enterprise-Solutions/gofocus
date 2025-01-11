import React from 'react';
import { SafeAreaView, ImageBackground, View, Text, StyleSheet } from 'react-native';

const Profile = () => {
    return (
        <ImageBackground
              source={require('../../assets/images/bg.jpg')}
              className="flex-1 justify-center items-center"
              resizeMode="cover"
            >
              <SafeAreaView className="flex-1 justify-center items-center">

                <View style={styles.container}>
                    <Text style={styles.text}>Profile Screen</Text>
                </View>
            
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Profile;