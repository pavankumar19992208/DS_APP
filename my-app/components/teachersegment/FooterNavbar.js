import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FooterNavbar = ({ navigation }) => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Send Assessment Pressed')}>
                <Icon name="fact-check" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Upload Homework Pressed')}>
                <Icon name="add-home-work" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Home Pressed')}>
                <Icon name="home" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Notify Pressed')}>
                <Icon name="notification-add" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Update Class Work Pressed')}>
                <Icon name="update" size={30} color="#FFF" />
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
});

export default FooterNavbar;