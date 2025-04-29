import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScanScreen from '../screens/ScanScreen';
import ResultScreen from '../screens/ResultScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator initialRouteName='Scan'>
            <Tab.Screen name="Scan" component={ScanScreen} />
            <Tab.Screen name="Results" component={ResultScreen} />
        </Tab.Navigator>
    );
}
