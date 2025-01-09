import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons
import { useNavigationState } from '@react-navigation/native';
import { UserDataContext } from '../../BaseUrlContext';

const SLinkedInNavbar = ({ navigation }) => {
    const currentRoute = useNavigationState(state => state.routes[state.index].name);
    const { userData } = useContext(UserDataContext);

    const handleHomePress = () => {
        if (userData.user_type === 'student') {
            navigation.navigate('StudentDashboard');
        } else {
            navigation.navigate('TeacherDashboard');
        }
    };

    return (
        <View style={styles.bottomNavbar}>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    (currentRoute === 'StudentDashboard' || currentRoute === 'TeacherDashboard') && styles.activeIconContainer,
                ]}
                onPress={handleHomePress}
            >
                <Ionicons name="home" size={30} color="#0E5E9D" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'AddPost' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('AddPost')}
            >
                <Ionicons name="add-circle" size={30} color="#0E5E9D" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'SLinkedIn' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('SLinkedIn')}
            >
                <Ionicons name="play" size={30} color="#0E5E9D" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'SearchUsers' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('SearchUsers')}
            >
                <Ionicons name="search" size={30} color="#0E5E9D" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'Chat' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('Chat')}
            >
                <Ionicons name="chatbubble" size={30} color="#0E5E9D" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNavbar: {
        height: '8%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    iconContainer: {
        height: '100%',
        width: Dimensions.get('window').height * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIconContainer: {
        borderTopWidth: 3,
        borderTopColor: '#0E5E9D',
    },
});

export default SLinkedInNavbar;