import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './Welcome';
import Login from './components/login/Login';
import TeacherDashboard from './components/teachersegment/TeacherDashboard';
import StudentDashboard from './components/StudentSegment/StudentDashboard';
import StatisticalAnalysisScreen from './components/StudentSegment/StServices/StatisticalAnalysisScreen';
import AcademicReportScreen from './components/StudentSegment/StServices/AcademicReportScreen';
import NotificationsScreen from './components/StudentSegment/StServices/NotificationsScreen';
import HomeworkScreen from './components/StudentSegment/StServices/HomeworkScreen';
import Assessments from './components/StudentSegment/StServices/Assessments';
import BotGenie from './components/StudentSegment/StServices/BotGenie';
import Planner from './components/StudentSegment/StServices/Planner';
import Learn from './components/StudentSegment/StServices/Learn';
import SendAssessmentScreen from './components/teachersegment/Tservices/SendAssessmentScreen';
import UploadHomeworkScreen from './components/teachersegment/Tservices/UploadHomeworkScreen';
import NotifyScreen from './components/teachersegment/Tservices/NotifyScreen';
import UpdateClassWorkScreen from './components/teachersegment/Tservices/UpdateClassWorkScreen';
import UploadMarksScreen from './components/teachersegment/Tservices/UploadMarksScreen';
import MarkAttendanceScreen from './components/teachersegment/Tservices/MarkAttendanceScreen';
import ReportCardScreen from './components/teachersegment/Tservices/ReportCardScreen';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { BaseUrlProvider } from './BaseUrlContext'; // Import the BaseUrlProvider

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    let [fontsLoaded] = useFonts({
        'Source Code Pro': require('./assets/fonts/SourceCodePro-SemiBold.ttf'),
        'RubikDoodleShadow': require('./assets/fonts/RubikDoodleShadow-Regular.ttf')
    });

    if (!fontsLoaded) {
        return null; // Render nothing until fonts are loaded
    }

    return (
        <BaseUrlProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
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
                    <Stack.Screen name="SendAssessment" component={SendAssessmentScreen} />
                    <Stack.Screen name="UploadHomework" component={UploadHomeworkScreen} />
                    <Stack.Screen name="Notify" component={NotifyScreen} />
                    <Stack.Screen name="UpdateClassWork" component={UpdateClassWorkScreen} />
                    <Stack.Screen name="UploadMarks" component={UploadMarksScreen} />
                    <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} />
                    <Stack.Screen name="ReportCard" component={ReportCardScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </BaseUrlProvider>
    );
}