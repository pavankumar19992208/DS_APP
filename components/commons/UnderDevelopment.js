import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import underdevelopment from './jsonfiles/underdevelopment.json';

const { width} = Dimensions.get('window');

const UnderDevelopment = ({ message }) => (
    <View style={styles.container}>
        <Text style={styles.underDevelopment}>UNDER DEVELOPMENT</Text>
        <View style={styles.animationContainer}>
            <LottieView
                source={underdevelopment}
                autoPlay
                loop
                style={styles.animation}
            />
        </View>
        <View style={styles.box}>
            <Text style={styles.message}>{message}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#E0F2FE',
    },
    underDevelopment: {
        fontSize: 20,
        color: 'red',
        marginBottom: 20,
    },
    animationContainer: {
        width: 220,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    animation: {
        width: 250,
        height: 250,
    },
    box: {
        width: width - 32,
        padding: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        fontFamily: 'Arial',
        lineHeight: 24,
    },
});

export default UnderDevelopment;