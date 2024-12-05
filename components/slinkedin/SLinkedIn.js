import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SLinkedInNavbar from './SLinkedInNavbar'; // Import the new component

const SLinkedIn = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Top Navbar */}
            <View style={styles.topNavbar}>
                <View style={styles.column1}>
                    <Image
                        source={require('../../assets/images/studentm.png')} // Replace with actual profile picture source
                        style={styles.profilePic}
                    />
                </View>
                <View style={styles.column2}>
                    <View style={styles.row1}>
                        <Text style={styles.studentName}>Student Name</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.schoolName}>School Name</Text>
                    </View>
                </View>
                <View style={styles.column3}>
                    <TouchableOpacity onPress={() => navigation.navigate('Challenges')}>
                        <Icon name="emoji-events" size={40} color="#E31C62D0" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Middle Section for Feed */}
            <View style={styles.feedContainer}>
                <Text>Feed goes here...</Text>
            </View>

            {/* Bottom Navbar */}
            <SLinkedInNavbar navigation={navigation} />
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
});

export default SLinkedIn;