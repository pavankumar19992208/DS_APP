import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SLinkedInNavbar from './SLinkedInNavbar'; // Import the SLinkedInNavbar component

const { width, height } = Dimensions.get('window');

const Chat = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('chats');
    const [modalVisible, setModalVisible] = useState(false);

    const handleNewChat = () => {
        setModalVisible(false);
        navigation.navigate('NewChat');
    };

    const handleNewCircle = () => {
        setModalVisible(false);
        navigation.navigate('NewCircle');
    };

    return (
        <>
        <View style={styles.container}>
            {/* Top Row */}
            <View style={styles.topRow}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
                        onPress={() => setActiveTab('chats')}
                    >
                        <Text style={styles.tabText}>Chats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'circles' && styles.activeTab]}
                        onPress={() => setActiveTab('circles')}
                    >
                        <Text style={styles.tabText}>Circles</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Icon name="add" size={30} color="#0E5E9D" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {activeTab === 'chats' ? (
                    <Text style={styles.placeholderText}>Chats will be displayed here</Text>
                ) : (
                    <Text style={styles.placeholderText}>Circles will be displayed here</Text>
                )}
            </View>

            {/* Modal for New Chat and New Circle */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleNewChat}>
                            <Text style={styles.modalButtonText}>New Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleNewCircle}>
                            <Text style={styles.modalButtonText}>New Circle</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Bottom Navbar
            <SLinkedInNavbar navigation={navigation} /> */}
        </View>
                    {/* Bottom Navbar */}
                    <SLinkedInNavbar navigation={navigation} />
                    </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
        paddingBottom: height * 0.08, // Adjust padding to accommodate the navbar
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tabContainer: {
        flexDirection: 'row',
    },
    tab: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginRight: 10,
    },
    activeTab: {
        backgroundColor: '#0E5E9D',
    },
    tabText: {
        color: '#000',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 18,
        color: '#888',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButton: {
        backgroundColor: '#0E5E9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Chat;