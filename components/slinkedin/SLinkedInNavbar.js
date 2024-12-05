import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigationState } from '@react-navigation/native';

const SLinkedInNavbar = ({ navigation }) => {
    const currentRoute = useNavigationState(state => state.routes[state.index].name);

    return (
        <View style={styles.bottomNavbar}>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'StudentDashboard' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('StudentDashboard')}
            >
                <Icon name="home" size={30} color="#0E5E9D" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'AddPost' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('AddPost')}
            >
                <Icon name="add-circle" size={30} color="#0E5E9D" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'SLinkedIn' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('SLinkedIn')}
            >
                <Icon name="rss-feed" size={30} color="#0E5E9D" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'SearchUsers' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('SearchUsers')}
            >
                <Icon name="search" size={30} color="#0E5E9D" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.iconContainer,
                    currentRoute === 'Chat' && styles.activeIconContainer,
                ]}
                onPress={() => navigation.navigate('Chat')}
            >
                <Icon name="chat" size={30} color="#0E5E9D" />
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