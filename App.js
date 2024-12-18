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
import UploadHomeWork from './components/teachersegment/Tservices/UploadHomeworkScreen';
import TeacherProfile from './components/teachersegment/Tservices/TeacherProfile';
import ParentConnect from './components/teachersegment/ParentConnect';
import SLinkedIn from './components/slinkedin/SLinkedIn';
import AddPost from './components/slinkedin/AddPost/AddPost';
import SearchUsers from './components/slinkedin/SearchUsers';
import Profile from './components/slinkedin/Profile';
import Notifications from './components/slinkedin/Notifications';
import Chat from './components/slinkedin/Chat/Chat';
import ChatScreen from './components/slinkedin/Chat/ChatScreen';


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
                <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
                    <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
                    <Stack.Screen name="Homework" component={HomeworkScreen} />
                    <Stack.Screen name="Notifications" component={NotificationsScreen} />
                    <Stack.Screen name="AcademicReport" component={AcademicReportScreen} />
                    <Stack.Screen name="StatisticalAnalysis" component={StatisticalAnalysisScreen} />
                    <Stack.Screen name="SLinkedIn" component={SLinkedIn} />
                    <Stack.Screen name="BotGenie" component={BotGenie} />
                    <Stack.Screen name="Planner" component={Planner} />
                    <Stack.Screen name="Learn" component={Learn} />
                    <Stack.Screen name="SendAssessment" component={SendAssessmentScreen} />
                    <Stack.Screen name="UploadHomework" component={UploadHomeWork} />
                    <Stack.Screen name="Notify" component={NotifyScreen} />
                    <Stack.Screen name="UpdateClassWork" component={UpdateClassWorkScreen} />
                    <Stack.Screen name="UploadMarks" component={UploadMarksScreen} />
                    <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} />
                    <Stack.Screen name="ReportCard" component={ReportCardScreen} />
                    <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
                    <Stack.Screen name="ParentConnect" component={ParentConnect} />
                    <Stack.Screen name="AddPost" component={AddPost} />
                    <Stack.Screen name="SearchUsers" component={SearchUsers} />  
                    <Stack.Screen name="Profile" component={Profile} /> 
                    <Stack.Screen name="NlNotifications" component={Notifications} />
                    <Stack.Screen name="Chat" component={Chat} />
                    <Stack.Screen name="ChatScreen" component={ChatScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </BaseUrlProvider>
    );
}
