<<<<<<< HEAD
import React, { useState, useContext,useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Dimensions,FlatList,Modal,Button,ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
=======
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Dimensions,ScrollView } from 'react-native';
>>>>>>> d1af1d228b9f6385c24b1c491145966f02b48d9f
import SFooterNavbar from './SFooterNavbar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Menu, MenuItem } from 'react-native-material-menu';
import LottieView from 'lottie-react-native';
import { UserDataContext, BaseUrlContext } from '../../BaseUrlContext'; // Import UserDataContext and BaseUrlContext
import ScreenWrapper from '../../ScreenWrapper'; // Import ScreenWrapper
import AniLoader from '../commons/jsonfiles/AniLoad.json'; // Import AniLoader component

<<<<<<< HEAD
const staticHomeworkData = [
    { H_id: 1, subject: 'Maths', title: 'Algebra Homework', description: 'Solve the algebra  ', attachments: [], updatedBy: 'Teacher A' },
    { H_id: 2, subject: 'Science', title: 'Physics Homework', description: 'Read twerth asdf bvcxz drtgfds ijkngtfd cdserfdas thst he chapter on motion', attachments: [], updatedBy: 'Teacher B' },
    { H_id: 3, subject: 'Social', title: 'History Homework', description: 'Write an essay on World War II', attachments: [], updatedBy: 'Teacher C' },
    { H_id: 4, subject: 'English', title: 'Literature Homework', description: 'Analyze the poem', attachments: [], updatedBy: 'Teacher D' },
];
const ClassworkRoute = ({ classwork }) => (
    <View style={styles.scene}>
        <FlatList
            data={classwork}
            keyExtractor={(item) => item.H_id.toString()}
            renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{item.HomeWork.title}</Text>
                    <Text style={styles.itemDescription}>{item.HomeWork.description}</Text>
                </View>
            )}
            ListEmptyComponent={<Text>No classwork available</Text>}
        />
    </View>
);

const HomeworkRoute = ({ homework }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHomework, setSelectedHomework] = useState(null);

    const handlePress = (item) => {
        setSelectedHomework(item);
        setModalVisible(true);
    };
    return (
        <View style={styles.scene}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.subjectButton} onPress={() => handlePress(staticHomeworkData[0])}>
                    <Text style={styles.buttonText}>Maths</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.subjectButton} onPress={() => handlePress(staticHomeworkData[1])}>
                    <Text style={styles.buttonText}>Science</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.subjectButton} onPress={() => handlePress(staticHomeworkData[2])}>
                    <Text style={styles.buttonText}>Social</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.subjectButton} onPress={() => handlePress(staticHomeworkData[3])}>
                    <Text style={styles.buttonText}>English</Text>
                </TouchableOpacity>
            </View>
            {selectedHomework && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                  <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <ScrollView  contentContainerStyle={styles.scrollViewContent}>
                                <Text style={styles.modalTitle}>Subject: {selectedHomework.subject}</Text>
                                <View style={styles.separator} />
                                <Text style={styles.modalDetail}>Title: {selectedHomework.title}</Text>
                                <View style={styles.separator} />
                                <Text style={styles.modalDetail}>Description: {selectedHomework.description}</Text>
                                <View style={styles.separator} />
                                <Text style={styles.modalDetail}>Attachments: {selectedHomework.attachments.length}</Text>
                                <View style={styles.separator} />
                                <Text style={styles.modalDetail}>Updated By: {selectedHomework.updatedBy}</Text>
                                <View style={styles.separator} />
                                <Button title="Close" onPress={() => setModalVisible(false)} />
                            </ScrollView>
                        </View>
                    </View>   
                </Modal>
            )}
        </View>
    );
};  
=======
const homeWorkImage = require('../../assets/images/home_work.png');
const classWorkImage = require('../../assets/images/class_work.png');
const notificationImage = require('../../assets/images/notifications.png');
const AcademicReportImage = require('../../assets/images/academic_report.png');
const StatisticalAnalysisImage = require('../../assets/images/s_analysis.png');

