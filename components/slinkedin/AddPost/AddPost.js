import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserDataContext } from '../../../BaseUrlContext'; // Import UserDataContext
import * as ImagePicker from 'expo-image-picker';
import { FlatList } from 'react-native-gesture-handler';

const AddPost = ({ navigation }) => {
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const [postContent, setPostContent] = useState('');
    const [tags, setTags] = useState('');
    const [privacy, setPrivacy] = useState('Public');
    const [location, setLocation] = useState('');
    const [postType, setPostType] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);

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
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setAttachments([...attachments, ...result.assets.map(asset => asset.uri)]);
        }
    };

    const handleSubmit = async () => {
        if (!postContent) {
            Alert.alert('Error', 'Post content is mandatory.');
            return;
        }

        setLoading(true);

        const postData = {
            studentName: userData.student.studentName,
            studentId: userData.student.UserId,
            schoolName: userData.student.SCHOOL_NAME,
            postContent,
            tags,
            privacy,
            location,
            postType,
            attachments,
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${userData.baseUrl}/addpost`, {
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
                placeholder="Tags (e.g., @student, @teacher)"
                value={tags}
                onChangeText={setTags}
            />
            <TextInput
                style={styles.input}
                placeholder="Privacy (e.g., Public, Connections Only)"
                value={privacy}
                onChangeText={setPrivacy}
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />
            <TextInput
                style={styles.input}
                placeholder="Post Type (e.g., Collaboration, Achievement)"
                value={postType}
                onChangeText={setPostType}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.submitButtonText}>{loading ? 'Posting...' : 'Post'}</Text>
            </TouchableOpacity>
        </ScrollView>
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
        width: '100%',
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
        width: Dimensions.get('window').height * 0.4,
        height: Dimensions.get('window').height * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addMoreItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').height * 0.4,
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