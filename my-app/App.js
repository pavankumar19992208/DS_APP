import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import Login from './components/login/Login';
import TeacherDashboard from './components/teachersegment/TeacherDashboard';
import { useFonts } from 'expo-font';
import StudentDashboard from './components/StudentSegment/StudentDashboard';
import StatisticalAnalysisScreen from './components/StudentSegment/StServices/StatisticalAnalysisScreen';
import AcademicReportScreen from './components/StudentSegment/StServices/AcademicReportScreen';
import NotificationsScreen from './components/StudentSegment/StServices/NotificationsScreen';
import HomeworkScreen from './components/StudentSegment/StServices/HomeworkScreen';
import Assessments from './components/StudentSegment/StServices/Assessments';
import BotGenie from './components/StudentSegment/StServices/BotGenie';
import Planner from './components/StudentSegment/StServices/Planner';
import Learn from './components/StudentSegment/StServices/Learn';

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
                <Stack.Screen name="Homework" component={HomeworkScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="AcademicReport" component={AcademicReportScreen} />
                <Stack.Screen name="StatisticalAnalysis" component={StatisticalAnalysisScreen} />
                <Stack.Screen name="Assessments" component={Assessments} />
                <Stack.Screen name="BotGenie" component={BotGenie} />
                <Stack.Screen name="Planner" component={Planner} />
                <Stack.Screen name="Learn" component={Learn} />
            </Stack.Navigator>

        </NavigationContainer>
    );
}






