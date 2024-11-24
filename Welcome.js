import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const windowWidth = Dimensions.get('window').width;

const WelcomeScreen = ({ navigation }) => {
    const [firstAnimationFinished, setFirstAnimationFinished] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 8000); // Adjusted to 8 seconds to account for both animations
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            {!firstAnimationFinished ? (
                <LottieView
                    source={require('./components/commons/jsonfiles/welcome1.json')}
                    autoPlay
                    loop={false}
                    style={styles.lottie}
                    onAnimationFinish={() => setFirstAnimationFinished(true)}
                />
            ) : (
                <LottieView
                    source={require('./components/commons/jsonfiles/welcome2.json')}
                    autoPlay
                    loop={false}
                    style={styles.lottie}
                />
            )}
            <View style={styles.headerContainer}>
                <View style={styles.titleStyle}>
                    <Text style={{
                        margin: 0,
                        fontSize: windowWidth < 900 ? 16 : (windowWidth < 1000 ? 32 : 48),
                        fontFamily: 'RubikDoodleShadow',
                    }}>
                        DIGITAL SCHOOLING
                    </Text>
                    <View style={styles.neuraLifeContainer}>
                        <Text style={styles.neuraLifeText}>
                            <Text style={{ color: '#0E5E9D' }}>neura</Text>
                            <Text style={{ color: '#F965A0' }}>L</Text>
                            <Text style={{ color: '#0E5E9D' }}>ife</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E0F2FE',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 200,
        height: 200,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    titleStyle: {
        textAlign: 'center',
    },
    neuraLifeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    neuraLifeText: {
        fontWeight: '600',
        fontSize: windowWidth < 900 ? 22 : 32,
        textAlign: 'center',
    },
});

export default WelcomeScreen;