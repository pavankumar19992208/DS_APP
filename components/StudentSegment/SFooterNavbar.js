import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SFooterNavbar = ({ navigation }) => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('StudentDashboard')}>
                <Icon name="home" size={30} color="#F965A0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('SLinkedIn')}>
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