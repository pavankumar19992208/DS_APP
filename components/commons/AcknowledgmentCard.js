import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const AcknowledgmentCard = ({ visible, text, onClose }) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={styles.responseContainer}>
                        <LottieView
                            source={require('./jsonfiles/tick.json')}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                        />
                        <Text style={[styles.responseText, { color: 'black' }]}>{text}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#E0F2FE',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    responseContainer: {
        alignItems: 'center',
    },
    lottie: {
        width: 100,
        height: 100,
    },
    responseText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AcknowledgmentCard;