import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SLinkedInNavbar from '../SLinkedInNavbar'; // Import the SLinkedInNavbar component
import { UserDataContext, BaseUrlContext } from '../../../BaseUrlContext'; // Import BaseUrlContext
import CreateChat from './CreateChat'; // Import CreateChat component
import CreateCircle from './CreateCircle'; // Import CreateCircle component

const { width, height } = Dimensions.get('window');

const Chat = ({ navigation }) => {
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const [activeTab, setActiveTab] = useState('chats');
    const [modalVisible, setModalVisible] = useState(false);
    const [createChatVisible, setCreateChatVisible] = useState(false);
    const [createCircleVisible, setCreateCircleVisible] = useState(false);
    const [chats, setChats] = useState([]);
    const [circles, setCircles] = useState([]);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (activeTab === 'circles') {
            fetchCircles();
        }
    }, [activeTab]);

    const fetchChats = async () => {
        try {
            const response = await fetch(`${baseUrl}/getchats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: userData.UserId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setChats(data);
            console.log("chat data", data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const fetchCircles = async () => {
        try {
            const chatIds = JSON.parse(userData.circles || '[]').map(chat => chat.ChatId);
            console.log("chatIds", chatIds);
            const response = await fetch(`${baseUrl}/getcircles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ChatIds: chatIds }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCircles(data);
            console.log("circle data", data);
        } catch (error) {
            console.error('Error fetching circles:', error);
        }
    };

    const formatMessageTime = (messageTime) => {
        const date = new Date(messageTime);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            return `${day} ${month}`;
        }
    };

    const renderChatItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatContainer} 
            onPress={() => navigation.navigate('ChatScreen', { chatId: item.ChatId, friendProfile: item.FriendProfile })}
        >
            <Image
                source={item.FriendProfile.Photo ? { uri: item.FriendProfile.Photo } : require('../../../assets/images/studentm.png')}
                style={styles.profilePic}
            />
            <View style={styles.chatDetails}>
                <Text style={styles.userName}>{item.FriendProfile.UserName || item.FriendProfile.Name}</Text>
                <Text style={styles.latestMessage}>{item.LatestMessage}</Text>
            </View>
            <View style={styles.messageTimeContainer}>
                <Text style={styles.messageTime}>{formatMessageTime(item.MessageTime)}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderCircleItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatContainer} 
            onPress={() => navigation.navigate('ChatScreen', { chatId: item.ChatId, friendProfile: { Name: item.CircleName } })}
        >
            <View style={styles.circleProfilePic}>
                <Text style={styles.circleProfilePicText}>{item.CircleName.charAt(0)}</Text>
            </View>
            <View style={styles.chatDetails}>
                <Text style={styles.userName}>{item.CircleName}</Text>
                <Text style={styles.latestMessage}>{item.LatestMessage}</Text>
            </View>
            <View style={styles.messageTimeContainer}>
                <Text style={styles.messageTime}>{formatMessageTime(item.MessageTime)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
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
                    <FlatList
                        data={chats}
                        keyExtractor={(item) => item.ChatId.toString()}
                        renderItem={renderChatItem}
                        contentContainerStyle={styles.chatList}
                    />
                ) : (
                    circles.length > 0 ? (
                        <FlatList
                            data={circles}
                            keyExtractor={(item) => item.ChatId.toString()}
                            renderItem={renderCircleItem}
                            contentContainerStyle={styles.chatList}
                        />
                    ) : (
                        <Text style={styles.placeholderText}>You aren't part of any circles.</Text>
                    )
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
                        <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); setCreateChatVisible(true); }}>
                            <Text style={styles.modalButtonText}>New Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); setCreateCircleVisible(true); }}>
                            <Text style={styles.modalButtonText}>New Circle</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Create Chat Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={createChatVisible}
                onRequestClose={() => setCreateChatVisible(false)}
            >
                <CreateChat setCreateChatVisible={setCreateChatVisible} navigation={navigation} />
            </Modal>

            {/* Create Circle Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={createCircleVisible}
                onRequestClose={() => setCreateCircleVisible(false)}
            >
                <CreateCircle setCreateCircleVisible={setCreateCircleVisible} navigation={navigation} />
            </Modal>

            {/* Bottom Navbar */}
            <SLinkedInNavbar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
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
    chatList: {
        padding: 10,
    },
    chatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        height: height * 0.08,
        width: width * 0.95, // Set width to 90% of screen width
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    circleProfilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0E5E9D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    circleProfilePicText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    latestMessage: {
        fontSize: 14,
        color: '#888',
    },
    messageTimeContainer: {
        alignItems: 'flex-end',
    },
    messageTime: {
        paddingTop: 25,
        fontSize: 12,
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
    navbarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default Chat;