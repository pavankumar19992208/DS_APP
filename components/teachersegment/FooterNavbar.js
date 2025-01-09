import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons

const FooterNavbar = ({ navigation, data, handleNavigateToSLinkedIn, origin }) => {
    const handleHomePress = () => {
        if (origin === 'teacher') {
            navigation.navigate('TeacherDashboard');
        } else {
            navigation.navigate('StudentDashboard');
        }
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('UploadMarks', { data })}>
                <Ionicons name="stats-chart" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, styles.highlightedNavItem]} onPress={handleNavigateToSLinkedIn}>
                <Image source={require('../../assets/images/nl_logo.png')} style={styles.nlLogo} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={handleHomePress}>
                <Ionicons name="home" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Notify', { data })}>
                <Ionicons name="notifications" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('UpdateClassWork', { data })}>
                <Ionicons name="calendar" size={30} color="#FFF" />
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
        backgroundColor: '#3C70D8CA',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    nlLogo: {
        width: 40,
        height: 40,
    },
    highlightedNavItem: {
        borderColor: '#E31C62',
        borderWidth: 2,
        borderRadius: 30,
        backgroundColor: '#F965A0',
        padding: 5,
    },
});

export default FooterNavbar;