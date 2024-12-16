import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import SFooterNavbar from './SFooterNavbar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Menu, MenuItem } from 'react-native-material-menu';
import LottieView from 'lottie-react-native';
import { UserDataContext, BaseUrlContext } from '../../BaseUrlContext'; // Import UserDataContext and BaseUrlContext
import ScreenWrapper from '../../ScreenWrapper'; // Import ScreenWrapper
import AniLoader from '../commons/jsonfiles/AniLoad.json'; // Import AniLoader component

export default function StudentDashboard({ navigation }) {
    const { userData, setUserData } = useContext(UserDataContext); // Access userData from UserDataContext
    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false); // State for managing loading

    const handleLogout = () => {
        Alert.alert('Logout', 'You have been logged out.');
        console.log('Logout Pressed');
        console.log(userData);
        navigation.navigate('Login'); // Redirect to the login screen
    };

    const hideMenu = () => setMenuVisible(false);
    const showMenu = () => setMenuVisible(true);

    const handleNavigateToSLinkedIn = async () => {
        if (!userData.UserName) { // Check if UserName does not exist
            const payload = {
                UserId: userData.user?.UserId ?? '',
                Name: userData.user?.Name ?? '',
                user_type: 'student', // Assuming user_type is 'student'
            };
    
            console.log('Payload:', payload); // Print the payload to the console
    
            setLoading(true); // Set loading to true
    
            try {
                const response = await fetch(`${baseUrl}/fetchuser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload), // Send the payload
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const data = await response.json();
                setUserData({ ...userData, ...data });
    
                navigation.navigate('SLinkedIn');
            } catch (error) {
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false); // Set loading to false
            }
        } else {
            navigation.navigate('SLinkedIn'); // Navigate directly if UserName exists
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {loading && (
                    <View style={styles.loaderContainer}>
                        <LottieView
                            source={AniLoader}
                            autoPlay
                            loop
                            style={styles.loader}
                        />
                    </View>
                )}
                <LottieView
                    source={require('../commons/jsonfiles/sbg.json')} // Adjust the path to your Lottie file
                    autoPlay
                    loop
                    style={styles.lottieBackground}
                />
                {/* Row 1 */}
                <View style={styles.row}>
                    <View style={styles.column11}>
                        <Menu
                            visible={menuVisible}
                            anchor={<Text style={styles.menuBar} onPress={showMenu}>☰</Text>}
                            onRequestClose={hideMenu}
                        >
                            <MenuItem onPress={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </View>
                    <View style={styles.column12}>
                        <Text style={styles.schoolName}>{userData.user?.SCHOOL_NAME ?? ''}</Text>
                    </View>
                </View>
                {/* Row 2 */}
                <View style={styles.row}>
                    <View style={styles.column21}>
                        <Image
                            source={userData.user?.Photo ? { uri: userData.user.Photo } : require('../../assets/images/studentm.png')}
                            style={styles.profilePic}
                        />
                        <Text style={styles.studentId}>{userData.user?.StudentId ?? ''}</Text>
                        <Text style={styles.studentName}>{userData.user?.Name ?? ''}</Text>
                    </View>
                    <View style={styles.column22}>
                        <View style={styles.card}>
                            <Text style={styles.heading}>STUDENT BIO</Text>
                            <View style={styles.separator} />
                            <Text style={styles.description}>{userData.user?.SCHOOL_NAME ?? ''}</Text>
                            <View style={styles.separator} />
                            <Text style={styles.description}>GRADE: {userData.user?.Grade ?? ''}</Text>
                            <View style={styles.separator} />
                            <Text style={styles.description}>SECTION: {userData.user?.SECTION ?? ''}</Text>
                            <View style={styles.separator} />
                            <Text style={styles.description}>MEDIUM: ENGLISH</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.newSection}>
                    <Text style={styles.sectionHeading}>SERVICES</Text>
                    <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('Homework')}>
                        <Text style={styles.buttonText}>TODAY'S HOMEWORK</Text>
                        <Icon name="arrow-forward" size={24} color="#E31C62" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('Notifications')}>
                        <Text style={styles.buttonText}>NOTIFICATIONS</Text>
                        <Icon name="arrow-forward" size={24} color="#E31C62" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('AcademicReport')}>
                        <Text style={styles.buttonText}>ACADEMIC REPORT</Text>
                        <Icon name="arrow-forward" size={24} color="#E31C62" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('StatisticalAnalysis')}>
                        <Text style={styles.buttonText}>STATISTICAL ANALYSIS</Text>
                        <Icon name="arrow-forward" size={24} color="#E31C62" />
                    </TouchableOpacity>
                </View>
                <SFooterNavbar navigation={navigation} handleNavigateToSLinkedIn={handleNavigateToSLinkedIn} />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E0F2FEFF',
        flex: 1,
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    column11: {
        width: Dimensions.get('window').width * 0.05,
        alignItems: 'center',
    },
    column12: {
        width: Dimensions.get('window').width * 0.95,
        marginTop: 3,
        alignItems: 'center',
    },
    column21: {
        width: Dimensions.get('window').width * 0.25,
        alignItems: 'center',
    },
    column22: {
        width: Dimensions.get('window').width * 0.65,
        alignItems: 'center',
    },
    menuBar: {
        fontSize: 20,
    },
    schoolName: {
        fontSize: 15,
        color: '#E31C62',
        flex: 1,
        alignItems: 'center',
        fontFamily: 'Source Code Pro',
    },
    profilePic: {
        width: 100,
        height: 120,
        borderRadius: 5,
        borderColor: '#3C70D893',
        borderWidth: 2,
        marginBottom: 10,
    },
    studentId: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    studentName: {
        fontSize: 13,
    },
    heading: {
        fontSize: 16,
        color:'#3C70D8F1',
        fontWeight: 'semibold',
    },
    card: {
        backgroundColor: 'transparent',
        padding: 5,
        paddingLeft:10,
        borderRadius: 5,
        shadowColor: '#3C70D8B6',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
        elevation: 2,
        width: '90%',
    },
    description: {
        fontSize: 12,
        marginBottom: 2,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginVertical: 5,
    },
    newSection: {
        marginTop: 20,
        padding: 10,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        color: '#E31C62',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
    },
    lottieBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.25,
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        zIndex: 1, // Ensure the loader is on top
    },
    loader: {
        width: 100,
        height: 100,
    },
});