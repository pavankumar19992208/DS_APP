import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BaseUrlContext, UserDataContext } from '../../BaseUrlContext'; // Import UserDataContext

const SFooterNavbar = ({ navigation }) => {
    const { userData, setUserData } = useContext(UserDataContext); // Access and update userData from UserDataContext
    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context

    const handleNavigateToSLinkedIn = async () => {
        const payload = {
            UserId: userData.student.UserId,
            Name: userData.student.Name,
            user_type: 'student', // Assuming user_type is 'student'
        };

        console.log('Payload:', payload); // Print the payload to the console

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
        }
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('StudentDashboard')}>
                <Icon name="home" size={30} color="#F965A0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={handleNavigateToSLinkedIn}>
                <Image source={require('../../assets/images/nl_logo.png')} style={styles.nlLogo} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('BotGenie')}>
                <Image source={require('../../assets/images/genie_icon.png')} style={styles.genieLogo} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Planner')}>
                <Icon name="event" size={30} color="#F965A0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Learn')}>
                <Icon name="auto-stories" size={30} color="#F965A0" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#E31C6200',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    genieLogo: {
        width: 60,
        height: 80,
        marginBottom: 20,
    },
    nlLogo: {
        width: 40,
        height: 40,
    },
});

export default SFooterNavbar;