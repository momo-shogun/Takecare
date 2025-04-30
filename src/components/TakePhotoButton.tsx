import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const TakePhotoButton = ({ onPress }: { onPress: () => void }) => {
    return (
        <View className='absolute bottom-5 self-center'>
            <TouchableOpacity className='bg-[#00000055] rounded-full w-24 h-24 flex items-center justify-center' onPress={onPress}>
                <View className='w-20 h-20 bg-white rounded-full'></View> 
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    
    outerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000055',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
});

export default TakePhotoButton;
