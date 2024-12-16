import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FooterNavbar from './FooterNavbar'; // Adjust the path as necessary
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import GenerateRollNumbersScreen from './Tservices/GenerateRollNumbersScreen';
import LottieView from 'lottie-react-native'; // Import LottieView
import ScreenWrapper from '../../ScreenWrapper';
import Timetable from './Tservices/Timetable';
import { UserDataContext } from '../../BaseUrlContext'; // Import UserDataContext

const screenWidth = Dimensions.get('window').width;

export default function TeacherDashboard({ navigation }) {
    const { userData } = useContext(UserDataContext); // Use the userData from UserDataContext
    console.log("User Data:", userData); // Log the user data

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = () => {
        Alert.alert('Logout', 'You have been logged out.');
        console.log('Logout Pressed');
        navigation.navigate('Login'); // Redirect to the login screen
    };

    const onProfilePress = () => {
        navigation.navigate('TeacherProfile', { userData });
        hideMenu();
    };

    const handleParentConnect = () => {
        navigation.navigate('ParentConnect', { data: userData }); // Navigate to the Teacher Connect screen
    };

    const hideMenu = () => setMenuVisible(false);
    const showMenu = () => setMenuVisible(true);
    const toggleExpanded = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <LottieView
                    source={require('../commons/jsonfiles/bg2.json')} // Adjust the path to your Lottie file
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
                            style={styles.menu} // Apply the menu style
                        >
                            <MenuItem onPress={() => setModalVisible(true)}>
                                <Text>Generate Roll Numbers</Text>
                            </MenuItem>
                            <MenuItem onPress={() => navigation.navigate('ReportCard', { tedata: userData })}>
                                <Text>Report Cards</Text>
                            </MenuItem>
                            <MenuItem onPress={handleParentConnect}>
                                <Text>Parent Connect</Text>
                            </MenuItem>
                            <MenuItem onPress={onProfilePress}>
                                <Text>Profile</Text>
                            </MenuItem>
                            <MenuItem onPress={handleLogout}>
                                <Text style={{ color: 'red' }}>Logout</Text>
                            </MenuItem>
                        </Menu>
                    </View>
                    <View style={styles.column12}>
                        <Text style={styles.schoolName}>{userData.user.SCHOOL_NAME}</Text>
                    </View>
                </View>
                {/* Row 2 */}
                <View style={styles.row}>
                    <View style={styles.column21}>
                        <Image
                            source={userData.user.profilepic ? { uri: userData.user.profilepic } : require('../../assets/images/teacherf.png')}
                            style={styles.profilePic}
                        />
                        <Text style={styles.teacherId}>{userData.user.userid}</Text>
                        <Text style={styles.teacherName}>{userData.user.fullName}</Text>
                    </View>
                    <View style={[styles.column22, { marginBottom: 30 }]}>
                        <TouchableOpacity onPress={toggleExpanded}>
                            <View style={styles.accordionHeader}>
                                <Text style={styles.accordionHeaderText}>SUBJECTS ALLOCATED</Text>
                                <Icon name={isCollapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={24} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                        {!isCollapsed && (
                            <View style={styles.subjectsContainer}>
                                {Object.entries(userData.user.subjectSpecialization).map(([className, subjects], index) => (
                                    <View key={index} style={styles.classContainer}>
                                        <Text style={styles.className}>{className}</Text>
                                        {subjects.map((subject, subIndex) => (
                                            <Text key={subIndex} style={styles.subject}>{subject}</Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={() => navigation.navigate('MarkAttendance', { data: userData })}>
                                <Image source={require('../../assets/images/attendance.png')} style={[styles.icon, { marginLeft: 20, width: 40, height: 40 }]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('UploadHomework')}>
                                <Image source={require('../../assets/images/home_work.png')} style={[styles.icon, { marginRight: 20, width: 40, height: 40 }]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionHeading}>Today's Schedule</Text>
                    <Timetable />
                    {modalVisible && (
                        <GenerateRollNumbersScreen visible={modalVisible} onClose={() => setModalVisible(false)} data={userData} />
                    )}
                </ScrollView>
                <FooterNavbar navigation={navigation} data={userData} />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E0F2FE',
        flex: 1,
        padding: 20,
    },
    lottieBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    column21: {
        width: screenWidth * 0.25,
        alignItems: 'center',
    },
    column22: {
        width: screenWidth * 0.65,
        marginTop: 3,
        alignItems: 'center',
    },
    column11: {
        width: screenWidth * 0.05,
        alignItems: 'center',
    },
    column12: {
        width: screenWidth * 0.95,
        marginTop: 3,
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
        borderColor: 'pink',
        borderWidth: 2,
        marginBottom: 10,
    },
    teacherId: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    teacherName: {
        fontSize: 13,
    },
    classContainer: {
        marginBottom: 10,
    },
    className: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subject: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
    },
    accordionHeader: {
        backgroundColor: '#3C70D8B6',
        paddingTop: 5,
        paddingRight: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: screenWidth * 0.47,
        height: 32,
        marginBottom: 5,
    },
    accordionHeaderText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'semibold',
    },
    subjectsContainer: {
        position: 'absolute',
        top: 30, // Adjust this value as needed
        backgroundColor: '#3C70D8D0',
        padding: 5,
        borderRadius: 5,
        width: '70%',
        zIndex: 1, // Ensure it appears above other components
    },
    newSection: {
        marginTop: 10,
        padding: 10,
        marginBottom: 40,
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
        marginTop: 10,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: '#ccc',
        borderTopColor: '#ccc',
        width: screenWidth * 0.47, // Match the width of the accordionHeader
    },
    buttonText: {
        fontSize: 16,
    },
    icon: {
        width: 30,
        height: 30,
    },
    menu: {
        marginTop: 12,
        backgroundColor: '#E0F2FE', // Apply the background color to the menu
    },
});