import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, FlatList, Image, Alert } from 'react-native';
import { UserDataContext, BaseUrlContext } from '../../../BaseUrlContext'; // Import BaseUrlContext

const { width, height } = Dimensions.get('window');

const CreateCircle = ({ setCreateCircleVisible, navigation }) => {
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [circleName, setCircleName] = useState('');
    const [circleDescription, setCircleDescription] = useState('');
    const [step, setStep] = useState(1); // Step 1: Search Friends, Step 2: Circle Details

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
            const filteredFriends = friendsProfiles.filter(profile => profile !== null);
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

    const handleSelectCircleFriend = (friend) => {
        setSelectedFriends(prevState => {
            if (prevState.includes(friend.UserId)) {
                return prevState.filter(id => id !== friend.UserId);
            } else {
                return [...prevState, friend.UserId];
            }
        });
    };

    const handleNext = () => {
        if (selectedFriends.length === 0) {
            Alert.alert('Error', 'Please select at least one friend.');
            return;
        }
        setStep(2);
    };

    const handleCreateCircle = async () => {
        if (!circleName) {
            Alert.alert('Error', 'Please provide a circle name.');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/createcircle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CircleName: circleName,
                    CreatedBy: userData.UserId,
                    Users: selectedFriends,
                    CreatedAt: new Date(),
                    Description: circleDescription,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCreateCircleVisible(false);
            navigation.navigate('ChatScreen', { chatId: data.ChatId, friendProfile: { Name: circleName } });
        } catch (error) {
            console.error('Error creating circle:', error);
        }
    };

    return (
        <View style={styles.container}>
            {step === 1 ? (
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
                                style={[styles.resultItem, selectedFriends.includes(item.UserId) && styles.selectedFriend]} 
                                onPress={() => handleSelectCircleFriend(item)}
                            >
                                <Image
                                    source={item.Photo ? { uri: item.Photo } : require('../../../assets/images/studentm.png')}
                                    style={styles.profilePic}
                                />
                                <Text style={styles.resultText}>{item.UserName} ({item.Name})</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            placeholder="Circle Name"
                            value={circleName}
                            onChangeText={setCircleName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Circle Description"
                            value={circleDescription}
                            onChangeText={setCircleDescription}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleCreateCircle}>
                            <Text style={styles.submitButtonText}>Create Circle</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    selectedFriend: {
        backgroundColor: '#DCF8C6',
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
    nextButton: {
        backgroundColor: '#0E5E9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F2FE',
        padding: 20,
    },
    modalView: {
        width: '100%',
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
    submitButton: {
        backgroundColor: '#0E5E9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CreateCircle;