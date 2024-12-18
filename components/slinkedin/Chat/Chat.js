import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SLinkedInNavbar from '../SLinkedInNavbar'; // Import the SLinkedInNavbar component
import { UserDataContext, BaseUrlContext } from '../../../BaseUrlContext'; // Import BaseUrlContext

const { width, height } = Dimensions.get('window');

const Chat = ({ navigation }) => {
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const [activeTab, setActiveTab] = useState('chats');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetchFriendsProfiles();
    }, []);

    const fetchFriendsProfiles = async () => {
        try {
            const friendsList = JSON.parse(userData.friends_list || '[]');
            console.log('Friends List:', friendsList);
            const friendsProfiles = await Promise.all(
                friendsList.map(async (friendId) => {
                    const response = await fetch(`${baseUrl}/profiledata`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ UserId: friendId }),
                    });
                    if (response.ok) {
                        return response.json();
                    }
                    return null;
                })
            );
            setFriends(friendsProfiles.filter(profile => profile !== null));
            setResults(friendsProfiles.filter(profile => profile !== null));
            console.log('Friends Profiles:', friendsProfiles);
        } catch (error) {
            console.error('Error fetching friends profiles:', error);
        }
    };

    const handleNewChat = () => {
        setModalVisible(false);
        setSearchVisible(true);
    };

    const handleNewCircle = () => {
        setModalVisible(false);
        navigation.navigate('NewCircle');
    };

    const handleSearch = (text) => {
        setQuery(text);
        if (text) {
            const filteredResults = friends.filter(friend =>
                (friend.UserName && friend.UserName.toLowerCase().includes(text.toLowerCase())) ||
                (friend.Name && friend.Name.toLowerCase().includes(text.toLowerCase()))
            );
            setResults(filteredResults);
        } else {
            setResults(friends);
        }
    };

    const handleSelectFriend = async (friend) => {
        setSearchVisible(false);
        try {
            const response = await fetch(`${baseUrl}/createchat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId1: userData.UserId, UserId2: friend.UserId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            navigation.navigate('ChatScreen', { chatId: data.ChatId, friendProfile: friend });
        } catch (error) {
            console.error('Error creating chat:', error);
        }
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

            {/* Search Modal for New Chat */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={searchVisible}
                onRequestClose={() => setSearchVisible(false)}
            >
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search friends..."
                        value={query}
                        onChangeText={handleSearch}
                    />
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.UserId}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.resultItem} 
                                onPress={() => handleSelectFriend(item)}
                            >
                                <Image
                                    source={item.Photo ? { uri: item.Photo } : require('../../../assets/images/studentm.png')}
                                    style={styles.profilePic}
                                />
                                <Text style={styles.resultText}>{item.UserName} ({item.Name})</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>

            {/* Bottom Navbar */}
            {/* <View style={styles.navbarContainer}>
                <SLinkedInNavbar navigation={navigation} />
            </View> */}
        </View>
        <SLinkedInNavbar navigation={navigation} />
        </>
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
    searchContainer: {
        flex: 1,
        backgroundColor: '#E0F2FE',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    resultText: {
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