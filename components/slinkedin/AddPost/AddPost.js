import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserDataContext, BaseUrlContext } from '../../../BaseUrlContext'; // Import UserDataContext
import { FlatList } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions
import { storage } from '../../connections/Firebase'; // Import Firebase storage instance
import * as ImagePicker from 'expo-image-picker'; // Import Expo Image Picker
import ScreenWrapper from '../../../ScreenWrapper';

const AddPost = ({ navigation }) => {
    const { userData, setUserData } = useContext(UserDataContext); // Access userData from UserDataContext
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from context
    const [postContent, setPostContent] = useState('');
    const [tags, setTags] = useState('');
    const [collabWith, setCollabWith] = useState('');
    const [privacy, setPrivacy] = useState('Public');
    const [location, setLocation] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]); // State for suggestions
    const [showSuggestions, setShowSuggestions] = useState(false); // State to control visibility of suggestions container

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const handleAddAttachment = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            allowsMultipleSelection: false, // Disable multiple selection
        });

        if (!result.canceled) {
            setAttachments([...attachments, ...result.assets.map(asset => asset.uri)]);
        }
    };

    const fetchFriendName = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/profiledata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: id }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            return data.Name; // Assuming the response contains a friend object with a Name property
        } catch (error) {
            console.error('Error fetching friend name:', error);
            return null;
        }
    };
    
    const handleCollabWithChange = async (text) => {
        setCollabWith(text);
        setShowSuggestions(true); // Show suggestions container
        const friendsList = Array.isArray(userData.friends_list) ? userData.friends_list : []; // Ensure friends list is an array
        const matches = friendsList.filter(friend => friend.includes(text.replace('@', '')));
        const names = await Promise.all(matches.map(id => fetchFriendName(id)));
        setSuggestions(names.filter(name => name)); // Filter out null values
    };
    
    const handleTagsChange = async (text) => {
        setTags(text);
        setShowSuggestions(true); // Show suggestions container
        const friendsList = Array.isArray(userData.friends_list) ? userData.friends_list : []; // Ensure friends list is an array
        const matches = friendsList.filter(friend => friend.includes(text.replace('@', '')));
        const names = await Promise.all(matches.map(id => fetchFriendName(id)));
        setSuggestions(names.filter(name => name)); // Filter out null values
    };

    const uploadAttachments = async () => {
        const uploadedUrls = [];
        for (let i = 0; i < attachments.length; i++) {
            const uri = attachments[i];
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileName = `${userData.UserId}_${i}`;
            const storageRef = ref(storage, `Posts/${userData.UserId}/${fileName}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            uploadedUrls.push(downloadURL);
        }
        return uploadedUrls;
    };

    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async () => {
        if (!postContent) {
            Alert.alert('Error', 'Post content is mandatory.');
            return;
        }
    
        setLoading(true);
    
        try {
            const uploadedUrls = await uploadAttachments();
    
            const postData = {
                UserId: userData.UserId,
                PostContent: postContent,
                Tags: tags.split(',').map(tag => tag.trim()), // Convert tags to list of strings
                Collaborations: collabWith.split(',').map(collab => collab.trim()), // Convert collabWith to list of strings
                Privacy: privacy,
                Location: location,
                MediaUrl: uploadedUrls,
                TimeStamp: formatDateTime(new Date()),
                FriendsList: userData.friends_list || [], // Include the friends list
            };
            console.log("payload:", postData);
            const response = await fetch(`${baseUrl}/addpost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            Alert.alert('Success', 'Post added successfully.');
            navigation.navigate('SLinkedIn');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderAttachmentItem = ({ item, index }) => (
        <View style={styles.attachmentItem}>
            <Image source={{ uri: item }} style={styles.attachment} />
        </View>
    );

    const renderAddMoreItem = () => (
        <TouchableOpacity style={styles.addMoreItem} onPress={handleAddAttachment}>
            <Icon name="add" size={40} color="#0E5E9D" />
            <Text style={styles.addMoreText}>{attachments.length === 0 ? '+ ADD FILES' : '+ ADD MORE'}</Text>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Add Post</Text>
            <View style={styles.attachmentContainer}>
                <FlatList
                    data={[...attachments, 'addMore']}
                    renderItem={({ item, index }) => (item === 'addMore' ? renderAddMoreItem() : renderAttachmentItem({ item, index }))}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="What's on your mind?"
                value={postContent}
                onChangeText={setPostContent}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Tags (e.g., @username)"
                value={tags}
                onChangeText={handleTagsChange}
                onFocus={() => setShowSuggestions(true)} // Show suggestions container when input is focused
            />
            <TextInput
                style={styles.input}
                placeholder="Collab With (e.g., @friend)"
                value={collabWith}
                onChangeText={handleCollabWithChange}
                onFocus={() => setShowSuggestions(true)} // Show suggestions container when input is focused
            />
            {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    {suggestions.map((suggestion, index) => (
                        <TouchableOpacity key={index} onPress={() => {
                            setCollabWith(`@${suggestion}`);
                            setShowSuggestions(false); // Hide suggestions container after selection
                        }}>
                            <Text style={styles.suggestionText}>{suggestion}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.doneButton} onPress={() => setShowSuggestions(false)}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.row}>
                <Picker
                    selectedValue={privacy}
                    style={styles.picker}
                    onValueChange={(itemValue) => setPrivacy(itemValue)}
                >
                    <Picker.Item label="Public" value="Public" />
                    <Picker.Item label="Friends Only" value="Friends Only" />
                    <Picker.Item label="Private" value="Private" />
                </Picker>
                <View style={styles.locationContainer}>
                    <TextInput
                        style={styles.locationInput}
                        placeholder="Location"
                        value={location}
                        onChangeText={setLocation}
                    />
                    <TouchableOpacity style={styles.locationIconContainer}>
                        <Icon name="location-on" size={24} color="#0E5E9D" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.submitButtonText}>{loading ? 'Posting...' : 'Post'}</Text>
            </TouchableOpacity>
        </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#E0F2FE',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    attachmentContainer: {
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').height * 0.414,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    attachmentItem: {
        width: Dimensions.get('window').height * 0.41075, // Set width to the same as attachmentContainer
        height: Dimensions.get('window').height * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addMoreItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').height * 0.41075, // Set width to the same as attachmentContainer
        height: Dimensions.get('window').height * 0.4,
        borderWidth: 1,
        borderColor: '#0E5E9D',
        borderRadius: 10,
    },
    addMoreText: {
        color: '#0E5E9D',
        marginTop: 5,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    suggestionsContainer: {
        position: 'absolute',
        top: '50%', // Adjust this value as needed
        left: '10%', // Adjust this value as needed
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        zIndex: 1, // Ensure it appears above other components
        padding: 10,
    },
    suggestionText: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    doneButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    doneButtonText: {
        color: '#0E5E9D',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    picker: {
        flex: 1,
        height: 60,
    },
    locationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginLeft: 10,
    },
    locationInput: {
        flex: 1,
        padding: 10,
    },
    locationIconContainer: {
        padding: 10,
    },
    attachment: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: '#0E5E9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AddPost;