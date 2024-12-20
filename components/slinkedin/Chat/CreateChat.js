import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserDataContext, BaseUrlContext } from '../../../BaseUrlContext'; // Import BaseUrlContext

const { width, height } = Dimensions.get('window');

const CreateChat = ({ setCreateChatVisible }) => {
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetchFriendsProfiles();
    }, []);

    const fetchFriendsProfiles = async () => {
        try {
            const friendsList = JSON.parse(userData.friends_list || '[]');
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
            const existingChatFriendIds = JSON.parse(userData.chats || '[]').map(chat => chat.FriendId);
            const filteredFriends = friendsProfiles.filter(profile => profile !== null && !existingChatFriendIds.includes(profile.UserId));
            setFriends(filteredFriends);
            setResults(filteredFriends);
        } catch (error) {
            console.error('Error fetching friends profiles:', error);
        }
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
        setCreateChatVisible(false);
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
        <View style={styles.container}>
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
                <TouchableOpacity style={styles.closeButton} onPress={() => setCreateChatVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
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
    closeButton: {
        backgroundColor: '#0E5E9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CreateChat;