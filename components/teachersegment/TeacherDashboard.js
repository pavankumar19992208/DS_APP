import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FooterNavbar from './FooterNavbar'; // Adjust the path as necessary
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import GenerateRollNumbersScreen from './Tservices/GenerateRollNumbersScreen';
import LottieView from 'lottie-react-native'; // Import LottieView

const screenWidth = Dimensions.get('window').width;

export default function TeacherDashboard({ route, navigation }) {
    const { data } = route.params;
    const tedata = data;
    console.log("te", tedata);
    console.log("dd", data);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = () => {
        Alert.alert('Logout', 'You have been logged out.');
        console.log('Logout Pressed');
        console.log(data);
        navigation.navigate('Login'); // Redirect to the login screen
    };

    const hideMenu = () => setMenuVisible(false);
    const showMenu = () => setMenuVisible(true);
    const toggleExpanded = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
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
                    >
                        <MenuItem onPress={handleLogout}>Logout</MenuItem>
                    </Menu>
                </View>
                <View style={styles.column12}>
                    <Text style={styles.schoolName}>{data.teacher.SCHOOL_NAME}</Text>
                </View>
            </View>
            {/* Row 2 */}
            <View style={styles.row}>
                <View style={styles.column21}>
                    <Image source={{ uri: data.teacher.TEACHER_PIC }} style={styles.profilePic} />
                    <Text style={styles.teacherId}>{data.teacher.TEACHER_ID}</Text>
                    <Text style={styles.teacherName}>{data.teacher.TEACHER_NAME}</Text>
                </View>
                <View style={styles.column22}>
                    <TouchableOpacity onPress={toggleExpanded}>
                        <View style={styles.accordionHeader}>
                            <Text style={styles.accordionHeaderText}>SUBJECTS TAUGHT</Text>
                            <Icon name={isCollapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={24} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                    {!isCollapsed && (
                        <View style={styles.subjectsContainer}>
                            <FlatList
                                data={data.teacher.subjects}
                                renderItem={({ item }) => <Text style={styles.subject}>{item}</Text>}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    )}
                    <TouchableOpacity onPress={() => console.log('Time Table Pressed')}>
                        <View style={styles.accordionHeader}>
                            <Text style={styles.accordionHeaderText}>TIME TABLE</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {/* New Section */}
            <View style={styles.newSection}>
                <Text style={styles.sectionHeading}>SERVICES</Text>
                <TouchableOpacity style={styles.buttonRow} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Generate Roll Numbers</Text>
                    <Icon name="arrow-forward" size={24} color="#E31C62" />
                </TouchableOpacity>
                {modalVisible && (
                    <GenerateRollNumbersScreen visible={modalVisible} onClose={() => setModalVisible(false)} data={data} />
                )}
                <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('UploadMarks', { data })}>
                    <Text style={styles.buttonText}>Upload Marks</Text>
                    <Icon name="arrow-forward" size={24} color="#E31C62" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('MarkAttendance')}>
                    <Text style={styles.buttonText}>Mark Attendance</Text>
                    <Icon name="arrow-forward" size={24} color="#E31C62" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.buttonRow} 
                    onPress={() => {
                        console.log('Navigating to ReportCard with tedata:', tedata); // Debugging log
                        navigation.navigate('ReportCard', { tedata });
                    }}
                >
                    <Text style={styles.buttonText}>REPORT CARDS</Text>
                    <Icon name="arrow-forward" size={24} color="#E31C62" />
                </TouchableOpacity>
            </View>
            <FooterNavbar navigation={navigation} />
        </View>
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
        opacity: 0.5,
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
});