>>>>>>> d1af1d228b9f6385c24b1c491145966f02b48d9f
export default function StudentDashboard({ navigation }) {
    const { userData, setUserData } = useContext(UserDataContext); // Access userData from UserDataContext
    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false); // State for managing loading
    const [classwork, setClasswork] = useState([]);
    const [homework, setHomework] = useState([]);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'classwork', title: 'CLASSWORK' },
        { key: 'homework', title: 'HOMEWORK' },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
             case 'classwork':
                return <ClassworkRoute classwork={classwork} />;
            case 'homework':
                return <HomeworkRoute homework={homework} />;
            default:
                return null;
        }
    };
    // useEffect(() => {
    //     const fetchClasswork = async () => {
    //         try {
    //             const response = await fetch(`${baseUrl}/classwork`);
    //             const data = await response.json();
    //             setClasswork(data);
    //         } catch (error) {
    //             console.error('Failed to fetch classwork:', error);
    //         }
    //     };

    //     const fetchHomework = async () => {
    //         try {
    //             const response = await fetch(`${baseUrl}/homework`);
    //             const data = await response.json();
    //             const today = new Date().toISOString().split('T')[0];
    //             const recentHomework = data.filter(item => item.CreatedAt === today);
    //             setHomework(data);
    //         } catch (error) {
    //             console.error('Failed to fetch homework:', error);
    //         }
    //     };

    //     fetchClasswork();
    //     fetchHomework();
    // }, [baseUrl]);


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
<<<<<<< HEAD
                {/* <View style={styles.newSection}>
=======
                <ScrollView style={styles.scrollView}>
                <View style={styles.newSection}>
>>>>>>> d1af1d228b9f6385c24b1c491145966f02b48d9f
                    <Text style={styles.sectionHeading}>SERVICES</Text>
                    <View style={styles.servicesRow}>
                    <TouchableOpacity style={styles.serviceButton} onPress={() => navigation.navigate('Homework')}>
                        <Image source={homeWorkImage} style={styles.homeWorkImage} />
                        <Text style={styles.buttonText}>HOME WORK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.serviceButton} onPress={() => navigation.navigate('Homework')}>
                        <Image source={classWorkImage} style={styles.homeWorkImage} />
                        <Text style={styles.buttonText} >CLASS WORK</Text>

                    </TouchableOpacity>
                    </View>
                    <View style={styles.servicesRow}>
                    <TouchableOpacity style={styles.serviceButton} onPress={() => navigation.navigate('Notifications')}>
                        <Image source={notificationImage} style={styles.classWorkImage} />
                        <Text style={styles.buttonText}>NOTIFICATIONS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.serviceButton} onPress={() => navigation.navigate('AcademicReport')}>
                        <Image source={AcademicReportImage} style={styles.classWorkImage} />
                        <Text style={styles.buttonText}>ACADEMIC REPORT</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={styles.servicesRow}>
                    <TouchableOpacity style={styles.serviceButton} onPress={() => navigation.navigate('StatisticalAnalysis')}>
                        <Image source={StatisticalAnalysisImage} style={styles.classWorkImage} />
                        <Text style={styles.buttonText}>STATISTICAL ANALYSIS</Text>
                    </TouchableOpacity>
<<<<<<< HEAD
                </View> */}
                 <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={props => (
                        <TabBar
                            {...props}
                            indicatorStyle={styles.indicator}
                            style={styles.tabBar}
                            labelStyle={styles.tabLabel}
                        />
                    )}
                />
=======
                    </View>
                    

                </View>
                </ScrollView>
>>>>>>> d1af1d228b9f6385c24b1c491145966f02b48d9f
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
        padding: 10,
        width:'80%',
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        color: '#E31C62',
        marginBottom: 10,
        left: 20,
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
        fontSize: 10,
        marginTop: 10,
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
<<<<<<< HEAD
    tabBar: {
        backgroundColor: '#3C70D8',
    },
    indicator: {
        backgroundColor: '#E31C62',
    },
    tabLabel: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    scene: {
        flex: 1,
        //backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        marginTop: 10,
    },
    subjectButton: {
        backgroundColor: '#3C70D8',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#E0F2FEFF',
        borderRadius: 20,
        padding: 20,
        //alignItems: 'flex-start',
=======
    homeWorkImage: {
        width: 65,
        height: 65,
    },
    classWorkImage: {
        width: 65,
        height: 65,
        //left: 4,
    },
    servicesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,

    },
    serviceButton: {
        backgroundColor: '#E0F2FEFF',
        borderRadius: 10,
        padding: 5,
        margin: 5,
        width: '55%',
        height: '90%',
        marginLeft: 5,
>>>>>>> d1af1d228b9f6385c24b1c491145966f02b48d9f
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
<<<<<<< HEAD
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        //marginBottom: 15,
        //paddingRight: 100,
        textAlign: 'left',
    },
    modalDetail: {
        fontSize: 16,
        //marginBottom: 10,
       // paddingRight: 50,
       textAlign:'left',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    
=======
        shadowOpacity: 0.10,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
>>>>>>> d1af1d228b9f6385c24b1c491145966f02b48d9f
});