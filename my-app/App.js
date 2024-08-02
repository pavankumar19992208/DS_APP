import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import Login from './components/login/Login';
import TeacherDashboard from './components/teachersegment/TeacherDashboard';
import { useFonts } from 'expo-font';
import StudentDashboard from './components/StudentSegment/StudentDashboard';
const Stack = createStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    'Source Code Pro': require('./assets/fonts/SourceCodePro-SemiBold.ttf'),
});

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
                <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}






