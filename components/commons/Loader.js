import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

const quotes = [
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "The function of education is to teach one to think intensively and to think critically. - Martin Luther King Jr.",
    "Education is not preparation for life; education is life itself. - John Dewey",
    "The roots of education are bitter, but the fruit is sweet. - Aristotle",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. - Malcolm X",
    "An investment in knowledge pays the best interest. - Benjamin Franklin",
    "The purpose of education is to replace an empty mind with an open one. - Malcolm Forbes",
    "Education is the key to unlock the golden door of freedom. - George Washington Carver",
    "The goal of education is the advancement of knowledge and the dissemination of truth. - John F. Kennedy",
    "Education is the movement from darkness to light. - Allan Bloom"
];

const Loader = ({ visible }) => {
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        let interval;
        if (visible) {
            interval = setInterval(() => {
                setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
            }, 2000); // Change quote every 2 seconds
        }
        return () => clearInterval(interval);
    }, [visible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.loaderContainer}>
                    <LottieView
                        source={require('./jsonfiles/sloader.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                    <Text style={styles.quoteText}>{quotes[quoteIndex]}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loaderContainer: {
        width: 300,
        backgroundColor: '#E0F2FE',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    lottie: {
        width: 150,
        height: 200,
    },
    quoteText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Loader;