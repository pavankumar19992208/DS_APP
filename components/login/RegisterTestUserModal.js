import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { BaseUrlContext } from '../../BaseUrlContext'; // Import the BaseUrlContext
import AniLoad from '../commons/jsonfiles/AniLoad.json'; // Import the Lottie animation JSON file

const RegisterTestUserModal = ({ visible, onClose }) => {
    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context
    const [mobileNumber, setMobileNumber] = useState('');
    const [name, setName] = useState('');
    const userType = 'tester'; // Default user type
    const [loading, setLoading] = useState(false); // State to manage loader visibility

    const handleRegister = async () => {
        const userId = `Q${mobileNumber}`; // Create userId by concatenating 'Q' with mobileNumber
        setLoading(true); // Show loader
        try {
            const response = await fetch(`${baseUrl}/registertestuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: userId, Name: name, user_type: userType }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            Alert.alert('Success', data.message);
            onClose(); // Close the modal on success
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {loading ? (
                        <LottieView
                            source={AniLoad}
                            autoPlay
                            loop
                            style={styles.loader}
                        />
                    ) : (
                        <>
                            <Text style={styles.title}>Register Test User</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mobile Number"
                                value={mobileNumber}
                                onChangeText={setMobileNumber}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="User Type"
                                value={userType}
                                editable={false}
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
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
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: '#0E5E9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    closeButton: {
        alignItems: 'center',
        width: '100%',
    },
    closeButtonText: {
        color: '#0E5E9D',
        fontSize: 16,
    },
    loader: {
        width: 100,
        height: 100,
    },
});

export default RegisterTestUserModal;