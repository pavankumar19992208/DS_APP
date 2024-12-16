import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SLinkedInNavbar from './SLinkedInNavbar'; // Import the new component
import { UserDataContext, BaseUrlContext } from '../../BaseUrlContext'; // Import UserDataContext and BaseUrlContext
import Feed from './Feed'; // Import the Feed component

const SLinkedIn = ({ navigation }) => {
    const { userData, setUserData } = useContext(UserDataContext); // Access userData from UserDataContext
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        console.log("slinkedin: ", userData);
        if (userData.UserName === null) {
            setModalVisible(true);
        }
    }, [userData]);

    const handleUpdateUsername = async () => {
        try {
            const response = await fetch(`${baseUrl}/updateusername`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: userData.user?.UserId ?? '', userName: username }),
            });

            const data = await response.json();

            if (data.message === 'Username already exists') {
                setUsernameError('Username already exists');
            } else {
                setUserData({ ...userData, UserName: username });
                setModalVisible(false);
                setUsernameError('');
                Alert.alert('Success', 'Username updated successfully');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Navbar */}
            <View style={styles.topNavbar}>
                <View style={styles.column1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile', { profileId: userData.UserId })}>
                        <Image
                            source={userData.user?.Photo ? { uri: userData.user.Photo } : require('../../assets/images/studentm.png')} // Replace with actual profile picture source
                            style={styles.profilePic}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.column2}>
                    <View style={styles.row1}>
                        <Text style={styles.studentName}>{userData.user?.Name ?? ''}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.schoolName}>{userData.user?.SCHOOL_NAME ?? ''}</Text>
                    </View>
                </View>
                <View style={styles.column3}>
                    <TouchableOpacity onPress={() => navigation.navigate('NlNotifications')}>
                        <Icon name="notifications" size={40} color="#E31C62D0" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Middle Section for Feed */}
            <View style={styles.feedContainer}>
                <Feed navigation={navigation} />
            </View>

            {/* Bottom Navbar */}
            <SLinkedInNavbar navigation={navigation} />

            {/* Modal for Setting Username */}
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
                        <Text style={styles.modalTitle}>Set Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                        <TouchableOpacity style={styles.submitButton} onPress={handleUpdateUsername}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
    },
    topNavbar: {
        height: '8%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    column1: {
        alignItems: 'flex-start',
    },
    column2: {
        flex: 1,
        // justifyContent: 'center',
    },
    column3: {
        marginRight: 10,
        alignItems: 'flex-end',
    },
    row: {
        height: '35%',
        justifyContent: 'top',
        paddingBottom: 5,
    },
    row1: {
        height: '65%',
        paddingTop: 20,
        justifyContent: 'center',
    },
    profilePic: {
        width: Dimensions.get('window').height * 0.08,
        height: Dimensions.get('window').height * 0.08,
        borderRadius: 5,
    },
    studentName: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlignVertical: 'bottom',
    },
    schoolName: {
        fontSize: 14,
        textAlignVertical: 'top',
    },
    feedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#0E5E9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SLinkedIn;