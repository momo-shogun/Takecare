import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScanScreen from '../screens/ScanScreen';
import ResultScreen from '../screens/ResultScreen';

const Tab = createBottomTabNavigator<RootStackParamList>();

export type RootStackParamList = {
    Scan: undefined; 
    Result: { photoPath: string }; 
  };

export default function AppNavigator() {
    return (
        <Tab.Navigator initialRouteName='Scan'>
            <Tab.Screen name="Scan" component={ScanScreen} />
            <Tab.Screen name="Result" component={ResultScreen} initialParams={{ photoPath: '' }} />
        </Tab.Navigator>
    );
}
