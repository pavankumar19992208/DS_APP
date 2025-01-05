import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Clipboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Help = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        alert('Copied to Clipboard');
    };

    return (
        <>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.buttonText}>TESTING CREDENTIALS</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.card}>
                        <Text style={styles.heading}>STUDENT CREDENTIALS (for testing purpose)</Text>
                        <View style={styles.credentialRow}>
                            <Text>ID: S9182442102</Text>
                            <TouchableOpacity onPress={() => copyToClipboard('S362010938')}>
                                <Icon name="content-copy" size={20} color="#007bff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.credentialRow}>
                            <Text>PWD: Data@9502</Text>
                            <TouchableOpacity onPress={() => copyToClipboard('Data@9502')}>
                                <Icon name="content-copy" size={20} color="#007bff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <View style={styles.card}>
                        <Text style={styles.heading}>TEACHER CREDENTIALS (for testing purpose)</Text>
                        <View style={styles.credentialRow}>
                            <Text>ID: TPA2011651</Text>
                            <TouchableOpacity onPress={() => copyToClipboard('TPA2011651')}>
                                <Icon name="content-copy" size={20} color="#007bff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.credentialRow}>
                            <Text>PWD: Data@9502</Text>
                            <TouchableOpacity onPress={() => copyToClipboard('Data@9502')}>
                                <Icon name="content-copy" size={20} color="#007bff" />
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#007bff',
        borderRadius: 50,
        padding: 15,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    card: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    credentialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#007bff',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Help;